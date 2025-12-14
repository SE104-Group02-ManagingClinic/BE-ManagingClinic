const db = require('../config/database');

class MedicineUsageReportService {
    static async createReport({ Thang, Nam }) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // 0. Check đã tồn tại báo cáo tháng/năm chưa
            const [[existed]] = await conn.query(
                "SELECT MaBCSDT FROM BAOCAOSUDUNGTHUOC WHERE Thang = ? AND Nam = ?",
                [Thang, Nam]
            );

            if (existed) {
                await conn.rollback();
                return { error: "EXISTED_REPORT" };
            }

            // 1. Tổng hợp trước để check có dữ liệu không
            const [details] = await conn.query(`
                SELECT 
                    ct.MaThuoc,
                    COUNT(DISTINCT pkb.MaPKB) AS SoLanDung,
                    SUM(ct.SoLuong) AS SoLuongDung
                FROM CT_THUOC ct
                JOIN PHIEUKHAMBENH pkb ON ct.MaPKB = pkb.MaPKB
                WHERE MONTH(pkb.NgayKham) = ?
                AND YEAR(pkb.NgayKham) = ?
                GROUP BY ct.MaThuoc
            `, [Thang, Nam]);

            if (details.length === 0) {
                await conn.rollback();
                return { error: "NO_DATA" };
            }

            // 2. Sinh mã BCSDTxxx
            const [[row]] = await conn.query(
                "SELECT MaBCSDT FROM BAOCAOSUDUNGTHUOC ORDER BY MaBCSDT DESC LIMIT 1"
            );

            let MaBCSDT = "BCSDT001";
            if (row) {
                const num = parseInt(row.MaBCSDT.slice(5)) + 1;
                MaBCSDT = "BCSDT" + num.toString().padStart(3, "0");
            }

            // 3. Insert báo cáo
            await conn.query(
                "INSERT INTO BAOCAOSUDUNGTHUOC (MaBCSDT, Thang, Nam) VALUES (?, ?, ?)",
                [MaBCSDT, Thang, Nam]
            );

            // 4. Insert chi tiết
            for (const d of details) {
                await conn.query(
                    `INSERT INTO CT_BCSDT
                    (MaBCSDT, MaThuoc, SoLanDung, SoLuongDung)
                    VALUES (?, ?, ?, ?)`,
                    [MaBCSDT, d.MaThuoc, d.SoLanDung, d.SoLuongDung]
                );
            }

            await conn.commit();
            return { MaBCSDT, Thang, Nam };
        }
        catch (error) {
            await conn.rollback();
            console.log("MedicineUsageReport create Error:", error);
            return null;
        }
        finally {
            conn.release();
        }
    }

    static async updateReport(MaBCSDT) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [[report]] = await conn.query(
                "SELECT Thang, Nam FROM BAOCAOSUDUNGTHUOC WHERE MaBCSDT = ?",
                [MaBCSDT]
            );

            if (!report) {
                await conn.rollback();
                return { error: "NOT_FOUND" };
            }

            const { Thang, Nam } = report;

            const [details] = await conn.query(`
                SELECT 
                    ct.MaThuoc,
                    COUNT(DISTINCT pkb.MaPKB) AS SoLanDung,
                    SUM(ct.SoLuong) AS SoLuongDung
                FROM CT_THUOC ct
                JOIN PHIEUKHAMBENH pkb ON ct.MaPKB = pkb.MaPKB
                WHERE MONTH(pkb.NgayKham) = ?
                AND YEAR(pkb.NgayKham) = ?
                GROUP BY ct.MaThuoc
            `, [Thang, Nam]);

            if (details.length === 0) {
                await conn.rollback();
                return { error: "NO_DATA" };
            }

            await conn.query(
                "DELETE FROM CT_BCSDT WHERE MaBCSDT = ?",
                [MaBCSDT]
            );

            for (const d of details) {
                await conn.query(
                    `INSERT INTO CT_BCSDT
                    (MaBCSDT, MaThuoc, SoLanDung, SoLuongDung)
                    VALUES (?, ?, ?, ?)`,
                    [MaBCSDT, d.MaThuoc, d.SoLanDung, d.SoLuongDung]
                );
            }

            await conn.commit();
            return true;
        }
        catch (error) {
            await conn.rollback();
            console.log("MedicineUsageReport update Error:", error);
            return null;
        }
        finally {
            conn.release();
        }
    }
    
    static async deleteReport(MaBCSDT) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [[exist]] = await conn.query(
                "SELECT MaBCSDT FROM BAOCAOSUDUNGTHUOC WHERE MaBCSDT = ?",
                [MaBCSDT]
            );

            if (!exist) {
                await conn.rollback();
                return { error: "NOT_FOUND" };
            }

            await conn.query(
                "DELETE FROM CT_BCSDT WHERE MaBCSDT = ?",
                [MaBCSDT]
            );

            await conn.query(
                "DELETE FROM BAOCAOSUDUNGTHUOC WHERE MaBCSDT = ?",
                [MaBCSDT]
            );

            await conn.commit();
            return true;
        }
        catch (error) {
            await conn.rollback();
            console.log("MedicineUsageReport delete Error:", error);
            return null;
        }
        finally {
            conn.release();
        }
    }

}

module.exports = MedicineUsageReportService;
