const db = require('../config/database');

class RevenueReportService {

    static async createReport({ Thang, Nam }) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // 1. Check trùng báo cáo
            const [[exist]] = await conn.query(
                "SELECT MaBCDT FROM BAOCAODOANHTHU WHERE THANG = ? AND NAM = ?",
                [Thang, Nam]
            );

            if (exist) {
                await conn.rollback();
                return { error: "EXISTED_REPORT" };
            }

            // 2. Tổng hợp doanh thu theo ngày
            const [details] = await conn.query(`
                SELECT 
                    NgayTHANHTOAN AS Ngay,
                    COUNT(DISTINCT MaPKB) AS SoBenhNhan,
                    SUM(TongTien) AS DOANHTHU
                FROM HOADONTHANHTOAN
                WHERE MONTH(NgayTHANHTOAN) = ?
                  AND YEAR(NgayTHANHTOAN) = ?
                GROUP BY NgayTHANHTOAN
            `, [Thang, Nam]);

            if (details.length === 0) {
                await conn.rollback();
                return { error: "NO_DATA" };
            }

            const TongDoanhThu = details.reduce(
                (sum, d) => sum + d.DOANHTHU, 0
            );

            // 3. Sinh mã BCDTxxxx
            const [[row]] = await conn.query(
                "SELECT MaBCDT FROM BAOCAODOANHTHU ORDER BY MaBCDT DESC LIMIT 1"
            );

            let MaBCDT = "BCDT0001";
            if (row) {
                const num = parseInt(row.MaBCDT.slice(4)) + 1;
                MaBCDT = "BCDT" + num.toString().padStart(4, "0");
            }

            // 4. Insert báo cáo
            await conn.query(
                `INSERT INTO BAOCAODOANHTHU
                 (MaBCDT, THANG, NAM, TongDoanhThu)
                 VALUES (?, ?, ?, ?)`,
                [MaBCDT, Thang, Nam, TongDoanhThu]
            );

            // 5. Insert chi tiết
            for (const d of details) {
                const TyLe = (d.DOANHTHU / TongDoanhThu) * 100;

                await conn.query(
                    `INSERT INTO CT_BCDT
                     (MaBCDT, Ngay, SoBenhNhan, DOANHTHU, TyLe)
                     VALUES (?, ?, ?, ?, ?)`,
                    [MaBCDT, d.Ngay, d.SoBenhNhan, d.DOANHTHU, TyLe]
                );
            }

            await conn.commit();
            return { MaBCDT, Thang, Nam, TongDoanhThu };
        }
        catch (error) {
            await conn.rollback();
            console.log("RevenueReport create Error:", error);
            return null;
        }
        finally {
            conn.release();
        }
    }

    static async updateReport(MaBCDT) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [[report]] = await conn.query(
                "SELECT THANG, NAM FROM BAOCAODOANHTHU WHERE MaBCDT = ?",
                [MaBCDT]
            );

            if (!report) {
                await conn.rollback();
                return { error: "NOT_FOUND" };
            }

            const { THANG, NAM } = report;

            const [details] = await conn.query(`
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
                await conn.rollback();
                return { error: "NO_DATA" };
            }

            await conn.query(
                "DELETE FROM CT_BCDT WHERE MaBCDT = ?",
                [MaBCDT]
            );

            const TongDoanhThu = details.reduce(
                (sum, d) => sum + d.DOANHTHU, 0
            );

            await conn.query(
                "UPDATE BAOCAODOANHTHU SET TongDoanhThu = ? WHERE MaBCDT = ?",
                [TongDoanhThu, MaBCDT]
            );

            for (const d of details) {
                const TyLe = (d.DOANHTHU / TongDoanhThu) * 100;

                await conn.query(
                    `INSERT INTO CT_BCDT
                     (MaBCDT, Ngay, SoBenhNhan, DOANHTHU, TyLe)
                     VALUES (?, ?, ?, ?, ?)`,
                    [MaBCDT, d.Ngay, d.SoBenhNhan, d.DOANHTHU, TyLe]
                );
            }

            await conn.commit();
            return true;
        }
        catch (error) {
            await conn.rollback();
            console.log("RevenueReport update Error:", error);
            return null;
        }
        finally {
            conn.release();
        }
    }

    static async deleteReport(MaBCDT) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [[exist]] = await conn.query(
                "SELECT MaBCDT FROM BAOCAODOANHTHU WHERE MaBCDT = ?",
                [MaBCDT]
            );

            if (!exist) {
                await conn.rollback();
                return { error: "NOT_FOUND" };
            }

            await conn.query(
                "DELETE FROM CT_BCDT WHERE MaBCDT = ?",
                [MaBCDT]
            );

            await conn.query(
                "DELETE FROM BAOCAODOANHTHU WHERE MaBCDT = ?",
                [MaBCDT]
            );

            await conn.commit();
            return true;
        }
        catch (error) {
            await conn.rollback();
            console.log("RevenueReport delete Error:", error);
            return null;
        }
        finally {
            conn.release();
        }
    }
}

module.exports = RevenueReportService;
