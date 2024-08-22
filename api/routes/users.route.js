import express from "express";
import usersController from "../controllers/users.controller.js";
const usersRouter = express.Router();

// Swagger YAML Description
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get list of users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *             example:
 *                 - id: 12345
 *                   firstName: John
 *                   lastName: Doe
 *                   email: johndoe@example.com
 */
usersRouter.get('/', usersController.findAll);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *            example:
 *                 - id: 12345
 *                   firstName: John
 *                   lastName: Doe
 *                   email: johndoe@example.com
 *       400:
 *         description: Bad request (e.g., missing data, invalid format)
 *         content:
 *           application/json:
 *             example:
 *               message: Please provide all required fields
 */
usersRouter.post('/', usersController.post);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               - id: 12345
 *                 firstName: John
 *                 lastName: Doe
 *                 email: johndoe@example.com
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: User with ID {id} not found
 */
usersRouter.delete('/:id', usersController.remove);

/**
 * @swagger
 * /api/users/is-email-exist:
 *   post:
 *     summary: Check if email already exists
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *                 description: Email address to check
 *     responses:
 *       200:
 *         description: Response indicating if email exists
 *         content:
 *           application/json:
 *             example:
 *               true
 *       400:
 *         description: Bad request (e.g., missing email or invalid format)
 *         content:
 *           application/json:
 *             example:
 *               message: Please provide a valid email address
 */
usersRouter.post('/is-email-exist', usersController.isEmailExists);

export default usersRouter;
