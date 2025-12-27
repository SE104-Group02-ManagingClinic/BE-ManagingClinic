const MedicineImportService = require('../services/medicineImport_service');

// Tạo phiếu nhập thuốc
exports.createMedicineImport = async (req, res) => {
    try {
        const {
            MaThuoc,
            GiaNhap,
            NgayNhap,
            SoLuongNhap,
            HanSuDung
        } = req.body;

        if (!MaThuoc || !NgayNhap) {
            return res.status(400).json({
                message: "Thiếu dữ liệu bắt buộc"
            });
        }

        if (GiaNhap < 0 || SoLuongNhap <= 0) {
            return res.status(400).json({
                message: "Giá nhập và số lượng phải hợp lệ"
            });
        }

        const result = await MedicineImportService.createMedicineImport({
            MaThuoc,
            GiaNhap,
            NgayNhap,
            SoLuongNhap,
            HanSuDung
        });

        if (result.error === "MEDICINE_NOT_FOUND") {
            return res.status(400).json({
                message: "Thuốc không tồn tại"
            });
        }

        if (result.error === "NO_THAMSO") {
            return res.status(409).json({
                message: "Chưa cấu hình tỷ lệ tính đơn giá bán"
            });
        }

        if (!result) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(201).json(result);
    }
    catch (error) {
        console.error("Error createMedicineImport:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Lấy danh sách phiếu nhập thuốc
exports.getMedicineImport = async (req, res) => {
    try {
        const rows = await MedicineImportService.getMedicineImport();
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error getMedicineImport:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Cập nhật phiếu nhập thuốc
exports.updateMedicineImport = async (req, res) => {
    try {
        const { MaPNT } = req.params;
        const { GiaNhap, NgayNhap, SoLuongNhap, HanSuDung } = req.body;

        // Validate input cơ bản
        if (GiaNhap < 0 || SoLuongNhap <= 0) {
            return res.status(400).json({
                message: "Giá nhập hoặc số lượng không hợp lệ"
            });
        }

        const result = await MedicineImportService.updateMedicineImport(MaPNT, {
            GiaNhap,
            NgayNhap,
            SoLuongNhap,
            HanSuDung
        });

        // Không tìm thấy phiếu nhập
        if (result?.error === "PNT_NOT_FOUND") {
            return res.status(404).json({
                message: "Không tìm thấy phiếu nhập thuốc"
            });
        }

        // Lô đã được kê đơn
        if (result?.error === "LOT_ALREADY_USED") {
            return res.status(409).json({
                message: "Không thể cập nhật vì lô thuốc đã được kê đơn"
            });
        }

        // Làm âm tồn kho
        if (result?.error === "INVALID_STOCK") {
            return res.status(400).json({
                message: "Cập nhật làm tồn kho thuốc bị âm"
            });
        }

        // Lỗi cập nhật
        if (result?.error === "UPDATE_FAILED") {
            return res.status(500).json({
                message: "Cập nhật thất bại"
            });
        }

        // Lỗi hệ thống
        if (result?.error === "SYSTEM_ERROR") {
            return res.status(500).json({
                message: "Lỗi hệ thống"
            });
        }

        // Thành công
        return res.status(200).json({
            message: "Cập nhật phiếu nhập thành công"
        });
    }
    catch (error) {
        console.error("Error updateMedicineImport:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// Xóa phiếu nhập thuốc
exports.deleteMedicineImport = async (req, res) => {
    try {
        const { MaPNT } = req.params;

        const result = await MedicineImportService.deleteMedicineImport(MaPNT);

        // Không tìm thấy phiếu nhập
        if (result?.error === "PNT_NOT_FOUND") {
            return res.status(404).json({
                message: "Không tìm thấy phiếu nhập thuốc"
            });
        }

        // Lô đã được kê đơn
        if (result?.error === "LOT_ALREADY_USED") {
            return res.status(409).json({
                message: "Không thể xóa phiếu nhập vì lô thuốc đã được kê đơn"
            });
        }

        // Lỗi xóa
        if (result?.error === "DELETE_FAILED") {
            return res.status(500).json({
                message: "Xóa phiếu nhập thất bại"
            });
        }

        // Lỗi hệ thống
        if (result?.error === "SYSTEM_ERROR") {
            return res.status(500).json({
                message: "Lỗi hệ thống"
            });
        }

        // Thành công
        return res.status(200).json({
            message: "Xóa phiếu nhập thuốc thành công"
        });
    }
    catch (error) {
        console.error("Error deleteMedicineImport:", error);
        return res.status(500).json({
            message: "Lỗi hệ thống"
        });
    }
};

