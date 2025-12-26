const MedicineService = require('../services/medicine_service');

exports.createMedicine = async (req, res) => {
    try {
        const { TenThuoc, SoLo, HanSuDung, MaDVT, MaCachDung } = req.body;

        if (!TenThuoc || !SoLo || !HanSuDung || !MaDVT || !MaCachDung) {
            return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
        }

        const existed = await MedicineService.existedMedicine(TenThuoc, SoLo);
        if (existed) {
            return res.status(409).json({ message: "Thuốc với số lô này đã tồn tại" });
        }

        const fk = await MedicineService.checkForeignKey(MaDVT, MaCachDung);
        if (!fk.ok) {
            return res.status(fk.code).json({ message: fk.message });
        }

        const result = await MedicineService.createMedicine(req.body);
        if (!result) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(201).json(result);
    }
    catch (error) {
        console.error("createMedicine Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getMedicine = async (req, res) => {
    const rows = await MedicineService.getMedicine();
    if (!rows) return res.status(500).json({ error: "Internal Server Error" });
    return res.status(200).json(rows);
};

exports.searchMedicine = async (req, res) => {
    const rows = await MedicineService.searchMedicine(req.query);
    if (rows === null) return res.status(500).json({ error: "Internal Server Error" });
    return res.status(200).json(rows);
};

exports.updateMedicine = async (req, res) => {
    const { MaThuoc, SoLo } = req.params;

    const fk = await MedicineService.checkForeignKey(
        req.body.MaDVT,
        req.body.MaCachDung
    );
    if (!fk.ok) {
        return res.status(fk.code).json({ message: fk.message });
    }

    const result = await MedicineService.updateMedicine(MaThuoc, SoLo, req.body);
    if (result === null) return res.status(500).json({ error: "Internal Server Error" });
    if (!result) return res.status(404).json({ message: "Không tìm thấy thuốc" });

    return res.status(200).json({ message: "Cập nhật thành công" });
};

exports.deleteMedicine = async (req, res) => {
    const { MaThuoc, SoLo } = req.params;

    const check = await MedicineService.canDeleteMedicine(MaThuoc, SoLo);
    if (!check.ok) {
        return res.status(400).json({ message: check.message });
    }

    const result = await MedicineService.deleteMedicine(MaThuoc, SoLo);
    if (result === null) return res.status(500).json({ error: "Internal Server Error" });
    if (!result) return res.status(404).json({ message: "Không tìm thấy thuốc" });

    return res.status(200).json({ message: "Xóa thành công" });
};
