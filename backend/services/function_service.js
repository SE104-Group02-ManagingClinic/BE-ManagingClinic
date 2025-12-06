const db = require('../config/database');

class FunctionService {
    // Kiem tra ten chuc nang da ton tai hay chua
    static async existedFunction(ten_chuc_nang) {
        try {
            const [rows] = await db.query(
                "select TenChucNang from CHUCNANG"
            );
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].TenChucNang.toLowerCase() === ten_chuc_nang.toLowerCase()) return true;
            }
            return false;
        }
        catch (error) {
            console.log("Function Service Error: ", error);
        }
    }

    // Tao ma chuc nang moi
    static createId(lastId) {
        if (lastId === "") {
            return "CN001";
        }
        const id = parseInt(id.slice(1), 10) + 1;

        const newId = "CN" + id.toString().padStart(3, "0");
        return newId;
    }

    // Tao chuc nang
    static async createFunction(data) {
        try {
            const {
                TenChucNang,
                TenManHinhDuocLoad
            } = data;
            
            // Lay ma chuc nang cuoi cung
            const [rows] = await db.query(
                "select MaChucNang from CHUCNANG order by MaChucNang desc limit 1"
            );
            let lastId = "";
            if (rows.length > 0) {
                lastId = rows[0].MaChucNang;
            }

            // Tao MaChucNang
            const nextId = this.createId(lastId);

            // Tao record moi de them vao database
            const record = {
                MaChucNang: nextId,
                TenChucNang,
                TenManHinhDuocLoad
            }
            const result = await db.query(
                "insert into CHUCNANG set ?",
                [record]
            );
            return record;
        }
        catch (error) {
            console.log("Function Service createFunction error: ", error);
        }
    }

    // Lay thong tin chuc nang theo MaChucNang
    static async getFunctionById(MaChucNang) {
        try {
            const [rows] = await db.query(
                "select * from CHUCNANG where MaChucNang like ?",
                [MaChucNang]
            );
            return rows;
        }
        catch (error) {
            console.log("FunctionService getFunctionById Error: ", error);
            return null; 
        }
    }

    // Lay toan bo danh sach chuc nang
    static async getFunctionList() {
        try {
            const [rows] = await db.query(
                "select * from CHUCNANG"
            );
            return rows;
        }
        catch (error) {
            console.log("functionService getFunctionList Error: ", error);
            // return null; // Trả về null nếu thêm không thành công
        }
    }

    // Lay danh sach MaChucNang va TenChucNang
    static async getFunctionNameList() {
        try {
            const [rows] = await db.query(
                "select MaChucNang, TenChucNang from CHUCNANG"
            );
            return rows;
        }
        catch (error) {
            console.log("FunctionService getFunctionNameList Error: ", error);
            return null; 
        }
    }

    // Cap nhat thong tin theo MaChucNang
    static async updateFunction(MaChucNang, updateData) {
        try {
            const {
                TenChucNang,
                TenManHinhDuocLoad
            } = updateData;
            const [rows] = await db.query(
                "update CHUCNANG set TenChucNang = ?, TenManHinhDuocLoad = ? where MaChucNang = ?",
                [TenChucNang, TenManHinhDuocLoad, MaChucNang]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("FunctionService updateFunction Error: ", error);
            return null; 
        }
    }
    // Xóa chuc nang theo MaChucNang
    static async deleteFunction(MaChucNang) {
        try {
            const [rows] = await db.query(
                "delete from CHUCNANG where MaChucNang = ?",
                [MaChucNang]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("FunctionService deleteFunction Error: ", error);
        }
    }
}

module.exports = FunctionService;