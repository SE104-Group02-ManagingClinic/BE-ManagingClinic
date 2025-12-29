const UsageService = require('../services/usage_service');

// Tạo cách dùng mới
exports.createUsage = async (req, res) => {
    try {
        const {
            TenCachDung
        } = req.body;
        // Kiểm tra cách dùng đã tồn tại trong db hay chưa
        const existed = await UsageService.existedUsage(TenCachDung);
        if (existed) {
            return res.status(409).json({message: "Tên cách dùng đã tồn tại"});
        }
        const data = { TenCachDung }
        const addUsage = await UsageService.createUsage(data);

        if (!addUsage) {
            res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(201).json({
            MaCachDung: addUsage.MaCachDung,
            TenCachDung: addUsage.TenCachDung
        });
    } 
    catch (error) {
        console.error('Error createUsage:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Lấy danh sách tất cả cách dùng
exports.getUsage = async (req, res) => {
    try {
        const rows = await UsageService.getUsage();
        res.status(200).json(rows).end();
    } 
    catch (error) {
        console.error('Error getDSCachDung:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Cập nhật cách dùng
exports.updateUsage = async (req, res) => {
    try {
        const { MaCachDung } = req.params;
        const { TenCachDung } = req.body;
        const updateData = { TenCachDung }

        const result = await UsageService.updateUsage(MaCachDung, updateData);
        
        if (result === null) {
            return res.status(500).json({error: 'Internal Server Error'});        
        }
        if (result === false) {
            return res.status(404).json({ error: 'Không tìm thấy cách dùng để cập nhật' });
        }

        return res.status(200).json({ message: 'Cập nhật thành công' });
    } 
    catch (error) {
        console.error('Error updateUsage:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Xóa cách dùng
exports.deleteUsage = async (req, res) => {
    try {
        const { MaCachDung } = req.params;

        if (!MaCachDung) {
            return res.status(400).json({ error: 'Thiếu mã cách dùng cần xóa' });
        }

        const check = await UsageService.canDeleteUsage(MaCachDung);
        if (!check.ok) {
            // Trả về lỗi 409 (Conflict) nếu đang được sử dụng
            return res.status(409).json({ message: check.message });
        }

        const result = await UsageService.deleteUsage(MaCachDung);

        if (result === null) {
            return res.status(500).json({error: 'Internal Server Error'});
        }
        if (result === false) {
            return res.status(404).json({ error: 'Không tìm thấy cách dùng để xóa' });
        }
        return res.status(200).json({ message: 'Xóa thành công' });
    } 
    catch (error) {
        console.error('Error deleteUsage:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
