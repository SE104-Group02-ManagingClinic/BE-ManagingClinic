const db = require('../config/database');

class UsageService {
    // Tạo cách dùng
    static async createUsage (data) {
        try {
            const {
                TenCachDung
            } = data;

            // Lấy MaCachDung cuối cùng
            const [rows] = await db.querry(
                "select MaCachDung from CACHDUNG order by MaCachDung desc limit 1"
            );

            let lastId = "";
            if(rows.length > 0) {
                lastId = rows[0].MaCachDung;
            }
            else
                lastId = "";

            // Tạo MaCachDung mới theo mã cách dùng cuối
            const nextId = this.createId(lastId); 

            // Tạo record mới để thêm vào database
            const record = {
                MaCachDung: nextId,
                TenCachDung
            }
            const result = await db.query(
                "insert into CACHDUNG set ?",
                [record]
            );
            return record;
        } 
        
        catch (error) {
            console.log("UsageService createdUsage Error: ", error);
            return null;
        }
    }

    // Lấy các dòng trong bản CACHDUNG
    static async getUsage () {
        try {
            const [rows] = await db.query("select * from CACHDUNG");
            return rows;
        }
        catch (error) {
            console.log("UsageService getUsage Error: ", error);
        }
    }

    // Cập nhật cách dùng theo MaCachDung
    static async updateUsage (MaCachDung, updateData) {
        try {
            const { 
                TenCachDung 
            } = updateData;

            const [rows] = await db.query(
                "update CACHDUNG set TenCachDung = ? where MaCachDung = ?",
                [TenCachDung, MaCachDung]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        } 
        catch (error) {
            console.log("UsageService updateService Error:", error);  
            return null;
        }
    }

    // Xóa cách dùng theo MaCachDung
    static async deleteUsage(MaCachDung) {
        try {
            const [rows] = await db.query(
                "delete from CACHDUNG where MaCachDung = ?",
                [MaCachDung]
            );
            if (rows.affectedRows === 0)    return false;
            return true;
        } 
        catch (error) {
            console.log("UsageService existedUsage Error: ", error);
        }
    }

    // Kiểm tra tên cách dùng đã tồn tại hay chưa
    static async existedUsage (ten_cach_dung) {
        try {
            const [rows] = await db.query(
                "select TenCachDung from CACHDUNG"
            );
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].TenCachDung.toLowerCase() === ten_cach_dung.toLowerCase()) return true;
            }
            return false;
        }
        catch (error) {
            console.log("UsageService existedUsage Error: ", error);
        }
    }

    // Tạo mã cách dùng mới
    static createId(lastId) {
        if (lastId === "") {
            return "CD001";
        }
        const id = parseInt(id.slice(1), 10) + 1;

        const newId = "C" + id.toString().padStart(4, "0");
        return newId;
    }
}

module.exports = UsageService;
