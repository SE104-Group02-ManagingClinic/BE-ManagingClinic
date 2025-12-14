const MedicineImportService = require('../services/medicineImport_service');

// Tạo phiếu nhập thuốc
exports.createMedicineImport = async (req, res) => {
    try {
        const {
            MaThuoc,
            GiaNhap,
            NgayNhap,
            SoLuongNhap
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

        const existedThuoc = await MedicineImportService.checkMaThuoc(MaThuoc);
        if (!existedThuoc) {
            return res.status(400).json({
                message: "Thuốc không tồn tại"
            });
        }

        const result = await MedicineImportService.createMedicineImport({
            MaThuoc,
            GiaNhap,
            NgayNhap,
            SoLuongNhap
        });

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
        const {
            MaThuoc,
            GiaNhap,
            NgayNhap,
            SoLuongNhap
        } = req.body;

        const result = await MedicineImportService.updateMedicineImport(
            MaPNT,
            {
                MaThuoc,
                GiaNhap,
                NgayNhap,
                SoLuongNhap
            }
        );

        if (result === null) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result === false) {
            return res.status(404).json({
                message: "Không tìm thấy phiếu nhập thuốc"
            });
        }

        return res.status(200).json({
            message: "Cập nhật thành công"
        });
    }
    catch (error) {
        console.error("Error updateMedicineImport:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Xóa phiếu nhập thuốc
exports.deleteMedicineImport = async (req, res) => {
    try {
        const { MaPNT } = req.params;

        const result = await MedicineImportService.deleteMedicineImport(MaPNT);

        if (result === null) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result === false) {
            return res.status(404).json({
                message: "Không tìm thấy phiếu nhập thuốc"
            });
        }

        return res.status(200).json({
            message: "Xóa thành công"
        });
    }
    catch (error) {
        console.error("Error deleteMedicineImpor:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
