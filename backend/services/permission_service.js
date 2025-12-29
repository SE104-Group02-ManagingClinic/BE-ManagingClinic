const db = require('../config/database');

class PermissionService {
    // Them phan quyen moi
    static async createPermissions(MaNhom, arrMaChucNang) {
        try {
            // Kiểm tra xem nhóm đã có phân quyền nào chưa
            const [rows] = await db.query(
                "select 1 from PHANQUYEN where MaNhom = ? limit 1",
                [MaNhom]
            );

            if (rows.length > 0) {
                // Nhóm đã có phân quyền rồi -> không tạo mới
                return false;
            }

            // Nếu chưa có -> thêm toàn bộ danh sách quyền
            for (const MaChucNang of arrMaChucNang) {
                await db.query(
                    `insert into PHANQUYEN (MaNhom, MaChucNang) values (?, ?)`,
                    [MaNhom, MaChucNang]
                );
            }

            return true;
        } catch (error) {
            console.log("Permission Service createPermissions Error: ", error);
            return null;
        }
    }

    // Xoa quyen
    static async deletePermissions(MaNhom, DSMaChucNang) {
        try {
            const hasAnyPermission = await this.hasAnyPermission(MaNhom);
            
            if (!hasAnyPermission) {
                return false;
            }
            await db.query( `
                delete from PHANQUYEN 
                where MaNhom = ? and MaChucNang in (?)`, 
                [MaNhom, DSMaChucNang] 
            ); 
            return true;
        }
        catch (error) {
            console.log("Permission Service deletePermission Error: ", error);
        }
    }

    // Kiem tra nhom da duoc phan quyen chua
    static async hasAnyPermission(MaNhom) { 
        try { 
            const [rows] = await db.query( `
                select 1 from PHANQUYEN 
                where MaNhom = ? limit 1`, 
                [MaNhom]); 
            return rows.length > 0; 
        } 
        catch (error) { 
            console.log("Permission Service hasAnyPermission Error: ", error); 
            return false; 
        } 
    }

    // Cap nhat danh sach phan quyen
    static async updatePermissions(MaNhom, DSMaChucNang) {
        try {
            const hasAnyPermission = await this.hasAnyPermission(MaNhom);
            
            if (!hasAnyPermission) {
                await this.createPermissions(MaNhom, DSMaChucNang);
                return true;
            }

            const currPermissions = await  this.getFunctionsOfGroupUser(MaNhom);

            const toAdd = DSMaChucNang.filter(x => !currPermissions.includes(x));
            const toDelete = currPermissions.filter(x => !DSMaChucNang.includes(x));

            if (toAdd.length > 0) {
                await this.createPermissions(MaNhom, toAdd);
            }
            if (toDelete.length > 0) {
                await this.deletePermissions(MaNhom, toDelete);
            }
            return true;
        }
        catch (error) {
            console.log("Permission Service updatePermissions Error: ", error);
            return false;
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