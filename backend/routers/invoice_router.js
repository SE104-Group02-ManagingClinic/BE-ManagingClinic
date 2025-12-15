const router = require('express').Router();
const invoiceController = require('../controllers/invoice_controller');

/**
 * @swagger
 * tags:
 *   name: Invoice
 *   description: Các API liên quan đến Hóa đơn thanh toán.
 */

/**
 * @swagger
 * /invoice/createInvoice:
 *   post:
 *     summary: Tạo hóa đơn thanh toán mới
 *     description: API dùng để tạo hóa đơn thanh toán cho phiếu khám bệnh. Mỗi phiếu khám bệnh chỉ có một hóa đơn thanh toán duy nhất.
 *     tags:
 *       - Invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MaPKB:
 *                 type: string
 *                 example: "PKB00001"
 *               NgayThanhToan:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-15"
 *               TienKham:
 *                 type: integer
 *                 example: 100000
 *               TienThuoc:
 *                 type: integer
 *                 example: 200000
 *     responses:
 *       201:
 *         description: Tạo hóa đơn thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo thành công hóa đơn thanh toán"
 *                 MaHD:
 *                   type: string
 *                   example: "HD00001"
 *                 TongTien:
 *                   type: integer
 *                   example: 300000
 *       409:
 *         description: Đã tồn tại hóa đơn cho phiếu khám bệnh này
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã tồn tại hóa đơn thanh toán cho phiếu khám bệnh"
 *                 MaHD:
 *                   type: string
 *                   example: "HD00001"
 *       500:
 *         description: Lỗi hệ thống hoặc tạo hóa đơn thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/createInvoice', invoiceController.createInvoice);

/**
 * @swagger
 * /invoice/getInvoicesByDate/{NgayThanhToan}:
 *   get:
 *     summary: Lấy tất cả hóa đơn thanh toán trong ngày
 *     description: API trả về danh sách tất cả hóa đơn thanh toán theo ngày thanh toán.
 *     tags:
 *       - Invoice
 *     parameters:
 *       - in: path
 *         name: NgayThanhToan
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày thanh toán cần lấy danh sách hóa đơn (yyyy-MM-dd)
 *         example: "2025-12-15"
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách hóa đơn thanh toán trong ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaHD:
 *                     type: string
 *                     example: "HD00001"
 *                   MaPKB:
 *                     type: string
 *                     example: "PKB00001"
 *                   NgayThanhToan:
 *                     type: string
 *                     format: date
 *                     example: "2025-12-15"
 *                   TienKham:
 *                     type: integer
 *                     example: 100000
 *                   TienThuoc:
 *                     type: integer
 *                     example: 200000
 *                   TongTien:
 *                     type: integer
 *                     example: 300000
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/getInvoicesByDate/:NgayThanhToan', invoiceController.getInvoicesByDate);

/**
 * @swagger
 * /invoice/getInvoice/{MaHD}:
 *   get:
 *     summary: Lấy thông tin hóa đơn theo mã hóa đơn
 *     description: API trả về thông tin chi tiết của hóa đơn thanh toán dựa trên mã hóa đơn (MaHD).
 *     tags:
 *       - Invoice
 *     parameters:
 *       - in: path
 *         name: MaHD
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã hóa đơn cần lấy thông tin
 *         example: "HD00001"
 *     responses:
 *       200:
 *         description: Thành công - trả về thông tin chi tiết hóa đơn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaHD:
 *                   type: string
 *                   example: "HD00001"
 *                 MaPKB:
 *                   type: string
 *                   example: "PKB00001"
 *                 NgayThanhToan:
 *                   type: string
 *                   format: date
 *                   example: "2025-12-15"
 *                 TienKham:
 *                   type: integer
 *                   example: 100000
 *                 TienThuoc:
 *                   type: integer
 *                   example: 200000
 *                 TongTien:
 *                   type: integer
 *                   example: 300000
 *       404:
 *         description: Không tìm thấy hóa đơn theo mã cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/getInvoice/:MaHD', invoiceController.getInvoiceById);

/**
 * @swagger
 * /invoice/updateInvoice/{MaHD}:
 *   put:
 *     summary: Cập nhật tiền khám, tiền thuốc và tổng tiền theo mã hóa đơn
 *     description: API dùng để cập nhật tiền khám, tiền thuốc và tự động tính tổng tiền của hóa đơn thanh toán dựa trên mã hóa đơn (MaHD).
 *     tags:
 *       - Invoice
 *     parameters:
 *       - in: path
 *         name: MaHD
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã hóa đơn cần cập nhật
 *         example: "HD00001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TienKham:
 *                 type: integer
 *                 example: 150000
 *               TienThuoc:
 *                 type: integer
 *                 example: 250000
 *     responses:
 *       200:
 *         description: Cập nhật hóa đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thành công"
 *                 result:
 *                   type: object
 *                   properties:
 *                     MaHD:
 *                       type: string
 *                       example: "HD00001"
 *                     TienKham:
 *                       type: integer
 *                       example: 150000
 *                     TienThuoc:
 *                       type: integer
 *                       example: 250000
 *                     TongTien:
 *                       type: integer
 *                       example: 400000
 *       404:
 *         description: Không tìm thấy hóa đơn để cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy hóa đơn để cập nhật"
 *       500:
 *         description: Lỗi hệ thống hoặc cập nhật thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.put('/updateInvoice/:MaHD', invoiceController.updateInvoice);

/**
 * @swagger
 * /invoice/deleteInvoice/{MaHD}:
 *   delete:
 *     summary: Xóa hóa đơn thanh toán theo mã hóa đơn
 *     description: API dùng để xóa hóa đơn thanh toán dựa trên mã hóa đơn (MaHD).
 *     tags:
 *       - Invoice
 *     parameters:
 *       - in: path
 *         name: MaHD
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã hóa đơn cần xóa
 *         example: "HD00001"
 *     responses:
 *       200:
 *         description: Xóa hóa đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "Xóa thành công"
 *       400:
 *         description: Xóa không thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa không thành công"
 *       500:
 *         description: Lỗi hệ thống hoặc không thể xóa hóa đơn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.delete('/deleteInvoice/:MaHD', invoiceController.deleteInvoice);

module.exports = router;