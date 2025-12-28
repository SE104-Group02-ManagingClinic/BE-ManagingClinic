const db = require('../config/database');

class MedicineUsageReportService {
    static async createReport({ Thang, Nam }) {
        try {
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            if (
                Nam > currentYear ||
                (Nam === currentYear && Thang > currentMonth)
            ) {
                return { error: "INVALID_TIME" };
            }
            
            // 0. Check đã tồn tại báo cáo tháng/năm chưa
            const [[existed]] = await db.query(
                "SELECT MaBCSDT FROM BAOCAOSUDUNGTHUOC WHERE Thang = ? AND Nam = ?",
                [Thang, Nam]
            );

            if (existed) {
                return { error: "EXISTED_REPORT" };
            }

            // 1. Tổng hợp dữ liệu (ĐÃ SỬA LOGIC)
            // Logic: Chỉ tính thuốc từ các Phiếu Khám có Hóa Đơn và Tiền Thuốc > 0
            const [details] = await db.query(`
                SELECT 
                    ct.MaThuoc,
                    COUNT(DISTINCT pkb.MaPKB) AS SoLanDung,
                    SUM(ct.SoLuong) AS SoLuongDung
                FROM CT_THUOC ct
                JOIN PHIEUKHAMBENH pkb ON ct.MaPKB = pkb.MaPKB
                JOIN HOADONTHANHTOAN hd ON pkb.MaPKB = hd.MaPKB  -- Join thêm hóa đơn
                WHERE MONTH(pkb.NgayKham) = ?
                AND YEAR(pkb.NgayKham) = ?
                AND hd.TienThuoc > 0                             -- Chỉ lấy đơn có mua thuốc
                GROUP BY ct.MaThuoc
            `, [Thang, Nam]);

            // 2. Sinh mã BCSDTxxx
            const [[row]] = await db.query(
                "SELECT MaBCSDT FROM BAOCAOSUDUNGTHUOC ORDER BY MaBCSDT DESC LIMIT 1"
            );

            let MaBCSDT = "BCSDT001";
            if (row) {
                const num = parseInt(row.MaBCSDT.slice(5)) + 1;
                MaBCSDT = "BCSDT" + num.toString().padStart(3, "0");
            }

            // 3. Insert báo cáo
            await db.query(
                "INSERT INTO BAOCAOSUDUNGTHUOC (MaBCSDT, Thang, Nam) VALUES (?, ?, ?)",
                [MaBCSDT, Thang, Nam]
            );

            // 4. Insert chi tiết
            if (details.length > 0) {
                for (const d of details) {
                    await db.query(
                        `INSERT INTO CT_BCSDT
                        (MaBCSDT, MaThuoc, SoLanDung, SoLuongDung)
                        VALUES (?, ?, ?, ?)`,
                        [MaBCSDT, d.MaThuoc, d.SoLanDung, d.SoLuongDung]
                    );
                }
            }
            
            return { MaBCSDT, Thang, Nam };
        }
        catch (error) {
            console.log("MedicineUsageReport create Error:", error);
            return null;
        }
    }

