const FunctionService = require('../services/function_service');

// Tao moi chuc nang
exports.createFunction = async (req, res) => {
    try {
        const {
            TenChucNang,
            TenThanhPhanDuocLoad
        } = req.body;
        // Kiem tra chuc nang da ton tai trong db hay chua
        const existed = await FunctionService.existedFunction(TenChucNang);
        if (existed) {
            res.status(409).json({message: "Tên chức năng đã tồn tại"});
        }
        const data = {
            TenChucNang,
            TenThanhPhanDuocLoad
        }
        const addFunction = await FunctionService.createFunction(data);
        if (addFunction === null) {
            res.status(500).json({error: 'Internal Server Error'});        
        }
        res.status(201).json({
            MaChucNang: addFunction.MaChucNang,
            TenChucNang: addFunction.TenChucNang,
            TenThanhPhanDuocLoad: addFunction.TenThanhPhanDuocLoad
        });
    }
    catch (error) {
        console.error('Error createFunction: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}
// Lay thong tin chuc nang theo MaChucNang
exports.getFunctionById = async (req, res) => {
    try {
        const {MaChucNang} = req.params;
        if (MaChucNang === null) {
            res.status(400).json({message: "Id function is empty."})
        }
        const rows = await FunctionService.getFunctionById(MaChucNang);
        if (rows === null) {
            res.status(500).json({error: 'Internal Server Error'});        
        }
        else if (rows.length === 0) {
            res.status(404).json({message: "Not found."});
        }
        else res.status(200).json(rows);
    }
    catch (error) {
        console.error('Error getFunctionById: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}
// Lay thong tin toan bo cac Chuc nang
exports.getAllFunctions = async (req, res) => {
    try {
        const rows = await FunctionService.getFunctionList();
        res.status(200).json(rows).end();
    }
    catch (error) {
        console.error('Error getAllFunctions: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Lay danh sach cac Chuc nang => tra ve danh sach id va ten chuc nang
exports.getFunctionNameList = async (req, res) => {
    try {
        const rows = await FunctionService.getFunctionNameList();
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Error getFunctionNameList: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Cap nhap chuc nang theo MaChucNang
exports.updateFunction = async (req, res) => {
    try {
        const {MaChucNang} = req.params;
        const {
            TenThanhPhanDuocLoad
        } = req.body;
        
        const result = await FunctionService.updateFunction(MaChucNang, TenThanhPhanDuocLoad);
        if (result === null) {
            return res.status(500).json({error: 'Internal Server Error'});        
        }
        if (result === false) {
            return res.status(400).json({message: "Thông tin không thay đổi"});
        }
        return res.status(200).json({success: "Cập nhật thành công"});
    }
    catch (error) {
        console.error('Error updateFunction: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Xoa chuc nang theo MaChucNang
exports.deleteFunction = async (req, res) => {
    try {
        const {MaChucNang} = req.params;
        if (MaChucNang !== "") {
            const result = await FunctionService.deleteFunction(MaChucNang);
            if (result === null) {
                return res.status(500).json({error: 'Internal Server Error'});
            }
            if (result === false) {
                return res.status(400).json({message: "Xóa không thành công do chức năng được phân quyền trong group"});
            }
            return res.status(200).json({success: "Xóa thành công"});
        }
    }
    catch (error) {
        console.error('Error deleteFunction: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}