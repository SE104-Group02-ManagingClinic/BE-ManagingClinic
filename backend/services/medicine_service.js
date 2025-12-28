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
                TacDungPhu
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

                    l.MaLo,
                    l.SoLuongTon,
                    l.GiaBan,
                    l.HanSuDung
                FROM LOAITHUOC t
                LEFT JOIN DONVITINH d ON t.MaDVT = d.MaDVT
                LEFT JOIN CACHDUNG c ON t.MaCachDung = c.MaCachDung
                LEFT JOIN LOTHUOC l ON t.MaThuoc = l.MaThuoc
                ORDER BY CAST(SUBSTRING(t.MaThuoc, 3) AS UNSIGNED), l.HanSuDung
            `);

            // Gom dữ liệu theo MaThuoc
            const medicines = {};

            for (const row of rows) {
                if (!medicines[row.MaThuoc]) {
                    medicines[row.MaThuoc] = {
                        MaThuoc: row.MaThuoc,
                        TenThuoc: row.TenThuoc,
                        CongDung: row.CongDung,
                        TenDVT: row.TenDVT,
                        TenCachDung: row.TenCachDung,
                        TacDungPhu: row.TacDungPhu,
                        LoThuoc: []
                    };
                }

                if (row.MaLo) {
                    medicines[row.MaThuoc].LoThuoc.push({
                        MaLo: row.MaLo,
                        SoLuongTon: row.SoLuongTon,
                        GiaBan: row.GiaBan,
                        HanSuDung: row.HanSuDung
                    });
                }
            }

            return Object.values(medicines);
        }
        catch (error) {
            console.log("MedicineService getMedicine Error:", error);
        }
    }

    // Tìm kiếm thuốc theo tiêu chuẩn: TenThuoc, CongDung
    static async searchMedicine(filters) {
        try {
            const { TenThuoc, CongDung } = filters || {};

            let sql = `
                SELECT 
                    t.MaThuoc,
                    t.TenThuoc,
                    t.CongDung,
                    d.TenDVT,
                    c.TenCachDung,
                    t.TacDungPhu,

                    l.MaLo,
                    l.SoLuongTon,
                    l.GiaBan,
                    l.HanSuDung
                FROM LOAITHUOC t
                LEFT JOIN DONVITINH d ON t.MaDVT = d.MaDVT
                LEFT JOIN CACHDUNG c ON t.MaCachDung = c.MaCachDung
                LEFT JOIN LOTHUOC l ON t.MaThuoc = l.MaThuoc
                WHERE 1=1
            `;

            const params = [];

            if (TenThuoc) {
                sql += ` AND t.TenThuoc LIKE ?`;
                params.push(`%${TenThuoc}%`);
            }

            if (CongDung) {
                sql += ` AND t.CongDung LIKE ?`;
                params.push(`%${CongDung}%`);
            }

            sql += ` ORDER BY CAST(SUBSTRING(t.MaThuoc, 3) AS UNSIGNED), l.HanSuDung`;

            const [rows] = await db.query(sql, params);

            // Gom dữ liệu theo thuốc
            const medicines = {};

            for (const row of rows) {
                if (!medicines[row.MaThuoc]) {
                    medicines[row.MaThuoc] = {
                        MaThuoc: row.MaThuoc,
                        TenThuoc: row.TenThuoc,
                        CongDung: row.CongDung,
                        TenDVT: row.TenDVT,
                        TenCachDung: row.TenCachDung,
                        TacDungPhu: row.TacDungPhu,
                        LoThuoc: []
                    };
                }

                if (row.MaLo) {
                    medicines[row.MaThuoc].LoThuoc.push({
                        MaLo: row.MaLo,
                        SoLuongTon: row.SoLuongTon,
                        GiaBan: row.GiaBan,
                        HanSuDung: row.HanSuDung
                    });
                }
            }

            return Object.values(medicines);
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
                CongDung,
                MaCachDung,
                MaDVT,
                TacDungPhu
            } = updateData;

            const [rows] = await db.query(
                `
                UPDATE LOAITHUOC
                SET
                    CongDung = ?,
                    MaCachDung = ?,
                    MaDVT = ?,
                    TacDungPhu = ?
                WHERE MaThuoc = ?
                `,
                [
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
    
    // Kiểm tra trước khi xóa
    static async canDeleteMedicine(MaThuoc) {
        try {
            // 1. Kiểm tra đã từng được kê đơn chưa
            const [[usedInPrescription]] = await db.query(
                `SELECT 1 FROM CT_THUOC WHERE MaThuoc = ? LIMIT 1`,
                [MaThuoc]
            );

            if (usedInPrescription) {
                return {
                    ok: false,
                    message: "Không thể xóa thuốc đã được kê đơn"
                };
            }

            // 2. Kiểm tra đã tồn tại lô thuốc chưa
            const [[hasLot]] = await db.query(
                `SELECT 1 FROM LOTHUOC WHERE MaThuoc = ? LIMIT 1`,
                [MaThuoc]
            );

            if (hasLot) {
                return {
                    ok: false,
                    message: "Không thể xóa thuốc đã tồn tại lô thuốc"
                };
            }

            return { ok: true };
        }
        catch (error) {
            console.log("MedicineService canDeleteMedicine Error:", error);
            return {
                ok: false,
                message: "Lỗi kiểm tra điều kiện xóa thuốc"
            };
        }
    }


    // Xóa thuốc
    static async deleteMedicine(MaThuoc) {
        try {
            const check = await this.canDeleteMedicine(MaThuoc);

            if (!check.ok) {
                return check; // trả về message nghiệp vụ
            }

            const [result] = await db.query(
                "DELETE FROM LOAITHUOC WHERE MaThuoc = ?",
                [MaThuoc]
            );

            if (result.affectedRows === 0) {
                return { ok: false, message: "Không tìm thấy thuốc để xóa" };
            }

            return { ok: true };
        }
        catch (error) {
            console.log("MedicineService deleteMedicine Error:", error);
            return { ok: false, message: "Lỗi hệ thống khi xóa thuốc" };
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
