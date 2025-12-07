const UserService = require('../services/user_service');
const GroupUserService = require('../services/groupuser_service');

// Tao tai khoan nguoi dung
exports.createAccount = async (req, res) => {
    try {
        const {
            TenDangNhap,
            MatKhau,
            MaNhom
        } = req.body;
        // Kiem tra ten dang nhap da ton tai trong db hay chua
        const existed = await UserService.existedUser(TenDangNhap);
        if (existed) {
            res.status(409).json({message: "Tên đăng nhập đã tồn tại"});
        }
        else {
            const data = {
                TenDangNhap,
                MatKhau,
                MaNhom
            }
            const addUser = await UserService.createUser(data);
            if (addUser === null) {
                res.status(500).json({error: 'Internal Server Error'});        
            }
            res.status(201).json({
                message: "Tạo tài khoản người dùng thành công"
            });
        }
    }
    catch (error) {
        console.error('Error createUser: ', error);
        res.status(500).json({error: 'Internal Server Error'}); 
    }
}
// Dang nhap
exports.login = async(req, res) => {
    try {
        const {
            TenDangNhap,
            MatKhau
        } = req.body;
        const result = await UserService.login({TenDangNhap, MatKhau});
        if (result !== null) {
            const group = await GroupUserService.getGroupUserById(result.MaNhom);
            res.status(200).json({
                TenDangNhap: result.TenDangNhap,
                MaNhom: result.MaNhom,
                TenNhom: group[0].TenNhom
            });
        }
        else {
            res.status(404).json({message: "Tài khoản đăng nhập không đúng"});
        }
    }
    catch (error) {
        console.error('Error login: ', error);
        res.status(500).json({error: 'Internal Server Error'}); 
    }
}

// Doi mat khau
exports.updatePassword = async (req, res) => {
    try {
        const {TenDangNhap} = req.params;
        const {
            MatKhauMoi
        } = req.body;
        const result = await UserService.updatePassword({TenDangNhap, MatKhauMoi});
        if (result) {
            res.status(200).json({message: "Cập nhật thành công"});
        }
        else {
            res.status(400).json({message: "Tài khoản không tồn tại"});
        }
    }
    catch (error) {
        console.error('Error updatePassword: ', error);
        res.status(500).json({error: 'Internal Server Error'}); 
    }
}

// Doi nhom nguoi dung
exports.updateGroup = async(req, res) => {
    try {
        const {TenDangNhap} = req.params;
        const {
            MaNhomMoi
        } = req.body;
        const result = await UserService.updateGroup({TenDangNhap, MaNhomMoi});
        if (result) {
            res.status(200).json({message: "Cập nhật thành công"});
        }
        else {
            res.status(400).json({message: "Tài khoản không tồn tại"});
        }
    }
    catch (error) {
        console.error('Error updatePassword: ', error);
        res.status(500).json({error: 'Internal Server Error'}); 
    }
}

// Xoa nguoi dung
exports.deleteUser = async (req, res) => {
    try {
        const {TenDangNhap} = req.params;
        if (TenDangNhap !== "") {
            const result = await UserService.deleteUser(TenDangNhap);
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
        console.error('Error deleteUser: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}
