const db = require('../config/database');

class DiseaseService {
    static async createBenh (data) {
        try {
            const {
                TenBenh,
                TrieuChung,
                NguyenNhan,
                BienPhapChanDoan,
                CachDieuTri
            } = data;

            // Lấy MaBenh cuối cùng
            const [rows] = await db.query(
                "select MaBenh from BENH order by MaBenh desc limit 1"
            );
            let lastId = "";
            if (rows.length > 0) {
                lastId = rows[0].MaBenh;
            }

            // Tạo MaBenh mới theo mã bệnh cuối
            const nextId = this.createId(lastId);

            // Tạo record mới để thêm vào database
            const record = {
                MaBenh: nextId,
                TenBenh,
                TrieuChung,
                NguyenNhan,
                BienPhapChanDoan,
                CachDieuTri         
            }
            const result = await db.query(
                "insert into BENH set ?",
                [record]
            );
            return record; // Trả về bệnh mới nếu thêm thành công
        }
        catch (error) {
            console.log("DiseaseService createBenh Error: ", error);
            return null; // Trả về null nếu thêm không thành công
        }
    }

    // Lấy toàn bộ danh sách bệnh
    static async getDSBenh() {
        try {
            const [rows] = await db.query(
                "select * from BENH"
            );
            return rows;
        }
        catch (error) {
            console.log("DiseaseService getDSBenh Error: ", error);
            // return null; // Trả về null nếu thêm không thành công
        }
    }

    // Lấy danh sách MaBenh và TenBenh
    static async getDSTenBenh() {
        try {
            const [rows] = await db.query(
                "select MaBenh, TenBenh from BENH"
            );
            return rows;
        }
        catch (error) {
            console.log("DiseaseService getDSTenBenh Error: ", error);
            return null; 
        }
    }

    // Tìm kiếm bệnh theo tên bệnh
    static async searchBenh (ten_benh) {
        try {
            const [rows] = await db.query(
                "select * from BENH where TenBenh like ?",
                [`%${String(ten_benh)}%`]
            );
            return rows;
        }
        catch (error) {
            console.log("DiseaseService searchBenh Error: ", error);
            return null; 
        }
    }

    // Cập nhật thông tin bệnh theo MaBenh
    static async updateBenh(MaBenh, updateData) {
        try {
            const {
                TrieuChung,
                NguyenNhan,
                BienPhapChanDoan,
                CachDieuTri
            } = updateData;
            const [rows] = await db.query(
                "update BENH set TrieuChung = ?, NguyenNhan = ?, BienPhapChanDoan = ?, CachDieuTri = ? where MaBenh = ?",
                [TrieuChung, NguyenNhan, BienPhapChanDoan, CachDieuTri, MaBenh]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("DiseaseService updateBenh Error: ", error);
            return null; 
        }
    }

    // Xóa bệnh theo MaBenh
    static async deleteBenh(MaBenh) {
        try {
            const [rows] = await db.query(
                "delete from BENH where MaBenh = ?",
                [MaBenh]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("DiseaseService deleteBenh Error: ", error);
        }
    }
    
    // Kiểm tra tên bệnh đã tồn tại hay chưa
    static async existedBenh (ten_benh) {
        try {
            const [rows] = await db.query(
                "select TenBenh from BENH"
            );
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].TenBenh.toLowerCase() === ten_benh.toLowerCase()) return true;
            }
            return false;
        }
        catch (error) {
            console.log("DiseaseService existedBenh Error: ", error);
        }
    }


    // Tạo mã bệnh mới
    static createId(lastId) {
        if (lastId === "") {
            return "B0001";
        }
        const id = parseInt(lastId.slice(1), 10) + 1;

        const newId = "B" + id.toString().padStart(4, "0");
        return newId;
    }
}

module.exports = DiseaseService;