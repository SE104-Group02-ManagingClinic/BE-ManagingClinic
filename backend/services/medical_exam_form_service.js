const db = require('../config/database');

class MedicalExamForm {
    // Tao ma PKB
    static createId(lastId) {
        if (lastId === "") {
            return "PKB00001";
        }
        const id = parseInt(lastId.slice(3), 10) + 1;


        const newId = "PKB" + id.toString().padStart(5, "0");
        return newId;
    }

    static async createExamForm (data) {
        try {
            const {
                MaBN,
                NgayKham,
                TrieuChung,
                CT_Benh,
                CT_Thuoc,
                TongTienThuoc
            } = data;

            // Lay MaPKB cuoi dung
            const [rows] = await db.query(
                `select MaPKB 
                from PHIEUKHAMBENH 
                order by MaPKB desc 
                limit 1`
            );
            let lastId = "";
            if (rows.length > 0) {
                lastId = rows[0].MaPKB;
            }
            
            // Tao MaPKB
            const nextId = this.createId(lastId);

            // Tao record
            const record = {
                MaPKB: nextId,
                MaBN,
                NgayKham,
                TrieuChung,
                TongTienThuoc
            }
            const [result] = await db.query(
                "insert into PHIEUKHAMBENH set ?",
                [record]
            );

            // Nếu tạo thành công (affectedRows > 0) thì mới thêm CT_BENH và CT_THUOC
            if (result.affectedRows > 0) {
                // Tạo CT_BENH
                for (let i = 0; i < CT_Benh.length; i++) {
                    const recordBenh = {
                        MaPKB: nextId,
                        MaBenh: CT_Benh[i]
                    };
                    await db.query(
                        "INSERT INTO CT_BENH SET ?",
                        [recordBenh]
                    );
                }

                // Tạo CT_THUOC
                for (let i = 0; i < CT_Thuoc.length; i++) {
                    const recordThuoc = {
                        MaThuoc: CT_Thuoc[i].MaThuoc,
                        MaPKB: nextId,
                        SoLuong: CT_Thuoc[i].SoLuong,
                        DonGiaBan: CT_Thuoc[i].DonGiaBan,
                        ThanhTien: CT_Thuoc[i].ThanhTien
                    };
                    await db.query(
                        "INSERT INTO CT_THUOC SET ?",
                        [recordThuoc]
                    );
                }
                return nextId;
            }
            else return "";
        }
        catch (error) {
            console.log("MedicalExamForm createMedicalExamForm error: ", error);
            return null;
        }

    }

    // Cap nhat phieu kham benh
    static async updateExamForm (MaPKB, data) {
        try {
            const {  
                MaBN, 
                NgayKham, 
                TrieuChung, 
                CT_Benh, 
                CT_Thuoc,
                TongTienThuoc
            } = data;

            // Update thông tin chung
            await db.query(
                `update PHIEUKHAMBENH 
                set MaBN=?, NgayKham=?, TrieuChung=?, TongTienThuoc=?
                WHERE MaPKB=?`,
                [MaBN, NgayKham, TrieuChung, TongTienThuoc, MaPKB]
            );

            // Xóa chi tiết bệnh cũ
            await db.query(
                "delete from CT_BENH where MaPKB=?", 
                [MaPKB]
            );

            // Xóa chi tiết thuốc cũ
            await db.query(
                "delete from CT_THUOC where MaPKB=?", 
                [MaPKB]
            );

            // Insert lại CT_BENH 
            for (let i = 0; i < CT_Benh.length; i++) {
                const record = {
                    MaPKB,
                    MaBenh: CT_Benh[i]
                };
                await db.query(
                    "insert into CT_BENH set ?",
                    [record]
                );
            }

            // Insert lại CT_THUOC 
            for (let i = 0; i < CT_Thuoc.length; i++) {
                const record = {
                    MaThuoc: CT_Thuoc[i].MaThuoc,
                    MaPKB,
                    SoLuong: CT_Thuoc[i].SoLuong,
                    DonGiaBan: CT_Thuoc[i].DonGiaBan,
                    ThanhTien: CT_Thuoc[i].ThanhTien
                }
                await db.query(
                    "insert into CT_THUOC set ?",
                    [record]
                );
            }

            return true;
        }
        catch (error) {
            console.error("updateExamForm error:", error);
            return false;
        }
    }

