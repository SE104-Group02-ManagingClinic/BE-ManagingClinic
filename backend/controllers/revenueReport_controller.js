const Service = require('../services/revenueReport_service');

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
                message: "Báo cáo doanh thu tháng này đã tồn tại"
            });
        }

        if (result?.error === "NO_DATA") {
            return res.status(400).json({
                message: "Không có dữ liệu hóa đơn trong tháng này"
            });
        }

        if (result === null) {
            return res.status(500).json({
                error: "Internal Server Error"
            });
        }

        return res.status(201).json(result);
    }
    catch (error) {
        console.error("Error createRevenueReport:", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

exports.getReports = async (req, res) => {
    try {
        const rows = await Service.getReports();

        if (!rows) {
            return res.status(500).json({
                error: "Internal Server Error"
            });
        }

        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error getRevenueReports:", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

exports.getReportDetail = async (req, res) => {
    try {
        const { MaBCDT } = req.params;

        const result = await Service.getReportDetail(MaBCDT);

        if (result?.error === "NOT_FOUND") {
            return res.status(404).json({
                message: "Không tìm thấy báo cáo doanh thu"
            });
        }

        if (!result) {
            return res.status(500).json({
                error: "Internal Server Error"
            });
        }

        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Error getRevenueReportDetail:", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

exports.updateReport = async (req, res) => {
    try {
        const { MaBCDT } = req.params;

        const result = await Service.updateReport(MaBCDT);

        if (result?.error === "NOT_FOUND") {
            return res.status(404).json({
                message: "Không tìm thấy báo cáo doanh thu"
            });
        }

        if (result?.error === "NO_DATA") {
            return res.status(409).json({
                message: "Không có dữ liệu mới để cập nhật báo cáo"
            });
        }

        if (result === null) {
            return res.status(500).json({
                error: "Internal Server Error"
            });
        }

        return res.status(200).json({
            message: "Cập nhật báo cáo doanh thu thành công"
        });
    }
    catch (error) {
        console.error("Error updateRevenueReport:", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const { MaBCDT } = req.params;

        const result = await Service.deleteReport(MaBCDT);

        if (result?.error === "NOT_FOUND") {
            return res.status(404).json({
                message: "Không tìm thấy báo cáo doanh thu"
            });
        }

        if (result === null) {
            return res.status(500).json({
                error: "Internal Server Error"
            });
        }

        return res.status(200).json({
            message: "Xóa báo cáo doanh thu thành công"
        });
    }
    catch (error) {
        console.error("Error deleteRevenueReport:", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};
