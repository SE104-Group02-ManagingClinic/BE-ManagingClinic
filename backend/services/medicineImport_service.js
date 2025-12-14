const db = require('../config/database');

class MedicineImportService {

    // Tạo phiếu nhập thuốc
    static async createMedicineImport(data) {
        try {
            const {
                MaThuoc,
                GiaNhap,
                NgayNhap,
                SoLuongNhap
            } = data;

            // Lấy mã PNT cuối
            const [rows] = await db.query(
                "SELECT MaPNT FROM PHIEUNHAPTHUOC ORDER BY CAST(SUBSTRING(MaPNT, 4) AS UNSIGNED) DESC LIMIT 1"
            );

            let lastId = "";
            if (rows.length > 0) lastId = rows[0].MaPNT;

            const nextId = this.createId(lastId);

            const record = {
                MaPNT: nextId,
                MaThuoc,
                GiaNhap,
                NgayNhap,
                SoLuongNhap
            };

            await db.query(
                "INSERT INTO PHIEUNHAPTHUOC SET ?",
                [record]
            );

            // Cập nhật tồn kho thuốc
            await db.query(
                "UPDATE LOAITHUOC SET SoLuongTon = SoLuongTon + ? WHERE MaThuoc = ?",
                [SoLuongNhap, MaThuoc]
            );

            return record;
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
                MaThuoc,
                GiaNhap,
                NgayNhap,
                SoLuongNhap
            } = updateData;

            const [rows] = await db.query(
                `
                UPDATE PHIEUNHAPTHUOC
                SET
                    MaThuoc = ?,
                    GiaNhap = ?,
                    NgayNhap = ?,
                    SoLuongNhap = ?
                WHERE MaPNT = ?
                `,
                [
                    MaThuoc,
                    GiaNhap,
                    NgayNhap,
                    SoLuongNhap,
                    MaPNT
                ]
            );

            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
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

    // Tạo mã PNT mới (PNT001 → PNT999)
    static createId(lastId) {
        if (!lastId) return "PNT001";

        const number = parseInt(lastId.slice(3), 10) + 1;
        return "PNT" + number.toString().padStart(3, "0");
    }
}

module.exports = MedicineImportService;
