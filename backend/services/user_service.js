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

    // Đăng nhập
    static async login(data) {
        try {
            const { TenDangNhap, MatKhau } = data;

            // 1️. Lấy thông tin user + tên nhóm
            const [users] = await db.query(
                `SELECT nd.TenDangNhap, nd.MatKhau, nd.MaNhom, nn.TenNhom
                FROM NGUOIDUNG nd
                JOIN NHOMNGUOIDUNG nn ON nd.MaNhom = nn.MaNhom
                WHERE nd.TenDangNhap = ? AND nd.MatKhau = ?`,
                [TenDangNhap, MatKhau]
            );

            if (users.length === 0) return null;

            const user = users[0];

            // 2️. Lấy danh sách chức năng của nhóm
            const [functions] = await db.query(
                `SELECT cn.MaChucNang, cn.TenChucNang, cn.TenThanhPhanDuocLoad
                FROM PHANQUYEN pq
                JOIN CHUCNANG cn ON pq.MaChucNang = cn.MaChucNang
                WHERE pq.MaNhom = ?`,
                [user.MaNhom]
            );

            // 3️. Gộp kết quả
            return {
                ...user,
                DanhSachChucNang: functions
            };
        }
        catch (error) {
            console.log("User Service login error: ", error);
            return null;
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