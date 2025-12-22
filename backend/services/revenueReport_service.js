const db = require('../config/database');

class RevenueReportService {

    static async createReport({ Thang, Nam }) {
        try {
            // 1. Check trùng báo cáo
            const [[exist]] = await db.query(
                "SELECT MaBCDT FROM BAOCAODOANHTHU WHERE THANG = ? AND NAM = ?",
                [Thang, Nam]
            );

            if (exist) {
                return { error: "EXISTED_REPORT" };
            }

            // 2. Tổng hợp doanh thu theo ngày
            const [details] = await db.query(`
                SELECT 
                    NgayTHANHTOAN AS Ngay,
                    COUNT(DISTINCT MaPKB) AS SoBenhNhan,
                    SUM(TongTien) AS DOANHTHU
                FROM HOADONTHANHTOAN
                WHERE MONTH(NgayTHANHTOAN) = ?
                  AND YEAR(NgayTHANHTOAN) = ?
                GROUP BY NgayTHANHTOAN
            `, [Thang, Nam]);

            const TongDoanhThu = details.length === 0
            ? 0
            : details.reduce((sum, d) => sum + d.DOANHTHU, 0);

            // 3. Sinh mã BCDTxxxx
            const [[row]] = await db.query(
                "SELECT MaBCDT FROM BAOCAODOANHTHU ORDER BY MaBCDT DESC LIMIT 1"
            );

            let MaBCDT = "BCDT0001";
            if (row) {
                const num = parseInt(row.MaBCDT.slice(4)) + 1;
                MaBCDT = "BCDT" + num.toString().padStart(4, "0");
            }

            // 4. Insert báo cáo
            await db.query(
                `INSERT INTO BAOCAODOANHTHU
                 (MaBCDT, THANG, NAM, TongDoanhThu)
                 VALUES (?, ?, ?, ?)`,
                [MaBCDT, Thang, Nam, TongDoanhThu]
            );

            // 5. Insert chi tiết
            for (const d of details) {
                const TyLe = TongDoanhThu === 0 ? 0 : (d.DOANHTHU / TongDoanhThu) * 100;

                await db.query(
                    `INSERT INTO CT_BCDT
                    (MaBCDT, Ngay, SoBenhNhan, DOANHTHU, TyLe)
                    VALUES (?, ?, ?, ?, ?)`,
                    [MaBCDT, d.Ngay, d.SoBenhNhan, d.DOANHTHU, TyLe]
                );
            }

            return { MaBCDT, Thang, Nam, TongDoanhThu };
        }
        catch (error) {
            console.log("RevenueReport create Error:", error);
            return null;
        }
    }

    static async getReports() {
        try {
            const [rows] = await db.query(`
                SELECT
                    MaBCDT,
                    THANG,
                    NAM,
                    TongDoanhThu
                FROM BAOCAODOANHTHU
                ORDER BY NAM DESC, THANG DESC
            `);
            return rows;
        }
        catch (error) {
            console.log("RevenueReport getReports Error:", error);
            return null;
        }
    }

    static async getReportDetail(MaBCDT) {
        try {
            const [[report]] = await db.query(
                `SELECT MaBCDT, THANG, NAM, TongDoanhThu
                FROM BAOCAODOANHTHU
                WHERE MaBCDT = ?`,
                [MaBCDT]
            );

            if (!report) {
                return { error: "NOT_FOUND" };
            }

            const [details] = await db.query(`
                SELECT
                    Ngay,
                    SoBenhNhan,
                    DOANHTHU,
                    TyLe
                FROM CT_BCDT
                WHERE MaBCDT = ?
                ORDER BY Ngay
            `, [MaBCDT]);

            return {
                ...report,
                ChiTiet: details
            };
        }
        catch (error) {
            console.log("RevenueReport getReportDetail Error:", error);
            return null;
        }
    }

    static async searchReports(filters) {
        try {
            const { Thang, Nam } = filters || {};

            let sql = `
                SELECT
                    MaBCDT,
                    THANG,
                    NAM,
                    TongDoanhThu
                FROM BAOCAODOANHTHU
                WHERE 1=1
            `;

            const params = [];

            if (Thang) {
                sql += " AND THANG = ?";
                params.push(Thang);
            }

            if (Nam) {
                sql += " AND NAM = ?";
                params.push(Nam);
            }

            sql += " ORDER BY NAM DESC, THANG DESC";

            const [rows] = await db.query(sql, params);
            return rows;
        }
        catch (error) {
            console.log("RevenueReport searchReports Error:", error);
            return null;
        }
    }


    static async updateReport(MaBCDT) {
        try {
            const [[report]] = await db.query(
                "SELECT THANG, NAM FROM BAOCAODOANHTHU WHERE MaBCDT = ?",
                [MaBCDT]
            );

            if (!report) {
                return { error: "NOT_FOUND" };
            }

            const { THANG, NAM } = report;

            const [details] = await db.query(`
                SELECT 
                    NgayTHANHTOAN AS Ngay,
                    COUNT(DISTINCT MaPKB) AS SoBenhNhan,
                    SUM(TongTien) AS DOANHTHU
                FROM HOADONTHANHTOAN
                WHERE MONTH(NgayTHANHTOAN) = ?
                  AND YEAR(NgayTHANHTOAN) = ?
                GROUP BY NgayTHANHTOAN
            `, [THANG, NAM]);

            if (details.length === 0) {
                return { error: "NO_DATA" };
            }

            await db.query(
                "DELETE FROM CT_BCDT WHERE MaBCDT = ?",
                [MaBCDT]
            );

            const TongDoanhThu = details.reduce(
                (sum, d) => sum + d.DOANHTHU, 0
            );

            await db.query(
                "UPDATE BAOCAODOANHTHU SET TongDoanhThu = ? WHERE MaBCDT = ?",
                [TongDoanhThu, MaBCDT]
            );

            for (const d of details) {
                const TyLe = (d.DOANHTHU / TongDoanhThu) * 100;

                await db.query(
                    `INSERT INTO CT_BCDT
                     (MaBCDT, Ngay, SoBenhNhan, DOANHTHU, TyLe)
                     VALUES (?, ?, ?, ?, ?)`,
                    [MaBCDT, d.Ngay, d.SoBenhNhan, d.DOANHTHU, TyLe]
                );
            }
            return true;
        }
        catch (error) {
            console.log("RevenueReport update Error:", error);
            return null;
        }
    }

    static async deleteReport(MaBCDT) {
        try {
            const [[exist]] = await db.query(
                "SELECT MaBCDT FROM BAOCAODOANHTHU WHERE MaBCDT = ?",
                [MaBCDT]
            );

            if (!exist) {
                return { error: "NOT_FOUND" };
            }

            await db.query(
                "DELETE FROM CT_BCDT WHERE MaBCDT = ?",
                [MaBCDT]
            );

            await db.query(
                "DELETE FROM BAOCAODOANHTHU WHERE MaBCDT = ?",
                [MaBCDT]
            );

            return true;
        }
        catch (error) {
            console.log("RevenueReport delete Error:", error);
            return null;
        }
    }
}

module.exports = RevenueReportService;
