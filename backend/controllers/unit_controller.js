const UnitService = require('../services/unit_service');

// Tạo đơn vị tính mới
exports.createUnit = async (req, res) => {
    try {
        const { TenDVT } = req.body;

        // Kiểm tra đơn vị tính đã tồn tại chưa
        const existed = await UnitService.existedUnit(TenDVT);
        if (existed) {
            return res.status(409).json({ message: "Tên đơn vị tính đã tồn tại" });
        }

        const data = { TenDVT };
        const addUnit = await UnitService.createUnit(data);

        if (!addUnit) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(201).json({
            MaDVT: addUnit.MaDVT,
            TenDVT: addUnit.TenDVT
        });
    } 
    catch (error) {
        console.error('Error createUnit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Lấy danh sách tất cả đơn vị tính
exports.getUnit = async (req, res) => {
    try {
        const rows = await UnitService.getUnit();
        res.status(200).json(rows).end();
    }
    catch (error) {
        console.error('Error getDSUnit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Cập nhật đơn vị tính
exports.updateUnit = async (req, res) => {
    try {
        const { MaDVT } = req.params;
        const { TenDVT } = req.body;

        const updateData = { TenDVT };

        const result = await UnitService.updateUnit(MaDVT, updateData);

        if (result === null) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result === false) {
            return res.status(404).json({ error: 'Không tìm thấy đơn vị tính để cập nhật' });
        }

        return res.status(200).json({ message: 'Cập nhật thành công' });
    }
    catch (error) {
        console.error('Error updateUnit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Xóa đơn vị tính
exports.deleteUnit = async (req, res) => {
    try {
        const { MaDVT } = req.params;

        if (!MaDVT) {
            return res.status(400).json({ error: 'Thiếu mã đơn vị tính cần xóa' });
        }

        const check = await UnitService.canDeleteUnit(MaDVT);
        if (!check.ok) {
            return res.status(400).json({
                message: check.message
            });
        }

        const result = await UnitService.deleteUnit(MaDVT);

        if (result === null) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result === false) {
            return res.status(404).json({ error: 'Không tìm thấy đơn vị tính để xóa' });
        }

        return res.status(200).json({ message: 'Xóa thành công' });
    }
    catch (error) {
        console.error('Error deleteUnit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
