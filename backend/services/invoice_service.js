const db = require('../config/database');

class InvoiceService {
    // Tao MaHD moi
    static createId(lastId) {
        if (lastId === "") {
            return "HD00001";
        }
        const id = parseInt(lastId.slice(2), 10) + 1;


        const newId = "HD" + id.toString().padStart(5, "0");
        return newId;
    }

    // -- Kiểm tra xem có hóa đơn nào đã có phiếu khám bệnh
    static async existedInvoice(MaPKB) {
        try {
            // Kiểm tra xem có hóa đơn nào đã có MaPKB (phiếu khám bệnh) chưa
            const [rows] = await db.query(
                `SELECT MaHD, MaPKB
                FROM HOADONTHANHTOAN
                WHERE MaPKB IS NOT NULL
                ORDER BY MaHD DESC
                LIMIT 1`
            );

            // Nếu rows.length > 0 thì đã tồn tại hóa đơn gắn với phiếu khám bệnh
            if (rows.length > 0) {
                rows[0].MaHD;
            } 
            return "";
        }
        catch (error) {
            console.log("Invoice Service existedInvoice error: ", error);
            return null;
        }
    }
    // Them moi hoa don
    static async createInvoice(data) {
        try {
            const {
                MaPKB,
                NgayThanhToan,
                TienKham,
                TienThuoc
            } = data;

            const [rows] = await db.query(
                `select MaHD 
                from HOADONTHANHTOAN 
                order by MaHD desc 
                limit 1`
            );

            let lastId = "";
            if (rows.length > 0) {
                lastId = rows[0].MaHD;
            }

            const nextId = this.createId(lastId);
            const TongTien = TienKham + TienThuoc;
            const record = {
                MaHD: nextId,
                MaPKB,
                NgayThanhToan,
                TienKham,
                TienThuoc,
                TongTien
            }

            const [addRecord] = await db.query(
                `insert into HOADONTHANHTOAN set ?`,
                [record]
            );

            // Chỉ cập nhật tồn kho nếu hóa đơn tạo thành công và có tiền thuốc > 0
            if (addRecord.affectedRows > 0 && TienThuoc > 0) {
                // Lấy danh sách thuốc trong phiếu khám bệnh
                const [thuocList] = await db.query(
                    `SELECT MaThuoc, SoLuong 
                    FROM CT_THUOC 
                    WHERE MaPKB = ?`,
                    [MaPKB]
                );

                // Cập nhật tồn kho cho từng thuốc
                for (const thuoc of thuocList) {
                    await db.query(
                        `UPDATE LOAITHUOC 
                        SET SoLuongTon = SoLuongTon - ? 
                        WHERE MaThuoc = ?`,
                        [thuoc.SoLuong, thuoc.MaThuoc]
                    );
                }
                return record;
            }

            return null;
        }
        catch (error) {
            console.log("Invoice Service createInvoice error: ", error);
            return null;
        }
    }
    // Lay tat ca thong tin hoa don thanh toan theo ngay
    static async getInvoicesByDate(date) {
        try {    
            const [rows] = await db.query(
                `select * 
                from HOADONTHANHTOAN hd
                where hd.NgayThanhToan = ?`,
                [date]
            );
            return rows;
        }
        catch (error) {
            console.log("Invoice Service getInvoicesByDate error: ", error);
            return null;
        }
    }
    
    // Lấy thông tin hóa đơn thanh toán theo MaHD
    static async getInvoiceById(MaHD) {
        try {
            const [rows] = await db.query(
                `SELECT * 
                FROM HOADONTHANHTOAN hd
                WHERE hd.MaHD = ?`,
                [MaHD]
            );
            
            return rows.length > 0 ? rows[0] : null;
        }
        catch (error) {
            console.log("Invoice Service getInvoiceById error: ", error);
            return null;
        }
    }

    // Cập nhật Tiền khám, Tiền thuốc, Tổng tiền theo MaHD
    static async updateInvoice(MaHD, updateData) {
        try {
            const { TienKham, TienThuoc } = updateData;

            // Tính tổng tiền
            const TongTien = TienKham + TienThuoc;

            const [result] = await db.query(
                `UPDATE HOADONTHANHTOAN 
                SET TienKham = ?, 
                    TienThuoc = ?, 
                    TongTien = ?
                WHERE MaHD = ?`,
                [TienKham, TienThuoc, TongTien, MaHD]
            );

            if (result.affectedRows > 0) {
                return { MaHD, TienKham, TienThuoc, TongTien };
            } else {
                return null; // Không tìm thấy hóa đơn để cập nhật
            }
        } catch (error) {
            console.log("Invoice Service updateInvoiceById error: ", error);
            return null;
        }
    }

    // Xóa hóa đơn thanh toán theo MaHD
    static async deleteInvoiceById(MaHD) {
        try {
            const [result] = await db.query(
                `DELETE FROM HOADONTHANHTOAN 
                WHERE MaHD = ?`,
                [MaHD]
            );

            // Nếu có bản ghi bị ảnh hưởng thì trả về true
            if (result.affectedRows > 0) {
                return true;   // Xóa thành công
            } else {
                return false;  // Không tìm thấy hóa đơn để xóa
            }
        } catch (error) {
            console.log("Invoice Service deleteInvoiceById error: ", error);
            return null;
        }
    }

}

module.exports = InvoiceService;   