    // Xoa phieu kham benh 
    static async deleteExamForm (MaPKB) {
        try {
            // Xóa chi tiết bệnh/thuốc cũ
            await db.query("delete from CT_BENH where MaPKB=?", [MaPKB]);
            await db.query("delete from CT_THUOC where MaPKB=?", [MaPKB]);
            const [rows] = await db.query(
                "delete from PHIEUKHAMBENH where MaPKB = ?", 
                [MaPKB]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        } catch (error) {
            console.error("deleteExamForm error:", error);
            return false;
        } 
    }

    // Lấy danh sách phiếu khám bệnh theo ngày khám
    static async getExamFormsByDate(examDate) {
        try {
            const [rows] = await db.query(
                `SELECT 
                    pkb.MaPKB,
                    pkb.MaBN,
                    bn.HoTen,
                    bn.CCCD,
                    pkb.TrieuChung,
                    pkb.TongTienThuoc
                FROM PHIEUKHAMBENH pkb
                JOIN BENHNHAN bn ON pkb.MaBN = bn.MaBN
                WHERE pkb.NgayKham = ?`,
                [examDate]
            );

            return rows; // trả về dạng JSON array
        } catch (error) {
            console.error("getExamFormsByDate error:", error);
            return [];
        }
    }

    // Lấy thông tin của phiếu khám bệnh theo MaPKB
    static async getExamFormById(MaPKB) {
        try {
            // Lấy thông tin phiếu + bệnh nhân
            const [pkbRows] = await db.query(
                `SELECT 
                    pkb.MaPKB,
                    pkb.MaBN,
                    bn.HoTen,
                    bn.CCCD,
                    pkb.NgayKham,
                    pkb.TrieuChung,
                    pkb.TongTienThuoc
                FROM PHIEUKHAMBENH pkb
                JOIN BENHNHAN bn ON pkb.MaBN = bn.MaBN
                WHERE pkb.MaPKB = ?`,
                [MaPKB]
            );

            if (pkbRows.length === 0) return null;
            const examForm = pkbRows[0];

            // Lấy chi tiết bệnh (có tên bệnh)
            const [benhRows] = await db.query(
                `SELECT cb.MaBenh, b.TenBenh
                FROM CT_BENH cb
                JOIN BENH b ON cb.MaBenh = b.MaBenh
                WHERE cb.MaPKB = ?`,
                [MaPKB]
            );

            // Lấy chi tiết thuốc (có tên thuốc)
            const [thuocRows] = await db.query(
                `SELECT ct.MaThuoc, lt.TenThuoc, ct.SoLuong, ct.DonGiaBan, ct.ThanhTien
                FROM CT_THUOC ct
                JOIN LOAITHUOC lt ON ct.MaThuoc = lt.MaThuoc
                WHERE ct.MaPKB = ?`,
                [MaPKB]
            );

            // Trả về JSON đầy đủ
            return {
                MaPKB: examForm.MaPKB,
                MaBN: examForm.MaBN,
                HoTen: examForm.HoTen,
                CCCD: examForm.CCCD,
                NgayKham: examForm.NgayKham,
                TrieuChung: examForm.TrieuChung,
                TongTienThuoc: examForm.TongTienThuoc,
                CT_Benh: benhRows.map(b => ({
                    MaBenh: b.MaBenh,
                    TenBenh: b.TenBenh
                })),
                CT_Thuoc: thuocRows.map(t => ({
                    MaThuoc: t.MaThuoc,
                    TenThuoc: t.TenThuoc,
                    SoLuong: t.SoLuong,
                    DonGiaBan: t.DonGiaBan,
                    ThanhTien: t.ThanhTien
                }))
            };
        }
        catch (error) {
            console.error("getExamFormById error:", error);
            throw error;
        }
    }
}

module.exports = MedicalExamForm;