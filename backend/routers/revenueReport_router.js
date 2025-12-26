// ===============================
//  LIÊN QUAN ĐẾN BÁO CÁO DOANH THU
// ===============================
const router = require('express').Router();
const revenueReportController = require('../controllers/revenueReport_controller');

/**
 * @swagger
 * tags:
 *   name: RevenueReport
 *   description: Các API liên quan tới BÁO CÁO DOANH THU
 */

/**
 * =====================================================
 *  TẠO BÁO CÁO DOANH THU THEO THÁNG / NĂM
 * =====================================================
 */
/**
 * @swagger
 * /revenueReport/createReport:
 *   post:
 *     summary: Tạo báo cáo doanh thu
 *     description: |
 *       API tạo báo cáo doanh thu cho một tháng – năm.
 *     tags:
 *       - RevenueReport
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
 *         description: Tạo báo cáo doanh thu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 MaBCDT: BCDT0001
 *                 Thang: 12
 *                 Nam: 2025
 *                 TongDoanhThu: 35000000
 *       409:
 *         description: Báo cáo tháng này đã tồn tại
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post(
    '/createReport',
    revenueReportController.createReport
);

/**
 * =====================================================
 *  LẤY DANH SÁCH BÁO CÁO DOANH THU
 * =====================================================
 */
/**
 * @swagger
 * /revenueReport/getReports:
 *   get:
 *     summary: Lấy danh sách báo cáo doanh thu
 *     tags:
 *       - RevenueReport
 *     responses:
 *       200:
 *         description: Lấy danh sách báo cáo thành công
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get(
    '/getReports',
    revenueReportController.getReports
);

/**
 * =====================================================
 *  XEM CHI TIẾT BÁO CÁO DOANH THU
 * =====================================================
 */
/**
 * @swagger
 * /revenueReport/getReportDetail/{MaBCDT}:
 *   get:
 *     summary: Xem chi tiết báo cáo doanh thu
 *     tags:
 *       - RevenueReport
 *     parameters:
 *       - in: path
 *         name: MaBCDT
 *         required: true
 *         schema:
 *           type: string
 *         example: BCDT0001
 *     responses:
 *       200:
 *         description: Lấy chi tiết báo cáo thành công
 *       404:
 *         description: Không tìm thấy báo cáo
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get(
    '/getReportDetail/:MaBCDT',
    revenueReportController.getReportDetail
);

/**
 * =====================================================
 *  TÌM KIẾM BÁO CÁO DOANH THU
 * =====================================================
 */
/**
 * @swagger
 * /revenueReport/search:
 *   get:
 *     summary: Tìm kiếm báo cáo doanh thu theo tháng/năm
 *     description: |
 *       Trả về danh sách báo cáo doanh thu (KHÔNG bao gồm chi tiết).
 *       Có thể tìm theo:
 *       - Tháng
 *       - Năm
 *       - Hoặc cả tháng và năm
 *     tags:
 *       - RevenueReport
 *     parameters:
 *       - in: query
 *         name: Thang
 *         schema:
 *           type: integer
 *         example: 12
 *       - in: query
 *         name: Nam
 *         schema:
 *           type: integer
 *         example: 2025
 *     responses:
 *       200:
 *         description: Danh sách báo cáo doanh thu
 *         content:
 *           application/json:
 *             example:
 *               - MaBCDT: BCDT0001
 *                 THANG: 12
 *                 NAM: 2025
 *                 TongDoanhThu: 35000000
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get(
    '/search',
    revenueReportController.searchReports
);


/**
 * =====================================================
 *  CẬP NHẬT (TÁI TỔNG HỢP) BÁO CÁO DOANH THU
 * =====================================================
 */
/**
 * @swagger
 * /revenueReport/updateReport/{MaBCDT}:
 *   put:
 *     summary: Cập nhật báo cáo doanh thu
 *     description: |
 *       API dùng khi dữ liệu hóa đơn trong tháng có thay đổi(tự động cập nhật, người dùng không chỉnh sửa số liệu thủ công).
 *     tags:
 *       - RevenueReport
 *     parameters:
 *       - in: path
 *         name: MaBCDT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã báo cáo doanh thu
 *         example: BCDT0001
 *     responses:
 *       200:
 *         description: Cập nhật báo cáo doanh thu thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Cập nhật báo cáo doanh thu thành công"
 *       404:
 *         description: Không tìm thấy báo cáo doanh thu
 *       409:
 *         description: Không có dữ liệu mới để cập nhật
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put(
    '/updateReport/:MaBCDT',
    revenueReportController.updateReport
);

/**
 * =====================================================
 *  XÓA BÁO CÁO DOANH THU
 * =====================================================
 */
/**
 * @swagger
 * /revenueReport/deleteReport/{MaBCDT}:
 *   delete:
 *     summary: Xóa báo cáo doanh thu
 *     description: |
 *       Xóa hoàn toàn một báo cáo doanh thu khỏi hệ thống.
 *     tags:
 *       - RevenueReport
 *     parameters:
 *       - in: path
 *         name: MaBCDT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã báo cáo doanh thu cần xóa
 *         example: BCDT0001
 *     responses:
 *       200:
 *         description: Xóa báo cáo doanh thu thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Xóa báo cáo doanh thu thành công"
 *       404:
 *         description: Không tìm thấy báo cáo doanh thu
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete(
    '/deleteReport/:MaBCDT',
    revenueReportController.deleteReport
);

module.exports = router;
