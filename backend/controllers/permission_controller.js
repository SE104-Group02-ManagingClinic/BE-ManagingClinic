const PermissionService = require('../services/permission_service');

// Tao moi phan quyen
exports.createPermission = async(req, res) => {
    try {
        const {
            MaNhom,
            MaChucNang
        } = req.body;
        const existed = await PermissionService.existedPermission(MaNhom, MaChucNang);
        if (existed) {
            res.status(409).json({message: "Đã tồn tại phân quyền này"});
        }
        else {
            const result = await PermissionService.createPermission(MaNhom, MaChucNang);
            res.status(201).json({message: "Tạo phân quyền cho nhóm người dùng thành công"});
        }
    }
    catch (error) {
        console.error('Error createPermission: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// Xoa phan quyen
exports.deletePermission = async (req, res) => {
    try {
        const {
            MaNhom,
            MaChucNang
        } = req.body;
        const existed = await PermissionService.existedPermission(MaNhom, MaChucNang);
        if (existed) {
            const result = await PermissionService.deletePermission(MaNhom, MaChucNang);
            res.status(200).json({message: "Xóa phân quyền thành công"});
        }
        else {
            res.status(400).json({message: "Không tồn tại phân quyền này"});
        }
    }
    catch (error) {
        console.error('Error deletePermission: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// Lay danh sach cac chuc nang cua mot nhom nguoi dung
exports.getFunctionsOfGroupUser = async (req, res) => {
    try {
        const {MaNhom} = req.params;
        const result = await PermissionService.getFunctionsOfGroupUser(MaNhom);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error getFunctionsOfGroupUser: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}