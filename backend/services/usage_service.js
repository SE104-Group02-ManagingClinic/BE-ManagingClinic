const db = require('../config/database');

class UsageService {

    // Tạo cách dùng
    static async createUsage (data) {
        try {
            const {
                ma_cach_dung,
                ten_cach_dung
            } = data;
            const result = await db.query(
                "insert into CACHDUNG values (?, ?);",
                [ma_cach_dung, ten_cach_dung]
            );
            const [record] = await db.query(
                "select * from CACHDUNG"
            );
            
            return record[0];
        } 
        catch (error) {
            console.log("UsageService - createUsage: ", error);
            throw(error);
        }
    }

    // Lấy các giá trị trong bản CACHDUNG
    static async getUsage () {
        try {
            const [record] = await db.query("select * from CACHDUNG");
            return record[0];
        }
        catch (error) {
            console.log("UsageService - getUsage: ", error);
            throw(error);
        }
    }

    // Cập nhật cách dùng
    static async updateUsage (data) {
        try {
            const { ma_cach_dung, ten_cach_dung } = data;

            // Kiểm tra tồn tại
            const [exists] = await db.query(
                "SELECT * FROM CACHDUNG WHERE MaCachDung = ?",
                [ma_cach_dung]
            );
            if (exists.length === 0) {
                throw new Error(`Không tìm thấy cách dùng có mã ${ma_cach_dung}`);
            }

            // Cập nhật tên
            await db.query(
                "UPDATE CACHDUNG SET TenCachDung = ? WHERE MaCachDung = ?",
                [ten_cach_dung, ma_cach_dung]
            );

            // Trả lại bản ghi sau cập nhật
            const [updated] = await db.query(
                "SELECT * FROM CACHDUNG WHERE MaCachDung = ?",
                [ma_cach_dung]
            );

            return updated[0];
        } 
        catch (error) {
            console.log("UpdateService - updateUsage: ", error);  
            throw(error);    
        }
    }

    // Xóa cách dùng
    static async deleteUsage () {
        try {
            const [exists] = await db.query(
                "SELECT * FROM CACHDUNG WHERE MaCachDung = ?",
                [ma_cach_dung]
            );
            if (exists.length === 0) {
                throw new Error(`Không tìm thấy cách dùng có mã ${ma_cach_dung}`);
            }

            const [result] = await db.query(
                "DELETE FROM CACHDUNG WHERE MaCachDung = ?",
                [ma_cach_dung]
            );

            return { message: `Đã xóa cách dùng có mã ${ma_cach_dung}`, affectedRows: result.affectedRows };
        } 
        catch (error) {
            console.log("UpdateService - deleteService: ", error);
            throw(error);
        }
    }
}

module.exports = UsageService;
