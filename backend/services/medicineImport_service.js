const db = require('../config/database');

class MedicineImportService {

    // Tạo phiếu nhập thuốc
    static async createMedicineImport(data) {
        const conn = await db.getConnection(); 
        try {
            await conn.beginTransaction(); 
            const { MaThuoc, GiaNhap, NgayNhap, SoLuongNhap } = data;

            // Kiểm tra thuốc tồn tại
            const [[thuoc]] = await conn.query(
                "SELECT SoLuongTon FROM LOAITHUOC WHERE MaThuoc = ?",
                [MaThuoc]
            );

            if (!thuoc) {
                await conn.rollback();
                return { error: "MEDICINE_NOT_FOUND" };
            }

            // Lấy tỉ lệ tính đơn giá bán
            const [[thamSo]] = await conn.query(
                "SELECT TiLeTinhDonGiaBan FROM THAMSO LIMIT 1"
            );

            if (!thamSo) {
                await conn.rollback();
                return { error: "NO_THAMSO" };
            }

            const TiLe = thamSo.TiLeTinhDonGiaBan;

            // Tính giá bán mới
            const GiaBanMoi = Math.round(GiaNhap * TiLe);

            // Sinh mã phiếu nhập
            const [[row]] = await conn.query(
                "SELECT MaPNT FROM PHIEUNHAPTHUOC ORDER BY MaPNT DESC LIMIT 1"
            );

            let MaPNT = "PNT001";
            if (row) {
                const num = parseInt(row.MaPNT.slice(3)) + 1;
                MaPNT = "PNT" + num.toString().padStart(3, "0");
            }

            // Insert phiếu nhập
            await conn.query(
                `INSERT INTO PHIEUNHAPTHUOC
                (MaPNT, MaThuoc, GiaNhap, NgayNhap, SoLuongNhap)
                VALUES (?, ?, ?, ?, ?)`,
                [MaPNT, MaThuoc, GiaNhap, NgayNhap, SoLuongNhap]
            );

            // Cập nhật tồn kho + giá bán
            await conn.query(
                `UPDATE LOAITHUOC
                SET 
                    SoLuongTon = SoLuongTon + ?,
                    GiaBan = ?
                WHERE MaThuoc = ?`,
                [SoLuongNhap, GiaBanMoi, MaThuoc]
            );

            await conn.commit();
            return { MaPNT, MaThuoc, GiaNhap, NgayNhap, SoLuongNhap, GiaBanMoi };
        }
        catch (error) {
            console.log("MedicineImportService create Error:", error);
            return null;
        }
        finally {
            conn.release();  
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
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const {
                GiaNhap,
                NgayNhap,
                SoLuongNhap
            } = updateData;

            // Lấy phiếu nhập cũ
            const [[oldPNT]] = await conn.query(
                `
                SELECT MaThuoc, SoLuongNhap
                FROM PHIEUNHAPTHUOC
                WHERE MaPNT = ?
                `,
                [MaPNT]
            );

            if (!oldPNT) {
                await conn.rollback();
                return false; // không tìm thấy phiếu nhập
            }

            const MaThuoc = oldPNT.MaThuoc;

            // Tính chênh lệch số lượng
            const delta = SoLuongNhap - oldPNT.SoLuongNhap;

            // Kiểm tra tồn kho không âm
            const [[thuoc]] = await conn.query(
                `
                SELECT SoLuongTon
                FROM LOAITHUOC
                WHERE MaThuoc = ?
                `,
                [MaThuoc]
            );

            if (!thuoc || thuoc.SoLuongTon + delta < 0) {
                await conn.rollback();
                return { error: "INVALID_STOCK" };
            }

            // Cập nhật tồn kho (CHỈ BÙ TRỪ)
            await conn.query(
                `
                UPDATE LOAITHUOC
                SET SoLuongTon = SoLuongTon + ?
                WHERE MaThuoc = ?
                `,
                [delta, MaThuoc]
            );

            // Cập nhật phiếu nhập (KHÔNG đổi MaThuoc)
            const [rows] = await conn.query(
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
                await conn.rollback();
                return false;
            }

            await conn.commit();
            return true;
        }
        catch (error) {
            await conn.rollback();
            console.log("MedicineImportService update Error:", error);
            return null;
        }
        finally {
            conn.release();
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
