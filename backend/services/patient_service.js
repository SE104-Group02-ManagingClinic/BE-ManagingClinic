const db = require("../config/database");

class PatientService {
    static async createPatient (data) {
        try {
            const {
                HoTen,
                CCCD,
                GioiTinh,
                NamSinh,
                DiaChi,
                SDT
            } = data;

            // Lấy MaBN cuối cùng
            const [rows] = await db.query(
                "select MaBN from BENHNHAN order by MaBN desc limit 1"
            );
            let lastId = "";
            if (rows.length > 0) {
                lastId = rows[0].MaBN;
            }
            
            // Tạo MaBN mới theo bệnh nhân cuối
            const nextId = this.createId(lastId);

            // Tạo record mới để thêm vào db
            const record = {
                MaBN: nextId,
                HoTen,
                CCCD,
                GioiTinh,
                NamSinh,
                DiaChi,
                SDT         
            }
            const result = await db.query(
                "insert into BENHNHAN set ?",
                [record]
            );
            return record;
        }
        catch (error) {
            console.log("PatientService createPatient Error: ", error);
            return null; // Trả về null nếu thêm không thành công
        }
    }

    // Kiểm tra bệnh nhân đã có hay chưa
    static async existedPatient(cccd) {
        try {
            const [rows] = await db.query(
                "select CCCD from BENHNHAN"
            );
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].CCCD === cccd) return true;
            }
            return false;
        }
        catch (error) {
            console.log("PatientService existedPatient Error: ", error);
        }
    }

    // Kiểm tra bệnh nhân theo MaBN
    static async existedPatientById(MaBN) {
        try {
            const [rows] = await db.query(
                "SELECT MaBN FROM BENHNHAN WHERE MaBN = ?",
                [MaBN]
            );
            return rows.length > 0; // true nếu tìm thấy, false nếu không
        } catch (error) {
            console.log("PatientService existedPatient Error: ", error);
            return false;
        }
    }
    // Tạo mã bệnh nhân mới
    static createId(lastId) {
        if (lastId === "") {
            return "BN001";
        }
        const id = parseInt(lastId.slice(2), 10) + 1;

        const newId = "BN" + id.toString().padStart(3, "0");
        return newId;
    }

    // Tim kiem benh nhan theo cccd
    static async searchPatient(cccd) {
        try {
            // Lấy thông tin bệnh nhân
        const [patients] = await db.query(
            "SELECT * FROM BENHNHAN WHERE CCCD = ?",
            [cccd]
        );

        if (patients.length === 0) {
            return null; // Không tìm thấy bệnh nhân
        }

        const patient = patients[0];

        // Lấy danh sách phiếu khám bệnh kèm loại bệnh và triệu chứng, sắp xếp theo ngày gần nhất
        const [records] = await db.query(
            `SELECT pkb.MaPKB, pkb.NgayKham, b.TenBenh, pkb.TrieuChung
             FROM PHIEUKHAMBENH pkb
             LEFT JOIN CT_BENH ct ON pkb.MaPKB = ct.MaPKB
             LEFT JOIN BENH b ON ct.MaBenh = b.MaBenh
             WHERE pkb.MaBN = ?
             ORDER BY pkb.NgayKham DESC`,
            [patient.MaBN]
        );

        // Gom nhóm các bệnh theo từng phiếu khám
        const groupedRecords = records.reduce((acc, row) => {
            let record = acc.find(r => r.MaPKB === row.MaPKB);
            if (!record) {
                record = {
                    MaPKB: row.MaPKB,
                    NgayKham: row.NgayKham,
                    TrieuChung: row.TrieuChung,
                    Benh: []
                };
                acc.push(record);
            }
            if (row.TenBenh) {
                record.Benh.push(row.TenBenh);
            }
            return acc;
        }, []);

        return {
            ...patient,
            PhieuKhamBenh: groupedRecords
        };

        }
        catch (error) {
            console.log("PatientService searchPatient Error:", error);
        }
    }

    static async getAllPatients() {
        try {
            const [rows] = await db.query(
                "select * from BENHNHAN"
            );
            return rows;
        }
        catch (error) {
            console.log("PatientService getAllPatients Error:", error);
        }
    }

    // Cap nhap thong tin benh nhan theo MaBN
    static async updatePatient(MaBN, updateData) {
        try {
            const {
                HoTen,
                CCCD,
                GioiTinh,
                NamSinh,
                DiaChi,
                SDT
            } = updateData;
            const [rows] = await db.query(
                "update BENHNHAN set HoTen = ?, CCCD = ?, GioiTinh = ?, NamSinh = ?, DiaChi = ?, SDT = ? where MaBN = ?",
                [HoTen, CCCD, GioiTinh, NamSinh, DiaChi, SDT, MaBN]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("PatientService updatePatient Error: ", error);
            return null;
        }
    }
    // Xoa benh nhan theo MaBN
    static async deletePatient(MaBN) {
        try {
            const [rows] = await db.query(
                "delete from BENHNHAN where MaBN = ?",
                [MaBN]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("PatientService deletePatient Error: ", error);
        }
    }
}

module.exports = PatientService;