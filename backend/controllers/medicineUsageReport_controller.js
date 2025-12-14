const Service = require('../services/medicineUsageReport_service');

exports.createReport = async (req, res) => {
    try {
        const { Thang, Nam } = req.body;

        if (!Thang || !Nam) {
            return res.status(400).json({
                message: "Thiếu tháng hoặc năm"
            });
        }

        const result = await Service.createReport({ Thang, Nam });

        if (result?.error === "EXISTED_REPORT") {
            return res.status(409).json({
                message: "Báo cáo tháng này đã tồn tại"
            });
        }

        if (result?.error === "NO_DATA") {
            return res.status(400).json({
                message: "Không có dữ liệu thuốc sử dụng trong tháng này"
            });
        }

        if (!result) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(201).json(result);
    }
    catch (error) {
        console.error("Error createReport:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateReport = async (req, res) => {
    try {
        const { MaBCSDT } = req.params;

        const result = await Service.updateReport(MaBCSDT);

        if (result?.error === "NOT_FOUND") {
            return res.status(404).json({
                message: "Không tìm thấy báo cáo"
            });
        }

        if (result?.error === "NO_DATA") {
            return res.status(409).json({
                message: "Không có dữ liệu mới để cập nhật báo cáo"
            });
        }

        if (result === null) {
            return res.status(500).json({ error: "Internal Server Error" });
        }


        return res.status(200).json({
            message: "Cập nhật báo cáo thành công"
        });
    }
    catch (error) {
        console.error("Error updateReport:", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};


exports.deleteReport = async (req, res) => {
    try {
        const { MaBCSDT } = req.params;

        const result = await Service.deleteReport(MaBCSDT);

        if (!result) {
            return res.status(404).json({
                message: "Không tìm thấy báo cáo"
            });
        }

        return res.status(200).json({
            message: "Xóa thành công"
        });
    }
    catch (error) {
        console.error("Error deleteReport:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
