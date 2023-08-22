const express = require('express');
const validate = require('../../middlewares/validate');
const getUser = require('../../middlewares/getUser');
const getRestaurant = require('../../middlewares/getRestaurant');
const orderController = require('../../controllers/order.controller');
const orderValiadation = require('../../validations/order.validation');

const router = express.Router();

router.use(getUser);
router.use(getRestaurant);
router.get('/get-processing-order', validate(orderValiadation.getProcessingOrder), orderController.getProcessingOrder);
router.get('/get-completed-order', validate(orderValiadation.getCompletedOrder), orderController.getCompletedOrder);
router.post(
  '/order-transition',
  validate(orderValiadation.transitionOrderToCompleted),
  orderController.transitionOrderToCompleted
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: send oreder to client
 */

/**
 * @swagger
 * /order/get-processing-order:
 *   get:
 *     summary: Get processing order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verify access token
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProcessingOrder'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /order/get-completed-order:
 *   get:
 *     summary: Get completed order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verify access token
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompletedOrder'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /order/order-transition:
 *   post:
 *     summary: transite processing order to completed
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verify access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderTable
 *               - orderCompletedTime
 *               - type
 *               - managerNote
 *             properties:
 *               orderTable:
 *                 type: number
 *                 description: table number
 *               orderCompletedTime:
 *                 type: date
 *               type:
 *                 type: string
 *                 description: Success, Cancel, Refund, Partial Success
 *               managerNote:
 *                 type: string
 *             example:
 *               orderTable: 8
 *               orderCompletedTime: 2023-08-19T12:34:56.789Z
 *               type: Cancel
 *               managerNote: Custumer cancel this order.
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompletedOrder'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
