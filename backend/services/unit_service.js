const db = require('../config/database');

class UnitService {
    // Tạo đơn vị tính
    static async createUnit(data) {
        try {
            const { TenDVT } = data;

            // Lấy mã DVT cuối cùng
            const [rows] = await db.query(
                "SELECT MaDVT FROM DONVITINH ORDER BY MaDVT desc limit 1"
            );

            let lastId = "";
            if (rows.length > 0) {
                lastId = rows[0].MaDVT;
            }

            // Tạo MaDVT mới
            const nextId = this.createId(lastId);

            // Record để insert
            const record = {
                MaDVT: nextId,
                TenDVT
            };

            await db.query("INSERT INTO DONVITINH SET ?", [record]);

            return record;
        }
        catch (error) {
            console.log("UnitService createUnit Error:", error);
            return null;
        }
    }

    // Lấy danh sách đơn vị tính
    static async getUnit() {
        try {
            const [rows] = await db.query(`
                SELECT * 
                FROM DONVITINH
                ORDER BY CAST(SUBSTRING(MaDVT, 4) AS UNSIGNED)
            `);
            return rows;
        }
        catch (error) {
            console.log("UnitService getUnit Error:", error);
        }
    }

    // Cập nhật đơn vị tính theo MaDVT
    static async updateUnit(MaDVT, updateData) {
        try {
            const { TenDVT } = updateData;

            const [rows] = await db.query(
                "update DONVITINH set TenDVT = ? where MaDVT = ?",
                [TenDVT, MaDVT]
            );

            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("UnitService updateUnit Error:", error);
            return null;
        }
    }

    // Xóa đơn vị tính theo MaDVT
    static async deleteUnit(MaDVT) {
        try {
            const [rows] = await db.query(
                "DELETE FROM DONVITINH WHERE MaDVT = ?",
                [MaDVT]
            );

            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("UnitService deleteUnit Error:", error);
        }
    }

    // Kiểm tra tên đơn vị tính đã tồn tại chưa
    static async existedUnit(ten_dvt) {
        try {
            const [rows] = await db.query(
                "SELECT TenDVT FROM DONVITINH WHERE LOWER(TenDVT) = LOWER(?)",
                [ten_dvt]
            );

            return rows.length > 0;
        }
        catch (error) {
            console.log("UnitService existedUnit Error:", error);
            return false;   // QUAN TRỌNG: tránh undefined gây lỗi!
        }
    }

    // Tạo mã đơn vị tính mới
    static createId(lastId) {
        if (lastId === "" || !lastId) {
            return "DVT01";
        }

        const number = parseInt(lastId.slice(3), 10) + 1;

        const newId = "DVT" + number.toString().padStart(2, "0");
        return newId;
    }
}

module.exports = UnitService;
