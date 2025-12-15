const db = require('../config/database');

class MedicineImportService {

    // Tạo phiếu nhập thuốc
    static async createMedicineImport(data) {
        try {
            const { MaThuoc, GiaNhap, NgayNhap, SoLuongNhap } = data;

            // Kiểm tra thuốc tồn tại
            const [[thuoc]] = await db.query(
                "SELECT SoLuongTon FROM LOAITHUOC WHERE MaThuoc = ?",
                [MaThuoc]
            );

            if (!thuoc) {
                await db.rollback();
                return { error: "MEDICINE_NOT_FOUND" };
            }

            // Lấy tỉ lệ tính đơn giá bán
            const [[thamSo]] = await db.query(
                "SELECT TiLeTinhDonGiaBan FROM THAMSO LIMIT 1"
            );

            if (!thamSo) {
                await db.rollback();
                return { error: "NO_THAMSO" };
            }

            const TiLe = thamSo.TiLeTinhDonGiaBan;

            // Tính giá bán mới
            const GiaBanMoi = Math.round(GiaNhap * TiLe);

            // Sinh mã phiếu nhập
            const [[row]] = await db.query(
                "SELECT MaPNT FROM PHIEUNHAPTHUOC ORDER BY MaPNT DESC LIMIT 1"
            );

            let MaPNT = "PNT001";
            if (row) {
                const num = parseInt(row.MaPNT.slice(3)) + 1;
                MaPNT = "PNT" + num.toString().padStart(3, "0");
            }

            // Insert phiếu nhập
            await db.query(
                `INSERT INTO PHIEUNHAPTHUOC
                (MaPNT, MaThuoc, GiaNhap, NgayNhap, SoLuongNhap)
                VALUES (?, ?, ?, ?, ?)`,
                [MaPNT, MaThuoc, GiaNhap, NgayNhap, SoLuongNhap]
            );

            // Cập nhật tồn kho + giá bán
            await db.query(
                `UPDATE LOAITHUOC
                SET 
                    SoLuongTon = SoLuongTon + ?,
                    GiaBan = ?
                WHERE MaThuoc = ?`,
                [SoLuongNhap, GiaBanMoi, MaThuoc]
            );

            return { MaPNT, MaThuoc, GiaNhap, NgayNhap, SoLuongNhap, GiaBanMoi };
        }
        catch (error) {
            console.log("MedicineImportService create Error:", error);
            return null;
        }
    }

    // Lấy danh sách phiếu nhập thuốc
    static async getMedicineImport() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    p.*, 
                    t.TenThuoc
                FROM PHIEUNHAPTHUOC p
                JOIN LOAITHUOC t ON p.MaThuoc = t.MaThuoc
                ORDER BY p.NgayNhap DESC
            `);
            return rows;
        }
        catch (error) {
            console.log("MedicineImportService get Error:", error);
        }
    }

    // Cập nhật phiếu nhập thuốc
    static async updateMedicineImport(MaPNT, updateData) {
        try {

            const {
                GiaNhap,
                NgayNhap,
                SoLuongNhap
            } = updateData;

            // Lấy phiếu nhập cũ
            const [[oldPNT]] = await db.query(
                `
                SELECT MaThuoc, SoLuongNhap
                FROM PHIEUNHAPTHUOC
                WHERE MaPNT = ?
                `,
                [MaPNT]
            );

            if (!oldPNT) {
                await db.rollback();
                return false; // không tìm thấy phiếu nhập
            }

            const MaThuoc = oldPNT.MaThuoc;

            // Tính chênh lệch số lượng
            const delta = SoLuongNhap - oldPNT.SoLuongNhap;

            // Kiểm tra tồn kho không âm
            const [[thuoc]] = await db.query(
                `
                SELECT SoLuongTon
                FROM LOAITHUOC
                WHERE MaThuoc = ?
                `,
                [MaThuoc]
            );

            if (!thuoc || thuoc.SoLuongTon + delta < 0) {
                await db.rollback();
                return { error: "INVALID_STOCK" };
            }

            // Cập nhật tồn kho (CHỈ BÙ TRỪ)
            await db.query(
                `
                UPDATE LOAITHUOC
                SET SoLuongTon = SoLuongTon + ?
                WHERE MaThuoc = ?
                `,
                [delta, MaThuoc]
            );

            // Cập nhật phiếu nhập (KHÔNG đổi MaThuoc)
            const [rows] = await db.query(
                `
                UPDATE PHIEUNHAPTHUOC
                SET
                    GiaNhap = ?,
                    NgayNhap = ?,
                    SoLuongNhap = ?
                WHERE MaPNT = ?
                `,
                [
                    GiaNhap,
                    NgayNhap,
                    SoLuongNhap,
                    MaPNT
                ]
            );

            if (rows.affectedRows === 0) {
                await db.rollback();
                return false;
            }

            return true;
        }
        catch (error) {
            await db.rollback();
            console.log("MedicineImportService update Error:", error);
            return null;
        }
    }


    // Xóa phiếu nhập thuốc
    static async deleteMedicineImport(MaPNT) {
        try {
            const [rows] = await db.query(
                "DELETE FROM PHIEUNHAPTHUOC WHERE MaPNT = ?",
                [MaPNT]
            );

            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("MedicineImportService delete Error:", error);
            return null;
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
