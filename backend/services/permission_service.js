const db = require('../config/database');

class PermissionService {
    // Kiem tra phan quyen do da co trong db hay chua
    static async existedPermission(MaNhom, MaChucNang) {
        try {
            const [rows] = await db.query(
                "select * from PHANQUYEN where MaNhom = ? and MaChucNang = ?",
                [MaNhom, MaChucNang]
            );
            if (rows.length > 0) return true;
            return false;
        }
        catch (error) {

        }
    }
    // Them phan quyen moi
    static async createPermission(MaNhom, MaChucNang) {
        try {
            const record = {
                MaNhom,
                MaChucNang
            }
            const result = await db.query(
                "insert into PHANQUYEN set ?",
                [record]
            );
            return record;
        }
        catch (error) {
            console.log("Permission Service Error: ", error);
        }
    }
    // Xoa quyen
    static async deletePermission(MaNhom, MaChucNang) {
        try {
            const [rows] = await db.query(
                "delete from PHANQUYEN where MaNhom = ? and MaChucNang = ?",
                [MaNhom, MaChucNang]
            );
            if (rows.affectedRows === 0) return false;
            return true;
        }
        catch (error) {
            console.log("Permission Service deletePermission Error: ", error);
        }
    }
    // Lay danh sach cac chuc nang cua mot nhom
    static async getFunctionsOfGroupUser(MaNhom) {
        try {
            const [rows] = await db.query(
                `select CN.MaChucNang, CN.TenChucNang
                from PHANQUYEN PQ
                join CHUCNANG CN on PQ.MaChucNang = CN.MaChucNang
                where PQ.MaNhom = ?`,
                [MaNhom]
            );
            return rows;
        }
        catch (error) {
            console.log("Permission Service getFunctionsOfGroupUser Error: ", error);
        }
    }
}

module.exports = PermissionService;