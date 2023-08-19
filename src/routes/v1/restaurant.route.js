const express = require('express');
const validate = require('../../middlewares/validate');
const getUser = require('../../middlewares/getUser');
const restaurantValidation = require('../../validations/restaurant.validation');
const restaurantController = require('../../controllers/restaurant.controller');

const router = express.Router();

router.use(getUser);
router.get('/get-rest', validate(restaurantValidation.getRest), restaurantController.getRest);
router.post('/register-rest', validate(restaurantValidation.registerRest), restaurantController.registerRest);
router.post('/connect-rest', validate(restaurantValidation.connectRest), restaurantController.connectRest);
router.delete('/disconnect-rest', validate(restaurantValidation.disconnectRest), restaurantController.disconnectRest);
router.patch(
  '/update-rest-profile',
  validate(restaurantValidation.updateRestProfile),
  restaurantController.updateRestProfile
);
router.patch('/update-rest', validate(restaurantValidation.updateRest), restaurantController.updateRest);
router.delete('/delete-rest', validate(restaurantValidation.deleteRest), restaurantController.deleteRest);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Rest
 *   description: Restaurant
 */

/**
 * @swagger
 * /rest/get-rest:
 *   get:
 *     summary: Get a restaurant
 *     tags: [Rest]
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
 *               $ref: '#/components/schemas/Restaurant'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /rest/register-rest:
 *   post:
 *     summary: Register a restaurant
 *     tags: [Rest]
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
 *               - name
 *               - restaurantToken
 *               - verficationCode
 *             properties:
 *               name:
 *                 type: string
 *                 description: must be unique
 *               restaurantToken:
 *                 type: string
 *                 length: 6
 *                 description: a six-digit number
 *               verficationCode:
 *                 type: string
 *                 length: 6
 *                 description: a six-digit number
 *               table:
 *                 type: number
 *             example:
 *               name: Japanese restaurant
 *               table: 8
 *               restaurantToken: "123456"
 *               verficationCode: "111111"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Restaurant'
 *       "400":
 *          $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /rest/connect-rest:
 *   post:
 *     summary: Connect a restaurant
 *     tags: [Rest]
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
 *               - name
 *               - restaurantToken
 *             properties:
 *               name:
 *                 type: string
 *                 description: must be unique
 *               restaurantToken:
 *                 type: string
 *                 length: 6
 *                 description: a six-digit number
 *             example:
 *               name: Japanese restaurant
 *               restaurantToken: "123456"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Restaurant'
 *       "400":
 *         $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /rest/disconnect-rest:
 *   delete:
 *     summary: Disconnect a restaurant
 *     tags: [Rest]
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
 *       "204":
 *         description: No Content
 *       "400":
 *         $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /rest/update-rest-profile:
 *   patch:
 *     summary: Manage a restaurant profile
 *     tags: [Rest]
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
 *             properties:
 *               restaurantToken:
 *                 type: string
 *                 length: 6
 *                 description: a six-digit number
 *               table:
 *                 type: number
 *               discription:
 *                 type: string
 *               headImg:
 *                 type: string
 *             example:
 *               restaurantToken: "654321"
 *               table: 12
 *               discription: Fanshion style Janpanese restaurant located in CBD
 *               headImg: xxxxxxxxxx
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       "400":
 *          $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /rest/update-rest:
 *   patch:
 *     summary: Manage a restaurant profile by admin
 *     tags: [Rest]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               pastName:
 *                 type: string
 *                 description: must be unique
 *               name:
 *                 type: string
 *                 description: must be unique
 *               restaurantToken:
 *                 type: string
 *                 length: 6
 *                 description: a six-digit number
 *               table:
 *                 type: number
 *               discription:
 *                 type: Fanshion style Janpanese restaurant located in CBD
 *               headImg:
 *                 type: xxxxxxxxxxxxxxx(base 64)
 *             example:
 *               pastName: Japanese restaurant
 *               name: Sushi restaurant
 *               restaurantToken: "654321"
 *               table: 12
 *               discription: Fanshion style Janpanese restaurant located in Downtown
 *               headImg: xxxxyyyy
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Restaurant'
 *       "400":
 *          $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /rest/delete-rest:
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Rest]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: must be unique
 *             example:
 *                 name: Japanese restaurant
 *     responses:
 *       "204":
 *         description: Successful deleted
 *       "400":
 *          $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */
