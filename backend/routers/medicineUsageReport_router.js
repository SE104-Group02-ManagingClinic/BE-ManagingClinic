const router = require('express').Router();
const controller = require('../controllers/medicineUsageReport_controller');

/**
 * @swagger
 * tags:
 *   name: MedicineUsageReport
 *   description: API quản lý báo cáo sử dụng thuốc
 */

/* =====================================================
   TẠO BÁO CÁO SỬ DỤNG THUỐC
   ===================================================== */
/**
 * @swagger
 * /medicineUsageReport/createReport:
 *   post:
 *     summary: Tạo báo cáo sử dụng thuốc theo tháng/năm
 *     description: |
 *       API này sẽ tạo mới một báo cáo sử dụng thuốc
 *       Tự động tổng hợp dữ liệu từ CT_THUOC + PHIEUKHAMBENH
 *     tags:
 *       - MedicineUsageReport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Thang
 *               - Nam
 *             properties:
 *               Thang:
 *                 type: integer
 *                 description: Tháng cần lập báo cáo
 *                 example: 12
 *               Nam:
 *                 type: integer
 *                 description: Năm cần lập báo cáo
 *                 example: 2025
 *     responses:
 *       201:
 *         description: Tạo báo cáo sử dụng thuốc thành công
 *         content:
 *           application/json:
 *             example:
 *               MaBCSDT: BCSDT001
 *               Thang: 12
 *               Nam: 2025
 *       400:
 *         description: Thiếu tháng hoặc năm
 *       409:
 *         description: Báo cáo tháng này đã tồn tại
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post(
    '/createReport',
    controller.createReport
);

/* =====================================================
   LẤY DANH SÁCH BÁO CÁO SỬ DỤNG THUỐC
   ===================================================== */
/**
 * @swagger
 * /medicineUsageReport/getReports:
 *   get:
 *     summary: Lấy danh sách các báo cáo sử dụng thuốc
 *     description: Trả về danh sách các báo cáo (theo tháng/năm)
 *     tags:
 *       - MedicineUsageReport
 *     responses:
 *       200:
 *         description: Lấy danh sách báo cáo thành công
 *         content:
 *           application/json:
 *             example:
 *               - MaBCSDT: BCSDT001
 *                 Thang: 12
 *                 Nam: 2025
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get(
    '/getReports',
    controller.getReports
);

/* =====================================================
   XEM CHI TIẾT BÁO CÁO SỬ DỤNG THUỐC
   ===================================================== */
/**
 * @swagger
 * /medicineUsageReport/getReportDetail/{MaBCSDT}:
 *   get:
 *     summary: Xem chi tiết báo cáo sử dụng thuốc
 *     description: |
 *       Trả về chi tiết báo cáo (CT_BCSDT).
 *       Dữ liệu được tổng hợp tự động, không nhập tay.
 *     tags:
 *       - MedicineUsageReport
 *     parameters:
 *       - in: path
 *         name: MaBCSDT
 *         required: true
 *         schema:
 *           type: string
 *         example: BCSDT001
 *     responses:
 *       200:
 *         description: Lấy chi tiết báo cáo thành công
 *       404:
 *         description: Không tìm thấy báo cáo
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get(
    '/getReportDetail/:MaBCSDT',
    controller.getReportDetail
);

/* =====================================================
   TÌM KIẾM BÁO CÁO SỬ DỤNG THUỐC
   ===================================================== */
/**
 * @swagger
 * /medicineUsageReport/searchReports:
 *   get:
 *     summary: Tìm kiếm báo cáo sử dụng thuốc theo tháng / năm
 *     description: Không trả chi tiết (CT_BCSDT).
 *     tags:
 *       - MedicineUsageReport
 *     parameters:
 *       - in: query
 *         name: Thang
 *         schema:
 *           type: integer
 *         description: Tháng cần tìm
 *         example: 12
 *       - in: query
 *         name: Nam
 *         schema:
 *           type: integer
 *         description: Năm cần tìm
 *         example: 2025
 *     responses:
 *       200:
 *         description: Danh sách báo cáo phù hợp
 *         content:
 *           application/json:
 *             example:
 *               - MaBCSDT: BCSDT001
 *                 Thang: 12
 *                 Nam: 2025
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get(
    '/searchReports',
    controller.searchReports
);

/* =====================================================
   CẬP NHẬT (TÁI TỔNG HỢP) BÁO CÁO
   ===================================================== */
/**
 * @swagger
 * /medicineUsageReport/updateReport/{MaBCSDT}:
 *   put:
 *     summary: Cập nhật (tái tổng hợp) báo cáo sử dụng thuốc
 *     description: API này sẽ cập nhật tự động
 *     tags:
 *       - MedicineUsageReport
 *     parameters:
 *       - in: path
 *         name: MaBCSDT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã báo cáo sử dụng thuốc
 *         example: BCSDT001
 *     responses:
 *       200:
 *         description: Cập nhật báo cáo thành công
 *         content:
 *           application/json:
 *             example:
 *               message: Cập nhật báo cáo thành công
 *       404:
 *         description: Không tìm thấy báo cáo
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put(
    '/updateReport/:MaBCSDT',
    controller.updateReport
);

/* =====================================================
   XÓA BÁO CÁO SỬ DỤNG THUỐC
   ===================================================== */
/**
 * @swagger
 * /medicineUsageReport/deleteReport/{MaBCSDT}:
 *   delete:
 *     summary: Xóa báo cáo sử dụng thuốc
 *     description: |
 *       API này sẽ xóa báo cáo sử dụng thuốc
 *     tags:
 *       - MedicineUsageReport
 *     parameters:
 *       - in: path
 *         name: MaBCSDT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã báo cáo sử dụng thuốc cần xóa
 *         example: BCSDT001
 *     responses:
 *       200:
 *         description: Xóa báo cáo thành công
 *         content:
 *           application/json:
 *             example:
 *               message: Xóa thành công
 *       404:
 *         description: Không tìm thấy báo cáo
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete(
    '/deleteReport/:MaBCSDT',
    controller.deleteReport
);

module.exports = router;