    static async getReports() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    MaBCSDT,
                    Thang,
                    Nam
                FROM BAOCAOSUDUNGTHUOC
                ORDER BY Nam DESC, Thang DESC
            `);
            return rows;
        }
        catch (error) {
            console.log("MedicineUsageReport getReports Error:", error);
            return null;
        }
    }

    static async getReportDetail(MaBCSDT) {
        try {
            // 1. Lấy header báo cáo
            const [[report]] = await db.query(
                "SELECT MaBCSDT, Thang, Nam FROM BAOCAOSUDUNGTHUOC WHERE MaBCSDT = ?",
                [MaBCSDT]
            );

            if (!report) {
                return { error: "NOT_FOUND" };
            }

            // 2. Lấy chi tiết báo cáo
            const [details] = await db.query(`
                SELECT
                    ct.MaThuoc,
                    lt.TenThuoc,
                    ct.SoLanDung,
                    ct.SoLuongDung
                FROM CT_BCSDT ct
                JOIN LOAITHUOC lt ON ct.MaThuoc = lt.MaThuoc
                WHERE ct.MaBCSDT = ?
                ORDER BY lt.TenThuoc
            `, [MaBCSDT]);

            return {
                ...report,
                ChiTiet: details
            };
        }
        catch (error) {
            console.log("MedicineUsageReport getReportDetail Error:", error);
            return null;
        }
    }

    static async searchReports(filters) {
        try {
            const { Thang, Nam } = filters || {};

            let sql = `
                SELECT
                    MaBCSDT,
                    Thang,
                    Nam
                FROM BAOCAOSUDUNGTHUOC
                WHERE 1=1
            `;

            const params = [];

            if (Thang) {
                sql += ` AND Thang = ?`;
                params.push(Thang);
            }

            if (Nam) {
                sql += ` AND Nam = ?`;
                params.push(Nam);
            }

            sql += ` ORDER BY Nam DESC, Thang DESC`;

            const [rows] = await db.query(sql, params);
            return rows;
        }
        catch (error) {
            console.log("MedicineUsageReport searchReports Error:", error);
            return null;
        }
    }

// Cập nhật báo cáo 
    static async updateReport(MaBCSDT) {
        try {
            // 1. Lấy thông tin tháng/năm của báo cáo
            const [[report]] = await db.query(
                "SELECT Thang, Nam FROM BAOCAOSUDUNGTHUOC WHERE MaBCSDT = ?",
                [MaBCSDT]
            );

            if (!report) {
                return { error: "NOT_FOUND" };
            }

            const { Thang, Nam } = report;

            // 2. Tính toán lại dữ liệu (Dùng LOGIC MỚI như trên)
            const [details] = await db.query(`
                SELECT 
                    ct.MaThuoc,
                    COUNT(DISTINCT pkb.MaPKB) AS SoLanDung,
                    SUM(ct.SoLuong) AS SoLuongDung
                FROM CT_THUOC ct
                JOIN PHIEUKHAMBENH pkb ON ct.MaPKB = pkb.MaPKB
                JOIN HOADONTHANHTOAN hd ON pkb.MaPKB = hd.MaPKB
                WHERE MONTH(pkb.NgayKham) = ?
                AND YEAR(pkb.NgayKham) = ?
                AND hd.TienThuoc > 0
                GROUP BY ct.MaThuoc
            `, [Thang, Nam]);

            // 3. Xóa chi tiết cũ
            await db.query("DELETE FROM CT_BCSDT WHERE MaBCSDT = ?", [MaBCSDT]);

            // 4. Nếu có dữ liệu mới thì insert lại
            if (details.length > 0) {
                for (const d of details) {
                    await db.query(
                        `INSERT INTO CT_BCSDT (MaBCSDT, MaThuoc, SoLanDung, SoLuongDung) VALUES (?, ?, ?, ?)`,
                        [MaBCSDT, d.MaThuoc, d.SoLanDung, d.SoLuongDung]
                    );
                }
            } else {
                // Nếu không có dữ liệu (tháng đó không bán được thuốc nào), có thể trả về thông báo hoặc để trống chi tiết
                // Ở đây ta vẫn return true coi như cập nhật thành công (về trạng thái rỗng)
            }

            return true;
        }
        catch (error) {
            console.log("MedicineUsageReport update Error:", error);
            return null;
        }
    }
    
    static async deleteReport(MaBCSDT) {
        try {
            const [[exist]] = await db.query(
                "SELECT MaBCSDT FROM BAOCAOSUDUNGTHUOC WHERE MaBCSDT = ?",
                [MaBCSDT]
            );

            if (!exist) {
                return { error: "NOT_FOUND" };
            }

            await db.query(
                "DELETE FROM CT_BCSDT WHERE MaBCSDT = ?",
                [MaBCSDT]
            );

            await db.query(
                "DELETE FROM BAOCAOSUDUNGTHUOC WHERE MaBCSDT = ?",
                [MaBCSDT]
            );

            return true;
        }
        catch (error) {
            console.log("MedicineUsageReport delete Error:", error);
            return null;
        }
    }

}

module.exports = MedicineUsageReportService;