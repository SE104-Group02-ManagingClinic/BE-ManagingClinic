const db = require('../config/database');

class MedicineImportService {

    // Tạo phiếu nhập thuốc
    static async createMedicineImport(data) {
        try {
            const { MaThuoc, GiaNhap, NgayNhap, SoLuongNhap, HanSuDung } = data;

            // Bắt đầu transaction
            await db.beginTransaction();

            // 1. Kiểm tra thuốc tồn tại
            const [[thuoc]] = await db.query(
                "SELECT 1 FROM LOAITHUOC WHERE MaThuoc = ?",
                [MaThuoc]
            );

            if (!thuoc) {
                await db.rollback();
                return { error: "MEDICINE_NOT_FOUND" };
            }

            // 2. Lấy tỉ lệ tính giá bán
            const [[thamSo]] = await db.query(
                "SELECT TiLeTinhDonGiaBan FROM THAMSO LIMIT 1"
            );

            if (!thamSo) {
                await db.rollback();
                return { error: "NO_THAMSO" };
            }

            const GiaBan = Math.round(GiaNhap * thamSo.TiLeTinhDonGiaBan);

            // 3. Sinh mã lô
            const [[lastLot]] = await db.query(
                "SELECT MaLo FROM LOTHUOC ORDER BY MaLo DESC LIMIT 1"
            );

            let MaLo = "LO001";
            if (lastLot) {
                const num = parseInt(lastLot.MaLo.substring(2)) + 1;
                MaLo = "LO" + num.toString().padStart(3, "0");
            }

            // 4. Tạo lô thuốc mới
            await db.query(
                `INSERT INTO LOTHUOC (MaLo, MaThuoc, GiaBan, SoLuongTon, HanSuDung)
                VALUES (?, ?, ?, ?, ?)`,
                [MaLo, MaThuoc, GiaBan, SoLuongNhap, HanSuDung]
            );

            // 5. Sinh mã phiếu nhập
            const [[lastPNT]] = await db.query(
                "SELECT MaPNT FROM PHIEUNHAPTHUOC ORDER BY MaPNT DESC LIMIT 1"
            );

            let MaPNT = "PNT001";
            if (lastPNT) {
                const num = parseInt(lastPNT.MaPNT.substring(3)) + 1;
                MaPNT = "PNT" + num.toString().padStart(3, "0");
            }

            // 6. Tạo phiếu nhập
            await db.query(
                `INSERT INTO PHIEUNHAPTHUOC
                (MaPNT, MaLo, GiaNhap, NgayNhap, SoLuongNhap)
                VALUES (?, ?, ?, ?, ?)`,
                [MaPNT, MaLo, GiaNhap, NgayNhap, SoLuongNhap]
            );

            // Hoàn tất
            await db.commit();

            return { MaPNT, MaLo, MaThuoc, GiaNhap, GiaBan, SoLuongNhap, HanSuDung };
        }
        catch (error) {
            await db.rollback();
            console.log("MedicineImportService create Error:", error);
            return null;
        }
    }


