const GroupUserService = require('../services/groupuser_service');

// Tao moi nhom nguoi dung
exports.createGroupUser = async (req, res) => {
    try {
        const {
            TenNhom
        } = req.body;
        // Kiem tra ten nhom da ton tai trong db hay chua
        const existed = await GroupUserService.existedGroupUser(TenNhom);
        if (existed) {
            res.status(409).json({message: "Tên nhóm người dùng đã tồn tại"});
        }
        const data = {
            TenNhom
        }
        const addGroupUser = await GroupUserService.createGroupUser(data);
        if (addGroupUser === null) {
            res.status(500).json({error: 'Internal Server Error'});        
        }
        res.status(201).json({
            MaNhom: addGroupUser.MaNhom,
            TenNhom: addGroupUser.TenNhom
        });
    }
    catch (error) {
        console.error('Error createGroupUser: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// Lay thong tin nhom nguoi dung theo MaNhom
exports.getGroupUserById = async (req, res) => {
    try {
        const {MaNhom} = req.params;
        if (MaNhom === null) {
            res.status(400).json({message: "Id is empty."})
        }
        const rows = await GroupUserService.getGroupUserById(MaNhom);
        if (rows === null) {
            res.status(500).json({error: 'Internal Server Error'});        
        }
        else if (rows.length === 0) {
            res.status(404).json({message: "Not found."});
        }
        else res.status(200).json(rows);
    }
    catch (error) {
        console.error('Error getGroupUserById: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Lay thong tin toan bo cac Nhom nguoi dung
exports.getAllGroupUsers = async (req, res) => {
    try {
        const rows = await GroupUserService.getGroupUserList();
        res.status(200).json(rows).end();
    }
    catch (error) {
        console.error('Error getAllGroupUsers: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Cap nhap nhom nguoi dung theo MaNhom
exports.updateGroupUser = async (req, res) => {
    try {
        const {MaNhom} = req.params;
        const {
            TenNhom
        } = req.body;
        const updateData = {
            TenNhom
        } 
        const result = await GroupUserService.updateGroupUser(MaNhom, updateData)
        if (result === null) {
            return res.status(500).json({error: 'Internal Server Error'});        
        }
        if (result === false) {
            return res.status(400).json({message: "Thông tin không thay đổi"});
        }
        return res.status(200).json({success: "Cập nhật thành công"});
    }
    catch (error) {
        console.error('Error updateGroupUser: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Xoa nhom nguoi dung theo MaNhom
exports.deleteGroupUser = async (req, res) => {
    try {
        const {MaNhom} = req.params;
        if (MaNhom !== "") {
            const result = await GroupUserService.deleteGroupUser(MaNhom);
            if (result === null) {
                return res.status(500).json({error: 'Internal Server Error'});
            }
            if (result === false) {
                return res.status(400).json({message: "Xóa không thành công"});
            }
            return res.status(200).json({success: "Xóa thành công"});
        }
    }
    catch (error) {
        console.error('Error deleteGroupUser: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}