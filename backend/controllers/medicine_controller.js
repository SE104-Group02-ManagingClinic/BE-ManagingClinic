// const medicineModel = require('../models/medicine_model');
const MedicineService = require('../services/medicine_service');

// Tạo thuốc mới
exports.createMedicine = async (req, res) => {
    try {
        const {
            TenThuoc,
            CongDung,
            MaCachDung,
            MaDVT,
            TacDungPhu,
        } = req.body;

        
        // Kiểm tra tên thuốc trùng
        const existed = await MedicineService.existedMedicine(TenThuoc);
        if (existed) {
            return res.status(409).json({ message: "Tên thuốc đã tồn tại" });
        }

        const checkFK = await MedicineService.checkForeignKey(MaDVT, MaCachDung);
        if (!checkFK.ok) {
            return res.status(checkFK.code).json({
                message: checkFK.message
            });
        }

        const result = await MedicineService.createMedicine(req.body);
        if (!result) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(201).json(result);
    }
    catch (error) {
        console.error("Error createMedicine:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Lấy danh sách thuốc
exports.getMedicine = async (req, res) => {
    try {
        const rows = await MedicineService.getMedicine();
        res.status(200).json(rows).end();
    }
    catch (error) {
        console.error("Error getMedicine:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Tìm kiếm thuốc theo tiêu chuẩn: TenThuoc, TenDVT
exports.searchMedicine = async (req, res) => {
    try {
        const { TenThuoc, CongDung } = req.query;

        const filters = {
            TenThuoc: TenThuoc || undefined,
            CongDung: CongDung || undefined
        };

        const rows = await MedicineService.searchMedicine(filters);
        if (rows === null) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error searchMedicine:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Cập nhật thuốc
exports.updateMedicine = async (req, res) => {
    try {
        const { MaThuoc } = req.params;
        const {
            CongDung,
            MaCachDung,
            MaDVT,
            TacDungPhu
        } = req.body;

        // Kiểm tra khóa ngoại
        const checkFK = await MedicineService.checkForeignKey(MaDVT, MaCachDung);
        if (!checkFK.ok) {
            return res.status(checkFK.code).json({
                message: checkFK.message
            });     
        }

        const result = await MedicineService.updateMedicine(
            MaThuoc,
            {
                CongDung,
                MaCachDung,
                MaDVT,
                TacDungPhu
            }
        );

        if (result === null) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result === false) {
            return res.status(404).json({ error: "Không tìm thấy thuốc để cập nhật" });
        }

        return res.status(200).json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error("Error updateMedicine:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Xóa thuốc
exports.deleteMedicine = async (req, res) => {
    try {
        const { MaThuoc } = req.params;

        if (!MaThuoc) {
            return res.status(400).json({
                message: "Thiếu mã thuốc cần xóa"
            });
        }

        // KIỂM TRA THUỐC ĐÃ ĐƯỢC DÙNG CHƯA
        const check = await MedicineService.canDeleteMedicine(MaThuoc);
        if (!check.ok) {
            return res.status(400).json({
                message: check.message
            });
        }

        // THỰC HIỆN XÓA
        const result = await MedicineService.deleteMedicine(MaThuoc);

        if (result === null) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result === false) {
            return res.status(404).json({
                error: "Không tìm thấy thuốc để xóa"
            });
        }

        return res.status(200).json({
            message: "Xóa thành công"
        });
    }
    catch (error) {
        console.error("Error deleteMedicine:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