    // Lấy danh sách phiếu nhập thuốc
    static async getMedicineImport() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    p.MaPNT,
                    p.MaLo,
                    t.MaThuoc,
                    t.TenThuoc,
                    p.GiaNhap,
                    p.SoLuongNhap,
                    p.NgayNhap,
                    l.GiaBan,
                    l.SoLuongTon,
                    l.HanSuDung
                FROM PHIEUNHAPTHUOC p
                JOIN LOTHUOC l ON p.MaLo = l.MaLo
                JOIN LOAITHUOC t ON l.MaThuoc = t.MaThuoc
                ORDER BY p.NgayNhap DESC
            `);

            return rows;
        }
        catch (error) {
            console.log("MedicineImportService get Error:", error);
            return null;
        }
    }


    // Cập nhật phiếu nhập thuốc
    static async updateMedicineImport(MaPNT, updateData) {
        try {
            const { GiaNhap, NgayNhap, SoLuongNhap, HanSuDung } = updateData;

            await db.beginTransaction();

            // 1. Lấy thông tin phiếu nhập + lô
            const [[oldPNT]] = await db.query(
                `SELECT p.MaLo, p.SoLuongNhap, l.SoLuongTon
                FROM PHIEUNHAPTHUOC p
                JOIN LOTHUOC l ON p.MaLo = l.MaLo
                WHERE p.MaPNT = ?`,
                [MaPNT]
            );

            if (!oldPNT) {
                await db.rollback();
                return { error: "PNT_NOT_FOUND" };
            }

            const { MaLo, SoLuongNhap: oldQty, SoLuongTon } = oldPNT;

            // 2. Kiểm tra lô đã được kê đơn chưa
            const [[used]] = await db.query(
                `SELECT 1 FROM CT_THUOC WHERE MaLo = ? LIMIT 1`,
                [MaLo]
            );

            if (used) {
                await db.rollback();
                return {
                    error: "LOT_ALREADY_USED",
                    message: "Không thể cập nhật phiếu nhập vì lô thuốc đã được kê đơn"
                };
            }

            // 3. Tính chênh lệch số lượng
            const delta = SoLuongNhap - oldQty;

            if (SoLuongTon + delta < 0) {
                await db.rollback();
                return { error: "INVALID_STOCK" };
            }

            // 4. Nếu giá nhập đổi → cập nhật lại giá bán
            if (GiaNhap !== undefined) {
                const [[thamSo]] = await db.query(
                    `SELECT TiLeTinhDonGiaBan FROM THAMSO LIMIT 1`
                );

                const GiaBan = Math.round(GiaNhap * thamSo.TiLeTinhDonGiaBan);

                await db.query(
                    `UPDATE LOTHUOC SET GiaBan = ? WHERE MaLo = ?`,
                    [GiaBan, MaLo]
                );
            }

            // 5. Cập nhật lô thuốc
            await db.query(
                `UPDATE LOTHUOC
                SET SoLuongTon = SoLuongTon + ?, HanSuDung = ?
                WHERE MaLo = ?`,
                [delta, HanSuDung, MaLo]
            );

            // 6. Cập nhật phiếu nhập
            const [rows] = await db.query(
                `UPDATE PHIEUNHAPTHUOC
                SET GiaNhap = ?, NgayNhap = ?, SoLuongNhap = ?
                WHERE MaPNT = ?`,
                [GiaNhap, NgayNhap, SoLuongNhap, MaPNT]
            );

            if (rows.affectedRows === 0) {
                await db.rollback();
                return { error: "UPDATE_FAILED" };
            }

            await db.commit();
            return { ok: true };
        }
        catch (error) {
            await db.rollback();
            console.log("MedicineImportService update Error:", error);
            return { error: "SYSTEM_ERROR" };
        }
    }


    // Xóa phiếu nhập thuốc theo mã phiếu nhập
    static async deleteMedicineImportByFormID(MaPNT) {
        try {
            await db.beginTransaction();

            // 1. Lấy mã lô của phiếu nhập
            const [[pnt]] = await db.query(
                `SELECT MaLo FROM PHIEUNHAPTHUOC WHERE MaPNT = ?`,
                [MaPNT]
            );

            if (!pnt) {
                await db.rollback();
                return { error: "PNT_NOT_FOUND" };
            }

            const MaLo = pnt.MaLo;

            // 2. Kiểm tra lô đã được kê đơn chưa
            const [[used]] = await db.query(
                `SELECT 1 FROM CT_THUOC WHERE MaLo = ? LIMIT 1`,
                [MaLo]
            );

            if (used) {
                await db.rollback();
                return {
                    error: "LOT_ALREADY_USED",
                    message: "Không thể xóa phiếu nhập vì lô thuốc đã được kê đơn"
                };
            }

            // 3. Xóa phiếu nhập
            const [rows] = await db.query(
                `DELETE FROM PHIEUNHAPTHUOC WHERE MaPNT = ?`,
                [MaPNT]
            );

            if (rows.affectedRows === 0) {
                await db.rollback();
                return { error: "DELETE_FAILED" };
            }

            // 4. Xóa luôn lô thuốc tương ứng
            await db.query(
                `DELETE FROM LOTHUOC WHERE MaLo = ?`,
                [MaLo]
            );

            await db.commit();
            return { ok: true };
        }
        catch (error) {
            await db.rollback();
            console.log("MedicineImportService delete Error:", error);
            return { error: "SYSTEM_ERROR" };
        }
    }

    // Xóa phiếu nhập thuốc theo mã lô thuốc
    static async deleteMedicineImportByBatchId(MaLo) {
        try {
            await db.beginTransaction();

            // 1. Lấy mã lô của phiếu nhập
            const [[pnt]] = await db.query(
                `SELECT MaPNT FROM PHIEUNHAPTHUOC WHERE MaLo = ?`,
                [MaLo]
            );

            if (!pnt) {
                await db.rollback();
                return { error: "PNT_NOT_FOUND" };
            }

            const MaPNT = pnt.MaPNT;

            // 2. Kiểm tra lô đã được kê đơn chưa
            const [[used]] = await db.query(
                `SELECT 1 FROM CT_THUOC WHERE MaLo = ? LIMIT 1`,
                [MaLo]
            );

            if (used) {
                await db.rollback();
                return {
                    error: "LOT_ALREADY_USED",
                    message: "Không thể xóa phiếu nhập vì lô thuốc đã được kê đơn"
                };
            }

            // 3. Xóa phiếu nhập
            const [rows] = await db.query(
                `DELETE FROM PHIEUNHAPTHUOC WHERE MaPNT = ?`,
                [MaPNT]
            );

            if (rows.affectedRows === 0) {
                await db.rollback();
                return { error: "DELETE_FAILED" };
            }

            // 4. Xóa luôn lô thuốc tương ứng
            await db.query(
                `DELETE FROM LOTHUOC WHERE MaLo = ?`,
                [MaLo]
            );

            await db.commit();
            return { ok: true };
        }
        catch (error) {
            await db.rollback();
            console.log("MedicineImportService delete Error:", error);
            return { error: "SYSTEM_ERROR" };
        }
    }

    // Kiểm tra thuốc tồn tại
    static async checkMaThuoc(MaThuoc) {
        const [[row]] = await db.query(
            "SELECT MaThuoc FROM LOAITHUOC WHERE MaThuoc = ?",
            [MaThuoc]
        );
        return !!row;
    }
}

module.exports = MedicineImportService;
