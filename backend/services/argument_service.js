const db = require('../config/database');

class ArgumentService {

    // Tạo tham số 
    static async createThamSo (data) {
        try {
            const {
                so_benh_nhan,
                ti_le,
                tien_kham
            } = data;
            const result = await db.query(
                "insert into THAMSO values (?, ?, ?);",
                [so_benh_nhan, ti_le, tien_kham]
            );
            const [record] = await db.query(
                "select * from THAMSO"
            );
            
            return record[0];
        } 
        catch (error) {
            console.log("ArgumentService - createThamSo: ", error);
        }
    }

    // Lấy các giá trị trong bản THAMSO
    static async getThamSo () {
        try {
            const [record] = await db.query("select * from THAMSO");
            return record[0];
        }
        catch (error) {
            console.log("ArgumentService - getThamSo: ", error);
        }
    }

    // Cập nhật số bệnh nhân tối đa 
    static async updateSoBenhNhanToiDa (so_benh_nhan_moi) {
        try {
            const affectRow = db.query(
                "update THAMSO set SoBenhNhanToiDa = ?",
                [so_benh_nhan_moi]
            );
            const [record] = await db.query(
                "select * from THAMSO"
            );
            
            return record[0];
        } 
        catch (error) {
            console.log("ArgumentService - updateSoBenhNhanToiDa: ", error);
            
        }
    }

    // Cập nhật tỉ lệ tính đơn giá bán
    static async updateTiLeTinhDonGiaBan (ti_le_moi) {
        try {
            const affectRow = db.query(
                "update THAMSO set TiLeTinhDonGiaBan = ?",
                [ti_le_moi]
            );
            const [record] = await db.query(
                "select * from THAMSO"
            );
            
            return record[0];
        } 
        catch (error) {
            console.log("ArgumentService - updateTiLeTinhDonGiaBan: ", error);
        }
    }

    // Cập nhật Tiền khám
    static async updateTienKham (tien_kham_moi) {
        try {
            const affectRow = db.query(
                "update THAMSO set TienKham = ?",
                [tien_kham_moi]
            );
            const [record] = await db.query(
                "select * from THAMSO"
            );
            
            return record[0];
        } 
        catch (error) {
            console.log("ArgumentService - updateTienKham: ", error);
        }
    }
}

module.exports = ArgumentService;
