const db = require('../config/database');

class GroupUserService {
    // Kiem tra ten nhom nguoi dung da ton tai hay chua
    static async existedGroupUser(ten_nhom) {
        try {
            const [rows] = await db.query(
                "select TenNhom from NHOMNGUOIDUNG"
            );
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].TenNhom.toLowerCase() === ten_nhom.toLowerCase()) return true;
            }
            return false;
        }
        catch (error) {
            console.log("GroupUser Service Error: ", error);
        }
    }

    // Tao ma nhom moi
    static createId(lastId) {
        if (lastId === "") {
            return "GR001";
        }
        const id = parseInt(lastId.slice(2), 10) + 1;


        const newId = "GR" + id.toString().padStart(3, "0");
        return newId;
    }

    // Tao nhom nguoi dung
    static async createGroupUser(data) {
        try {
            const {
                TenNhom
            } = data;
            
            // Lay ma nhom nguoi dung cuoi cung
            const [rows] = await db.query(
                "select MaNhom from NHOMNGUOIDUNG order by MaNhom desc limit 1"
            );
            let lastId = "";
            if (rows.length > 0) {
                lastId = rows[0].MaNhom;
            }

            // Tao MaNhom
            const nextId = this.createId(lastId);

            // Tao record moi de them vao database
            const record = {
                MaNhom: nextId,
                TenNhom
            }
            const result = await db.query(
                "insert into NHOMNGUOIDUNG set ?",
                [record]
            );
            return record;
        }
        catch (error) {
            console.log("GroupUser Service createGroupUser error: ", error);
        }
    }

    // Lay thong tin Nhom nguoi dung theo MaNhom
    static async getGroupUserById(MaNhom) {
        try {
            const [rows] = await db.query(
                "select * from NHOMNGUOIDUNG where MaNhom like ?",
                [MaNhom]
            );
            return rows;
        }
        catch (error) {
            console.log("GroupUser Service getGroupUserById Error: ", error);
            return null; 
        }
    }

    // Lay toan bo danh sach Nhom nguoi dung
    static async getGroupUserList() {
        try {
            const [rows] = await db.query(
                "select * from NHOMNGUOIDUNG"
            );
            return rows;
        }
        catch (error) {
            console.log("GroupUser getGroupUserList Error: ", error);
            // return null; // Trả về null nếu thêm không thành công
        }
    }

    // Cap nhat thong tin theo MaNhom
    static async updateGroupUser(MaNhom, updateData) {
        try {
            const {
                TenNhom
            } = updateData;
            const [rows] = await db.query(
                "update NHOMNGUOIDUNG set TenNhom = ? where MaNhom = ?",
                [TenNhom, MaNhom]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("GroupUser Service updateGroupUser Error: ", error);
            return null; 
        }
    }
    // Xóa nhom nguoi dung theo MaNhom
    static async deleteGroupUser(MaNhom) {
        try {
            // 1️. Xóa toàn bộ phân quyền của nhóm
            await db.query(
                `DELETE FROM PHANQUYEN 
                WHERE MaNhom = ?`,
                [MaNhom]
            );

            // 2️. Xóa nhóm người dùng
            const [rows] = await db.query(
                `DELETE FROM NHOMNGUOIDUNG 
                WHERE MaNhom = ?`,
                [MaNhom]
            );

            if (rows.affectedRows === 0) return false;

            return true;
        }
        catch (error) {
            console.log("GroupUserService deleteGroupUser Error: ", error);
            return false;
        }
    }
}

module.exports = GroupUserService;