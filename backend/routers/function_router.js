const router = require('express').Router();
const functionController = require('../controllers/function_controller');

/**
 * @swagger
 * tags:
 *   name: Function
 *   description: Các API liên quan tới chức năng cua ung dung mà user có thể sử dụng
 */

/**
 * @swagger
 * /function/createFunction:
 *   post:
 *     summary: Tạo mới chức năng
 *     description: API dùng để tạo mới một chức năng trong hệ thống.
 *     tags:
 *       - Function
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenChucNang:
 *                 type: string
 *                 description: Tên chức năng cần tạo
 *                 example: "Chức năng quản lý người dùng"
 *               TenManHinhDuocLoad:
 *                 type: string
 *                 description: Tên màn hình được load khi gọi chức năng
 *                 example: "UserManagementScreen"
 *     responses:
 *       201:
 *         description: Tạo chức năng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaChucNang:
 *                   type: string
 *                   example: "CN001"
 *                 TenChucNang:
 *                   type: string
 *                   example: "Chức năng quản lý người dùng"
 *                 TenManHinhDuocLoad:
 *                   type: string
 *                   example: "UserManagementScreen"
 *       409:
 *         description: Tên chức năng đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tên chức năng đã tồn tại"
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
router.post("/createFunction", functionController.createFunction);

/**
 * @swagger
 * /function/getFunctionById/{MaChucNang}:
 *   get:
 *     summary: Lấy thông tin chức năng theo mã
 *     description: API trả về chi tiết chức năng dựa trên mã `MaChucNang`.
 *     tags:
 *       - Function
 *     parameters:
 *       - in: path
 *         name: MaChucNang
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã chức năng cần lấy
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaChucNang:
 *                     type: string
 *                     example: "CN001"
 *                   TenChucNang:
 *                     type: string
 *                     example: "Quản lý người dùng"
 *                   MoTa:
 *                     type: string
 *                     example: "Chức năng quản lý thông tin người dùng"
 *       400:
 *         description: Thiếu mã chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Id function is empty."
 *       404:
 *         description: Không tìm thấy chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not found."
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
router.get("/getFunctionById/:MaChucNang", functionController.getFunctionById);

/**
 * @swagger
 * /function/getAllFunctions:
 *   get:
 *     summary: Lấy thông tin toàn bộ các chức năng
 *     description: API trả về danh sách tất cả các chức năng trong hệ thống.
 *     tags:
 *       - Function
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaChucNang:
 *                     type: string
 *                     example: "CN001"
 *                   TenChucNang:
 *                     type: string
 *                     example: "Quản lý người dùng"
 *                   MoTa:
 *                     type: string
 *                     example: "Chức năng quản lý thông tin người dùng"
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
router.get("/getAllFunctions", functionController.getAllFunctions);

/**
 * @swagger
 * /function/getFunctionNameList:
 *   get:
 *     summary: Lấy danh sách các chức năng (id và tên)
 *     description: API trả về danh sách mã và tên của tất cả các chức năng trong hệ thống.
 *     tags:
 *       - Function
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách id và tên chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaChucNang:
 *                     type: string
 *                     example: "CN001"
 *                   TenChucNang:
 *                     type: string
 *                     example: "Quản lý người dùng"
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
router.get("/getFunctionNameList", functionController.getFunctionNameList);

/**
 * @swagger
 * /function/updateFunction/{MaChucNang}:
 *   put:
 *     summary: Cập nhật chức năng theo mã
 *     description: API dùng để cập nhật thông tin chức năng dựa trên mã `MaChucNang`.
 *     tags:
 *       - Function
 *     parameters:
 *       - in: path
 *         name: MaChucNang
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã chức năng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenChucNang:
 *                 type: string
 *                 example: "Quản lý người dùng"
 *               TenManHinhDuocLoad:
 *                 type: string
 *                 example: "UserManagementScreen"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "Cập nhật thành công"
 *       400:
 *         description: Thông tin không thay đổi hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thông tin không thay đổi"
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
router.put("/updateFunction/:MaChucNang", functionController.updateFunction);

/**
 * @swagger
 * /function/deleteFunction/{MaChucNang}:
 *   delete:
 *     summary: Xóa chức năng theo mã
 *     description: API dùng để xóa chức năng dựa trên mã `MaChucNang`.
 *     tags:
 *       - Function
 *     parameters:
 *       - in: path
 *         name: MaChucNang
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã chức năng cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "Xóa thành công"
 *       400:
 *         description: Xóa không thành công hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa không thành công"
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
router.delete("/deleteFunction/:MaChucNang", functionController.deleteFunction);

module.exports = router;