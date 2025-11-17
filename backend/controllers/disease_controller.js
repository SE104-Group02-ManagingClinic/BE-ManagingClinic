const DiseaseService = require('../services/disease_service');

// Tạo bệnh mới
exports.createBenh = async (req, res) => {
    try {
        const {
            TenBenh,
            TrieuChung,
            NguyenNhan,
            BienPhapChanDoan,
            CachDieuTri
        } = req.body;
        // Kiểm tra bệnh đã tồn tại trong db hay chưa
        const existed = await DiseaseService.existedBenh(TenBenh);
        if (existed) {
            res.status(409).json({message: "Tên bệnh đã tồn tại"});
        }
        const data = {
            TenBenh,
            TrieuChung,
            NguyenNhan,
            BienPhapChanDoan,
            CachDieuTri
        }
        const addBenh = await DiseaseService.createBenh(data);
        if (addBenh === null) {
            res.status(500).json({error: 'Internal Server Error'});        
        }
        res.status(201).json({
            MaBenh: addBenh.MaBenh,
            TenBenh: addBenh.TenBenh,
            TrieuChung: addBenh.TrieuChung,
            NguyenNhan: addBenh.NguyenNhan,
            BienPhapChanDoan: addBenh.BienPhapChanDoan,
            CachDieuTri: addBenh.CachDieuTri
        });
    }
    catch (error) {
        console.error('Error createBenh: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Lấy thông tin toàn bộ danh sách bệnh
exports.getDSBenh = async (req, res) => {
    try {
        const rows = await DiseaseService.getDSBenh();
        res.status(200).json(rows).end();
    }
    catch (error) {
        console.error('Error getDSBenh: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Lấy danh sách các bệnh => tra ve danh sach id va ten benh
exports.getDSTenBenh = async (req, res) => {
    try {
        const rows = await DiseaseService.getDSTenBenh();
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Error getDSTenBenh: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Tim kiem thong tin benh theo ten benh
exports.searchBenh = async (req, res) => {
    try {
        const {ten_benh} = req.params;
        if (ten_benh === null) {
            res.status(400).json({message: "Name disease is empty."})
        }
        const rows = await DiseaseService.searchBenh(ten_benh);
        if (rows === null) {
            res.status(500).json({error: 'Internal Server Error'});        
        }
        else if (rows.length === 0) {
            res.status(404).json({message: "Not found."});
        }
        else res.status(200).json(rows);
    }
    catch (error) {
        console.error('Error getBenh: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Sửa thông tin bệnh theo MaBenh
exports.updateBenh = async (req, res) => {
    try {
        const {MaBenh} = req.params;
        const {
            TrieuChung,
            NguyenNhan,
            BienPhapChanDoan,
            CachDieuTri
        } = req.body;
        const updateData = {
            TrieuChung,
            NguyenNhan,
            BienPhapChanDoan,
            CachDieuTri
        } 
        const result = await DiseaseService.updateBenh(MaBenh, updateData);
        if (result === null) {
            return res.status(500).json({error: 'Internal Server Error'});        
        }
        if (result === false) {
            return res.status(400).json({message: "Thông tin không thay đổi"});
        }
        return res.status(200).json({success: "Cập nhật thành công"});
    }
    catch (error) {
        console.error('Error updateBenh: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Xóa bệnh
exports.deleteBenh = async (req, res) => {
    try {
        const {MaBenh} = req.params;
        if (MaBenh !== "") {
            const result = await DiseaseService.deleteBenh(MaBenh);
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
        console.error('Error deleteBenh: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}