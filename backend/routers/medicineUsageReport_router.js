const router = require('express').Router();
const controller = require('../controllers/medicineUsageReport_controller');

/**
 * @swagger
 * tags:
 *   name: MedicineUsageReport
 *   description: API quản lý báo cáo sử dụng thuốc
 */

/**
 * @swagger
 * /medicineUsageReport/createReport:
 *   post:
 *     summary: Tạo báo cáo sử dụng thuốc theo tháng/năm
 *     description: API dùng để tạo báo cáo sử dụng thuốc theo tháng và năm. Hệ thống sẽ kiểm tra không cho phép lập báo cáo cho thời gian trong tương lai và không cho phép trùng báo cáo đã tồn tại.
 *     tags:
 *       - MedicineUsageReport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *         description: Tạo báo cáo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaBCSDT:
 *                   type: string
 *                   example: "BCSDT001"
 *                 Thang:
 *                   type: integer
 *                   example: 12
 *                 Nam:
 *                   type: integer
 *                   example: 2025
 *       400:
 *         description: Thiếu dữ liệu hoặc thời gian không hợp lệ (tương lai)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không được lập báo cáo cho tháng/năm trong tương lai"
 *       409:
 *         description: Báo cáo tháng/năm này đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Báo cáo tháng này đã tồn tại"
 *       500:
 *         description: Lỗi hệ thống khi tạo báo cáo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
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

/**
 * @swagger
 * /medicineUsageReport/getReportDetail/{MaBCSDT}:
 *   get:
 *     summary: Lấy chi tiết báo cáo sử dụng thuốc
 *     description: API dùng để lấy thông tin chi tiết của báo cáo sử dụng thuốc theo mã báo cáo (MaBCSDT).
 *     tags:
 *       - MedicineUsageReport
 *     parameters:
 *       - in: path
 *         name: MaBCSDT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã báo cáo sử dụng thuốc
 *         example: "BCSDT001"
 *     responses:
 *       200:
 *         description: Thành công - trả về thông tin báo cáo và chi tiết sử dụng thuốc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaBCSDT:
 *                   type: string
 *                   example: "BCSDT001"
 *                 Thang:
 *                   type: integer
 *                   example: 12
 *                 Nam:
 *                   type: integer
 *                   example: 2025
 *                 ChiTiet:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MaThuoc:
 *                         type: string
 *                         example: "LT001"
 *                       TenThuoc:
 *                         type: string
 *                         example: "Paracetamol"
 *                       SoLanDung:
 *                         type: integer
 *                         example: 5
 *                       SoLuongDung:
 *                         type: integer
 *                         example: 20
 *       404:
 *         description: Không tìm thấy báo cáo theo mã đã cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy báo cáo"
 *       500:
 *         description: Lỗi hệ thống khi lấy chi tiết báo cáo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
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
