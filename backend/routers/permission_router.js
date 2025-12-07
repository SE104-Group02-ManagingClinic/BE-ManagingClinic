const router = require('express').Router();
const permissionController = require('../controllers/permission_controller');

/**
 * @swagger
 * tags:
 *   name: Permission
 *   description: Các API liên quan phân quyền chức năng cho các nhóm người dùng.
 */

/**
 * @swagger
 * /permission/createPermission:
 *   post:
 *     summary: Tạo mới phân quyền
 *     description: API dùng để tạo phân quyền cho nhóm người dùng với chức năng cụ thể.
 *     tags:
 *       - Permission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MaNhom:
 *                 type: string
 *                 example: "GR001"
 *               MaChucNang:
 *                 type: string
 *                 example: "CN001"
 *     responses:
 *       201:
 *         description: Tạo phân quyền thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo phân quyền cho nhóm người dùng thành công"
 *       409:
 *         description: Phân quyền đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã tồn tại phân quyền này"
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
router.post('/createPermission', permissionController.createPermission);
/**
 * @swagger
 * /permission/deletePermission:
 *   delete:
 *     summary: Xóa phân quyền
 *     description: API dùng để xóa phân quyền của nhóm người dùng với chức năng cụ thể.
 *     tags:
 *       - Permission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MaNhom:
 *                 type: string
 *                 example: "GR001"
 *               MaChucNang:
 *                 type: string
 *                 example: "FUNC001"
 *     responses:
 *       200:
 *         description: Xóa phân quyền thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa phân quyền thành công"
 *       400:
 *         description: Không tồn tại phân quyền này hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tồn tại phân quyền này"
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
router.delete('/deletePermission', permissionController.deletePermission);
/**
 * @swagger
 * /permission/getFunctionsOfGroupUser/{MaNhom}:
 *   get:
 *     summary: Lấy danh sách các chức năng của một nhóm người dùng
 *     description: API trả về danh sách các chức năng (id và tên) được phân quyền cho nhóm người dùng dựa trên mã nhóm.
 *     tags:
 *       - Permission
 *     parameters:
 *       - in: path
 *         name: MaNhom
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã nhóm người dùng cần lấy danh sách chức năng
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách chức năng của nhóm
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
router.get('/getFunctionsOfGroupUser/:MaNhom', permissionController.getFunctionsOfGroupUser);
module.exports = router;