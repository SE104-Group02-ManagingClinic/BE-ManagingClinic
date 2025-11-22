const UsageService = require('../services/usage_service');

// Tạo cách dùng
exports.createUsage = async (req, res) => {
    try {
        const {
            ma_cach_dung,
            ten_cach_dung
        } = req.body;

        const data = { ma_cach_dung, ten_cach_dung };
        const record = await UsageService.createUsage(data);

        if (!record) {
            return res.status(400).json({ error: 'Không thể tạo cách dùng' });
        }

        res.status(201).json({
            MaCachDung: record.MaCachDung,
            TenCachDung: record.TenCachDung
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
        const records = await UsageService.getUsage();
        res.status(200).json(records);
    } 
    catch (error) {
        console.error('Error getUsage:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Cập nhật cách dùng
exports.updateUsage = async (req, res) => {
    try {
        const { ma_cach_dung, ten_cach_dung } = req.body;

        if (!ma_cach_dung || !ten_cach_dung) {
            return res.status(400).json({ error: 'Thiếu dữ liệu cập nhật' });
        }

        const updated = await UsageService.updateUsage({ ma_cach_dung, ten_cach_dung });

        if (!updated) {
            return res.status(404).json({ error: 'Không tìm thấy cách dùng để cập nhật' });
        }

        res.status(200).json({ message: 'Cập nhật thành công' });
    } 
    catch (error) {
        console.error('Error updateUsage:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Xóa cách dùng
exports.deleteUsage = async (req, res) => {
    try {
        const { ma_cach_dung } = req.params;

        if (!ma_cach_dung) {
            return res.status(400).json({ error: 'Thiếu mã cách dùng cần xóa' });
        }

        const deleted = await UsageService.deleteUsage(ma_cach_dung);

        if (!deleted) {
            return res.status(404).json({ error: 'Không tìm thấy cách dùng để xóa' });
        }

        res.status(200).json({ message: 'Xóa thành công' });
    } 
    catch (error) {
        console.error('Error deleteUsage:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
