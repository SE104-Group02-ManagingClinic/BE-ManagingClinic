const PermissionService = require('../services/permission_service');

// Tao moi phan quyen
exports.createPermission = async(req, res) => {
    try {
        const {
            MaNhom,
            DSMaChucNang
        } = req.body;
        
        const result = await PermissionService.createPermissions(MaNhom, DSMaChucNang);
        if (result === null) {
            res.status(500).json({error: 'Internal Server Error'});

        } else if (!result) {
            res.status(400).json({message: "Nhóm đã tạo phân quyền"});
        }
        res.status(201).json({message: "Tạo phân quyền cho nhóm người dùng thành công"});

        
    }
    catch (error) {
        console.error('Error createPermission: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// Xoa phan quyen
exports.deletePermission = async (req, res) => {
    try {
        const {MaNhom} = req.params;
        const {
            DSMaChucNang
        } = req.body;
        
        const result = await PermissionService.deletePermissions(MaNhom, DSMaChucNang);
        if (result) {
            res.status(200).json({message: "Xóa phân quyền thành công"});
        }
        else {
            res.status(400).json({message: "Nhóm đưa được tạo phân quyền"});
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

// Cập nhật danh sách phân quyền
exports.updatePermission = async (req, res) => {
    try {
        const {MaNhom} = req.params;
        const {DSMaChucNang} = req.body;
        const result = await PermissionService.updatePermissions(MaNhom, DSMaChucNang);
        if (result) {
            res.status(200).json({message: "Cập nhật danh sách phân quyền thành công"});
        }
        res.status(400).json({message: "Cập nhật không thành công"});
    }
    catch (error) {
        console.error('Error updatePermission: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}