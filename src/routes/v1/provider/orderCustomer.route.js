const express = require('express');
const validate = require('../../../middlewares/validate');
const orderController = require('../../../controllers/order.controller');
const orderValiadation = require('../../../validations/order.validation');

const router = express.Router();

router.post('/view-order', validate(orderValiadation.viewOrderByCustomer), orderController.viewOrderByCustomer);
router.post('/upload-order', validate(orderValiadation.uploadOrderByCustomer), orderController.uploadOrderByCustomer);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: receive oreder from customer
 */

/**
 * @swagger
 * /order/view-order:
 *   post:
 *     summary: view order by customer
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - orderTable
 *             properties:
 *               orderId:
 *                 type: MongoDB_id
 *               orderTable:
 *                 type: number
 *                 description: table number
 *             example:
 *               orderId: 64e2e6d78b0fd385dc04203c
 *               orderTable: 8
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /order/upload-order:
 *   post:
 *     summary: upload order by customer
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - orderTable
 *               - orderItem
 *               - totalPrice
 *               - time
 *               - guestNote
 *             properties:
 *               orderId:
 *                 type: MongoDB_id
 *               orderTable:
 *                 type: number
 *                 description: table number
 *               orderItem:
 *                 type: array
 *               totalPrice:
 *                 type: number
 *               time:
 *                 type: date
 *               guestNote:
 *                 type: string
 *             example:
 *               orderId: 64e2e6d78b0fd385dc04203c
 *               orderTable: 8
 *               orderItem: [{itemName: beef roll, itemPrice: 9.8, itemNumber: 3, specialNote: no spicy }, {itemName: salmon roll, itemPrice: 12.8, itemNumber: 5 }]
 *               totalPrice: 93.4
 *               time: 2023-08-19T12:34:56.789Z
 *               guestNote: ASAP
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
