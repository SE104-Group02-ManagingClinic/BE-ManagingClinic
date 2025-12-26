const db = require('../config/database');

class MedicineService {

    /* =====================================================
       KIỂM TRA KHÓA NGOẠI
       ===================================================== */
    static async checkForeignKey(MaDVT, MaCachDung) {
        try {
            const [[dvt]] = await db.query(
                "SELECT MaDVT FROM DONVITINH WHERE MaDVT = ?",
                [MaDVT]
            );
            if (!dvt) {
                return { ok: false, code: 400, message: "Đơn vị tính không tồn tại" };
            }

            const [[cd]] = await db.query(
                "SELECT MaCachDung FROM CACHDUNG WHERE MaCachDung = ?",
                [MaCachDung]
            );
            if (!cd) {
                return { ok: false, code: 400, message: "Cách dùng không tồn tại" };
            }

            return { ok: true };
        }
        catch (error) {
            console.log("checkForeignKey Error:", error);
            return { ok: false, code: 500, message: "Lỗi kiểm tra khóa ngoại" };
        }
    }

    /* =====================================================
       KIỂM TRA TRÙNG THUỐC THEO TÊN + SỐ LÔ
       ===================================================== */
    static async existedMedicine(TenThuoc, SoLo) {
        try {
            const [[row]] = await db.query(
                `SELECT 1 FROM LOAITHUOC 
                 WHERE LOWER(TenThuoc) = LOWER(?) AND SoLo = ?`,
                [TenThuoc, SoLo]
            );
            return !!row;
        }
        catch (error) {
            console.log("existedMedicine Error:", error);
            return false;
        }
    }

    /* =====================================================
       TẠO THUỐC MỚI (THEO LÔ)
       ===================================================== */
    static async createMedicine(data) {
        try {
            const {
                TenThuoc,
                CongDung,
                MaCachDung,
                MaDVT,
                TacDungPhu,
                SoLo,
                HanSuDung
            } = data;

            // Sinh MaThuoc mới
            const [[row]] = await db.query(
                "SELECT MaThuoc FROM LOAITHUOC ORDER BY CAST(SUBSTRING(MaThuoc,3) AS UNSIGNED) DESC LIMIT 1"
            );

            let MaThuoc = "LT001";
            if (row) {
                const num = parseInt(row.MaThuoc.slice(2)) + 1;
                MaThuoc = "LT" + num.toString().padStart(3, "0");
            }

            const record = {
                MaThuoc,
                SoLo,
                TenThuoc,
                CongDung,
                MaCachDung,
                MaDVT,
                TacDungPhu,
                SoLuongTon: 0,
                GiaBan: 0,
                HanSuDung
            };

            await db.query("INSERT INTO LOAITHUOC SET ?", [record]);
            return record;
        }
        catch (error) {
            console.log("createMedicine Error:", error);
            return null;
        }
    }

    /* =====================================================
       LẤY DANH SÁCH THUỐC (THEO LÔ)
       ===================================================== */
    static async getMedicine() {
        try {
            const [rows] = await db.query(`
                SELECT
                    t.MaThuoc,
                    t.SoLo,
                    t.TenThuoc,
                    t.CongDung,
                    t.HanSuDung,
                    d.TenDVT,
                    c.TenCachDung,
                    t.TacDungPhu,
                    t.SoLuongTon,
                    t.GiaBan
                FROM LOAITHUOC t
                LEFT JOIN DONVITINH d ON t.MaDVT = d.MaDVT
                LEFT JOIN CACHDUNG c ON t.MaCachDung = c.MaCachDung
                ORDER BY t.TenThuoc, t.SoLo
            `);
            return rows;
        }
        catch (error) {
            console.log("getMedicine Error:", error);
            return null;
        }
    }

    /* =====================================================
       TÌM KIẾM THUỐC (TÊN / ĐVT / SỐ LÔ)
       ===================================================== */
    static async searchMedicine({ TenThuoc, TenDVT, SoLo }) {
        try {
            let sql = `
                SELECT
                    t.MaThuoc,
                    t.SoLo,
                    t.TenThuoc,
                    t.CongDung,
                    t.HanSuDung,
                    d.TenDVT,
                    c.TenCachDung,
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
                sql += " AND t.TenThuoc LIKE ?";
                params.push(`%${TenThuoc}%`);
            }
            if (TenDVT) {
                sql += " AND d.TenDVT LIKE ?";
                params.push(`%${TenDVT}%`);
            }
            if (SoLo) {
                sql += " AND t.SoLo LIKE ?";
                params.push(`%${SoLo}%`);
            }

            const [rows] = await db.query(sql, params);
            return rows;
        }
        catch (error) {
            console.log("searchMedicine Error:", error);
            return null;
        }
    }

    /* =====================================================
       CẬP NHẬT THUỐC THEO (MaThuoc + SoLo)
       ===================================================== */
    static async updateMedicine(MaThuoc, SoLo, data) {
        try {
            const [rows] = await db.query(
                `
                UPDATE LOAITHUOC
                SET
                    TenThuoc = ?,
                    CongDung = ?,
                    MaCachDung = ?,
                    MaDVT = ?,
                    TacDungPhu = ?,
                    HanSuDung = ?
                WHERE MaThuoc = ? AND SoLo = ?
                `,
                [
                    data.TenThuoc,
                    data.CongDung,
                    data.MaCachDung,
                    data.MaDVT,
                    data.TacDungPhu,
                    data.HanSuDung,
                    MaThuoc,
                    SoLo
                ]
            );

            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("updateMedicine Error:", error);
            return null;
        }
    }

    /* =====================================================
       KIỂM TRA XÓA THUỐC THEO LÔ
       ===================================================== */
    static async canDeleteMedicine(MaThuoc, SoLo) {
        try {
            const [[used]] = await db.query(
                "SELECT 1 FROM CT_THUOC WHERE MaThuoc = ? AND SoLo = ? LIMIT 1",
                [MaThuoc, SoLo]
            );
            if (used) {
                return { ok: false, message: "Thuốc đã được sử dụng trong đơn thuốc" };
            }
            return { ok: true };
        }
        catch (error) {
            console.log("canDeleteMedicine Error:", error);
            return { ok: false, message: "Lỗi kiểm tra trước khi xóa" };
        }
    }

    /* =====================================================
       XÓA THUỐC THEO LÔ
       ===================================================== */
    static async deleteMedicine(MaThuoc, SoLo) {
        try {
            const [rows] = await db.query(
                "DELETE FROM LOAITHUOC WHERE MaThuoc = ? AND SoLo = ?",
                [MaThuoc, SoLo]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("deleteMedicine Error:", error);
            return null;
        }
    }
}

module.exports = MedicineService;
