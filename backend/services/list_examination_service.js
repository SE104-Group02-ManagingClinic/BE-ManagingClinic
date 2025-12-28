const db = require('../config/database');

class ListExamService {
    static async addInList(data) {
        try {
            const { NgayKham, MaBN } = data;

            // 1️ Kiểm tra bệnh nhân đã tồn tại chưa
            const [bn] = await db.query(
                `SELECT MaBN, HoTen, CCCD, GioiTinh, DiaChi
                FROM BENHNHAN
                WHERE MaBN = ?
                LIMIT 1`,
                [MaBN]
            );

            if (bn.length === 0) {
                return { success: false, message: "Bệnh nhân không tồn tại" };
            }

            // 2️ Kiểm tra bệnh nhân đã có trong danh sách khám của ngày đó chưa
            const [check] = await db.query(
                `SELECT 1
                FROM DSKHAMBENH
                WHERE MaBN = ? AND NgayKham = DATE(?)`,
                [MaBN, NgayKham]
            );

            if (check.length > 0) {
                return { success: false, message: "Bệnh nhân đã có trong danh sách khám ngày này" };
            }

            // 3️ Thêm vào danh sách khám
            await db.query(
                `INSERT INTO DSKHAMBENH (NgayKham, MaBN)
                VALUES (DATE(?), ?)`,
                [NgayKham, MaBN]
            );

            // 4️ Trả về thông tin bệnh nhân + MaPKB = null
            return {
                success: true,
                data: {
                    MaBN: bn[0].MaBN,
                    HoTen: bn[0].HoTen,
                    CCCD: bn[0].CCCD,
                    GioiTinh: bn[0].GioiTinh,
                    DiaChi: bn[0].DiaChi,
                    MaPKB: null
                }
            };
        }
        catch (error) {
            console.log("DSKhamBenhService addInList Error:", error);
            return { success: false, message: "Lỗi hệ thống" };
        }
    }


    // Xóa bệnh nhân ra khỏi ds khám
    static async removeFromList(data) {
        try {
            const { NgayKham, MaBN } = data;

            // Chỉ xóa  (YYYY-MM-DD) + bệnh nhân
            const [result] = await db.query(
                `DELETE FROM DSKHAMBENH
                WHERE MaBN = ?
                AND NgayKham = DATE(?)`,
                [MaBN, NgayKham]
            );

            if (result.affectedRows === 0) {
                return { success: false, message: "Không tìm thấy bệnh nhân trong danh sách khám của ngày này" };
            }

            return { success: true };
        }
        catch (error) {
            console.log("DSKhamBenhService removeFromList Error:", error);
            return { success: false, message: "Lỗi hệ thống" };
        }
    }

    //Lấy danh sách 
    static async getDailyList(NgayKham) {
        try {
            const [rows] = await db.query(
                `SELECT 
                    d.NgayKham,
                    d.MaPKB,
                    b.MaBN,
                    b.HoTen,
                    b.CCCD,
                    b.GioiTinh,
                    b.DiaChi
                FROM DSKHAMBENH d
                JOIN BENHNHAN b ON d.MaBN = b.MaBN
                WHERE d.NgayKham = DATE(?)
                ORDER BY b.HoTen`,
                [NgayKham]
            );

            if (rows.length === 0) {
                return {
                    NgayKham,
                    TongSoBenhNhan: 0,
                    DanhSachBenhNhan: []
                };
            }

            return {
                NgayKham: rows[0].NgayKham,
                TongSoBenhNhan: rows.length,
                DanhSachBenhNhan: rows.map(item => ({
                    MaBN: item.MaBN,
                    HoTen: item.HoTen,
                    CCCD: item.CCCD,
                    GioiTinh: item.GioiTinh,
                    DiaChi: item.DiaChi,
                    MaPKB: item.MaPKB   
                }))
            };
        }
        catch (error) {
            console.log("DSKhamBenhService getDailyList Error:", error);
            return null;
        }
    }

}

module.exports = ListExamService;