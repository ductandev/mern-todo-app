import express from "express"
import { forgotPassword, resetPassword } from "../controllers/forgotPasswordController.js"

const router = express.Router();

/**
 * @swagger
 * /api/forgotPassword/forgotPassword:
 *   post:
 *     summary: Gửi email reset mật khẩu
 *     tags: [ForgotPassword]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email đã được gửi
 */
router.post("/forgotPassword", forgotPassword)

/**
 * @swagger
 * /api/forgotPassword/resetPassword:
 *   post:
 *     summary: Đặt lại mật khẩu mới
 *     tags: [ForgotPassword]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mật khẩu đã được đặt lại
 */
router.post("/resetPassword", resetPassword)

export default router;