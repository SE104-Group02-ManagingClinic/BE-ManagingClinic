const db = require('../config/database');

class UserService {
    // Kiem tra ten nguoi dung da ton tai hay chua
    static async existedUser(ten_dang_nhap) {
        try {
            const [rows] = await db.query(
                "select TenDangNhap from NGUOIDUNG"
            );
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].TenDangNhap.toLowerCase() === ten_dang_nhap.toLowerCase()) return true;
            }
            return false;
        }
        catch (error) {
            console.log("User Service Error: ", error);
        }
    }
    // Tao nguoi dung
    static async createUser(data) {
        try {
            const result = await db.query(
                "insert into NGUOIDUNG set ?",
                [data]
            );
            return data;
        }
        catch (error) {
            console.log("User Service createUser error: ", error);
        }
    }

    // Dang nhap
    static async login(data) {
        try {
            const {
                TenDangNhap,
                MatKhau
            } = data;
            const [rows] = await db.query(
                "select * from NGUOIDUNG where TenDangNhap like ? and MatKhau like ?",
                [TenDangNhap, MatKhau]
            );
            if (rows.length > 0) return rows[0];
            return null;
        }
        catch (error) {
            console.log("User Service login error: ", error);
        }
    }

    // Cap nhat mat khau
    static async updatePassword(data) {
        try {
            const {
                TenDangNhap,
                MatKhauMoi
            } = data;
            const [rows] = await db.query(
                "update NGUOIDUNG set MatKhau = ? where TenDangNhap = ?",
                [MatKhauMoi, TenDangNhap]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("UserService updatePassword error: ", error);
        }
    }
    // Cap nhat nhom nguoi dung
    static async updateGroup(data) {
        try {
            const {
                TenDangNhap,
                MaNhomMoi
            } = data;
            const [rows] = await db.query(
                "update NGUOIDUNG set MaNhom = ? where TenDangNhap = ?",
                [MaNhomMoi, TenDangNhap]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("UserService updateGroup error: ", error);
        }
    }
    // Xóa nguoi dung
    static async deleteUser(TenDangNhap) {
        try {
            const [rows] = await db.query(
                "delete from NGUOIDUNG where TenDangNhap = ?",
                [TenDangNhap]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("UserService deleteUser Error: ", error);
        }
    }
}

module.exports = UserService;