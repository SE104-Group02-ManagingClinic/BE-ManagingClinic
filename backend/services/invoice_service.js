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
            const [rows] = await db.query(
                `SELECT MaHD FROM HOADONTHANHTOAN 
                 WHERE MaPKB = ? LIMIT 1`,
                [MaPKB]
            );

            if (rows.length > 0) {
                return rows[0].MaHD; // Trả về MaHD nếu tồn tại
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

            // 1. Lấy ID cuối để sinh mã
            const [rows] = await db.query(
                "select MaHD from HOADONTHANHTOAN order by MaHD desc limit 1"
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

            // 2. Insert Hóa đơn
            const [addRecord] = await db.query(
                "insert into HOADONTHANHTOAN set ?",
                [record]
            );

            let note = "";

            // 3. Xử lý Logic Kho (Chỉ thực hiện khi insert thành công)
            if (addRecord.affectedRows > 0) {
                
                // TRƯỜNG HỢP A: KHÁCH KHÔNG MUA THUỐC (TienThuoc == 0)
                // Logic: Hoàn trả lại số lượng thuốc vào kho
                if (TienThuoc === 0) {
                    // Lấy danh sách thuốc đã kê trong PKB để biết lô nào cần trả
                    const [thuocList] = await db.query(
                        "SELECT MaThuoc, MaLo, SoLuong FROM CT_THUOC WHERE MaPKB = ?",
                        [MaPKB]
                    );

                    if (thuocList.length > 0) {
                        for (const item of thuocList) {
                            // Cộng lại số lượng vào LOTHUOC (SoLuongTon + SoLuong)
                            await db.query(
                                `UPDATE LOTHUOC 
                                 SET SoLuongTon = SoLuongTon + ? 
                                 WHERE MaLo = ?`,
                                [item.SoLuong, item.MaLo]
                            );
                        }
                        note = "Đã hoàn trả thuốc vào kho do khách không mua.";
                    }
                }
                
                // TRƯỜNG HỢP B: KHÁCH MUA THUỐC (TienThuoc > 0)
                // Logic: Không làm gì cả, vì tồn kho đã trừ lúc Tạo Phiếu Khám Bệnh.
                
                // --- E. Cập nhật lại DSKHAMBENH ---
                await db.query(
                    `UPDATE DSKHAMBENH
                    SET MaHD = ?
                    WHERE MaBN = ? AND NgayKham = DATE(?)`,
                    [nextId, MaBN, NgayKham]
                );
                
                return { ...record, Note: note };
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