const router = require('express').Router();
const groupUserController = require('../controllers/groupuser_controller');

/**
 * @swagger
 * tags:
 *   name: GroupUser
 *   description: Các API liên quan đến nhóm người dùng mới trong hệ thống.
 */

/**
 * @swagger
 * /groupUser/createGroupUser:
 *   post:
 *     summary: Tạo mới nhóm người dùng
 *     description: API dùng để tạo một nhóm người dùng mới trong hệ thống.
 *     tags:
 *       - GroupUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenNhom:
 *                 type: string
 *                 example: "Nhóm Quản trị"
 *     responses:
 *       201:
 *         description: Tạo nhóm người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaNhom:
 *                   type: string
 *                   example: "GR001"
 *                 TenNhom:
 *                   type: string
 *                   example: "Nhóm Quản trị"
 *       409:
 *         description: Tên nhóm người dùng đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tên nhóm người dùng đã tồn tại"
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
router.post('/createGroupUser', groupUserController.createGroupUser);

/**
 * @swagger
 * /groupUser/getGroupUserById/{MaNhom}:
 *   get:
 *     summary: Lấy thông tin nhóm người dùng theo mã
 *     description: API trả về thông tin chi tiết của nhóm người dùng dựa trên mã `MaNhom`.
 *     tags:
 *       - GroupUser
 *     parameters:
 *       - in: path
 *         name: MaNhom
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã nhóm người dùng cần lấy
 *     responses:
 *       200:
 *         description: Thành công - trả về thông tin nhóm người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaNhom:
 *                     type: string
 *                     example: "GR001"
 *                   TenNhom:
 *                     type: string
 *                     example: "Nhóm Quản trị"
 *       400:
 *         description: Thiếu mã nhóm người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Id is empty."
 *       404:
 *         description: Không tìm thấy nhóm người dùng
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
router.get('/getGroupUserById/:MaNhom', groupUserController.getGroupUserById);

/**
 * @swagger
 * /groupUser/getAllGroupUsers:
 *   get:
 *     summary: Lấy thông tin toàn bộ các nhóm người dùng
 *     description: API trả về danh sách tất cả các nhóm người dùng trong hệ thống.
 *     tags:
 *       - GroupUser
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách nhóm người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaNhom:
 *                     type: string
 *                     example: "GR001"
 *                   TenNhom:
 *                     type: string
 *                     example: "Nhóm Quản trị"
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
router.get('/getAllGroupUsers', groupUserController.getAllGroupUsers);

/**
 * @swagger
 * /groupUser/updateGroupUser/{MaNhom}:
 *   post:
 *     summary: Cập nhật nhóm người dùng theo mã
 *     description: API dùng để cập nhật thông tin nhóm người dùng dựa trên mã `MaNhom`.
 *     tags:
 *       - GroupUser
 *     parameters:
 *       - in: path
 *         name: MaNhom
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã nhóm người dùng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenNhom:
 *                 type: string
 *                 example: "Nhóm Quản trị"
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
router.post('/updateGroupUser/:MaNhom', groupUserController.updateGroupUser);

/**
 * @swagger
 * /groupUser/deleteGroupUser/{MaNhom}:
 *   delete:
 *     summary: Xóa nhóm người dùng theo mã
 *     description: API dùng để xóa nhóm người dùng dựa trên mã `MaNhom`.
 *     tags:
 *       - GroupUser
 *     parameters:
 *       - in: path
 *         name: MaNhom
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã nhóm người dùng cần xóa
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
router.delete('/deleteGroupUser/:MaNhom', groupUserController.deleteGroupUser);

module.exports = router;