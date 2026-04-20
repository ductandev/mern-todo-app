import express from 'express';
import { loginUser, registerUser,getUser } from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Đăng ký tài khoản
 *     tags: [User]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               email:
 *                 type: string
 *                 example: "user@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 */
router.post("/register",registerUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [User]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Trả về JWT token
 */
router.post("/login",loginUser);

/**
 * @swagger
 * /api/user/getuser:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 */
router.get("/getuser", requireAuth, getUser)

export default router;