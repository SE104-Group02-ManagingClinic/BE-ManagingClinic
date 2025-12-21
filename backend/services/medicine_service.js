const db = require('../config/database');

class MedicineService {
    // Kiểm tra khóa ngoại trước khi thêm thuốc
    static async checkForeignKey(MaDVT, MaCachDung) {
        try {
            const [[dvt]] = await db.query(
                "SELECT MaDVT FROM DONVITINH WHERE MaDVT = ?",
                [MaDVT]
            );

            if (!dvt) {
                return {
                    ok: false,
                    code: 400,
                    message: "Đơn vị tính không tồn tại"
                };
            }

            const [[cd]] = await db.query(
                "SELECT MaCachDung FROM CACHDUNG WHERE MaCachDung = ?",
                [MaCachDung]
            );

            if (!cd) {
                return {
                    ok: false,
                    code: 400,
                    message: "Cách dùng không tồn tại"
                };
            }

            return { ok: true };
        }
        catch (error) {
            console.log("MedicineService checkForeignKey Error:", error);
            return {
                ok: false,
                code: 500,
                message: "Lỗi kiểm tra khóa ngoại"
            };
        }
    }


    // Tạo thuốc mới
    static async createMedicine(data) {
        try {
            const {
                TenThuoc,
                CongDung,
                MaCachDung,
                MaDVT,
                TacDungPhu,
                SoLuongTon,
                GiaBan
            } = data;

            // Lấy mã thuốc cuối
            const [rows] = await db.query(
                "SELECT MaThuoc FROM LOAITHUOC ORDER BY CAST(SUBSTRING(MaThuoc, 3) AS UNSIGNED) DESC LIMIT 1"
            );

            let lastId = "";
            if (rows.length > 0) lastId = rows[0].MaThuoc;

            const nextId = this.createId(lastId);

            const record = {
                MaThuoc: nextId,
                TenThuoc,
                CongDung,
                MaCachDung,
                MaDVT,
                TacDungPhu,
                SoLuongTon: 0,
                GiaBan: 0
            };

            await db.query("INSERT INTO LOAITHUOC SET ?", [record]);
            return record;
        }
        catch (error) {
            console.log("MedicineService createMedicine Error:", error);
            return null;
        }
    }

    // Lấy danh sách thuốc
    static async getMedicine() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    t.MaThuoc,
                    t.TenThuoc,
                    t.CongDung,
                    d.TenDVT,
                    c.TenCachDung,
                    t.TacDungPhu,
                    t.SoLuongTon,
                    t.GiaBan
                FROM LOAITHUOC t
                LEFT JOIN DONVITINH d ON t.MaDVT = d.MaDVT
                LEFT JOIN CACHDUNG c ON t.MaCachDung = c.MaCachDung
                ORDER BY CAST(SUBSTRING(t.MaThuoc, 3) AS UNSIGNED)
            `);
            return rows;
        }
        catch (error) {
            console.log("MedicineService getMedicine Error:", error);
        }
    }

    // Tìm kiếm thuốc theo tiêu chuẩn (Tên thuốc, Đơn vị tính, Tình trạng)
    static async searchMedicine(filters) {
        try {
            const { TenThuoc, TenDVT } = filters || {};

            let sql = `
                SELECT
                    t.MaThuoc,
                    t.TenThuoc,
                    t.CongDung,
                    c.TenCachDung,
                    d.TenDVT,
                    t.TacDungPhu,
                    t.SoLuongTon,
                    t.GiaBan
                FROM LOAITHUOC t
                LEFT JOIN DONVITINH d ON t.MaDVT = d.MaDVT
                LEFT JOIN CACHDUNG c ON t.MaCachDung = c.MaCachDung
                WHERE 1=1
            `;

            const params = [];

            if (TenThuoc) {
                sql += ` AND LOWER(t.TenThuoc) LIKE ?`;
                params.push(`%${TenThuoc.toLowerCase()}%`);
            }

            if (TenDVT) {
                sql += ` AND LOWER(d.TenDVT) LIKE ?`;
                params.push(`%${TenDVT.toLowerCase()}%`);
            }

            sql += ` ORDER BY CAST(SUBSTRING(t.MaThuoc, 3) AS UNSIGNED)`;

            const [rows] = await db.query(sql, params);
            return rows;
        }
        catch (error) {
            console.log("MedicineService searchMedicine Error:", error);
            return null;
        }
    }

    // Cập nhật thuốc
    static async updateMedicine(MaThuoc, updateData) {
        try {
            const {
                TenThuoc,
                CongDung,
                MaCachDung,
                MaDVT,
                TacDungPhu
            } = updateData;

            const [rows] = await db.query(
                `
                UPDATE LOAITHUOC
                SET
                    TenThuoc = ?,
                    CongDung = ?,
                    MaCachDung = ?,
                    MaDVT = ?,
                    TacDungPhu = ?
                WHERE MaThuoc = ?
                `,
                [
                    TenThuoc,
                    CongDung,
                    MaCachDung,
                    MaDVT,
                    TacDungPhu,
                    MaThuoc
                ]
            );

            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("MedicineService updateMedicine Error:", error);
            return null;
        }
    }

    static async canDeleteMedicine(MaThuoc) {
        try {
            const [[ctThuoc]] = await db.query(
                "SELECT 1 FROM CT_THUOC WHERE MaThuoc = ? LIMIT 1",
                [MaThuoc]
            );

            if (ctThuoc) {
                return {
                    ok: false,
                    message: "Không thể xóa thuốc đã được sử dụng trong đơn thuốc"
                };
            }

            const [[pnt]] = await db.query(
                "SELECT 1 FROM PHIEUNHAPTHUOC WHERE MaThuoc = ? LIMIT 1",
                [MaThuoc]
            );

            if (pnt) {
                return {
                    ok: false,
                    message: "Không thể xóa thuốc đã có phiếu nhập"
                };
            }

            return { ok: true };
        }
        catch (error) {
            console.log("MedicineService canDeleteMedicine Error:", error);
            return {
                ok: false,
                message: "Lỗi kiểm tra trước khi xóa"
            };
        }
    }

    // Xóa thuốc
    static async deleteMedicine(MaThuoc) {
        try {
            const [rows] = await db.query(
                "DELETE FROM LOAITHUOC WHERE MaThuoc = ?",
                [MaThuoc]
            );

            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("MedicineService deleteMedicine Error:", error);
        }
    }

    // Kiểm tra tên thuốc tồn tại
    static async existedMedicine(tenThuoc) {
        try {
            const [rows] = await db.query(
                "SELECT TenThuoc FROM LOAITHUOC WHERE LOWER(TenThuoc) = LOWER(?)",
                [tenThuoc]
            );
            return rows.length > 0;
        }
        catch (error) {
            console.log("MedicineService existedMedicine Error:", error);
            return false;
        }
    }

    // Tạo mã thuốc mới
    static createId(lastId) {
        if (!lastId) return "LT001";

        const number = parseInt(lastId.slice(2), 10) + 1;
        return "LT" + number.toString().padStart(3, "0");
    }
}

module.exports = MedicineService;
