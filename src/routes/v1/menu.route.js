const express = require('express');
const validate = require('../../middlewares/validate');
const getUser = require('../../middlewares/getUser');
const getRestaurant = require('../../middlewares/getRestaurant');
const getMenu = require('../../middlewares/getMenu');
const menuController = require('../../controllers/menu.controller');
const menuValiadation = require('../../validations/menu.validation');

const router = express.Router();

router.use(getUser);
router.use(getRestaurant);
router.use(getMenu);
router.get('/get-dishes', validate(menuValiadation.getDishes), menuController.getDishes);
router.get('/get-feature', validate(menuValiadation.getDishes), menuController.getFeature);
router.get('/get-category', validate(menuValiadation.getDishes), menuController.getCategory);
router.post('/add-dishes', validate(menuValiadation.addDishes), menuController.addDishes);
router.post('/find-dishes', validate(menuValiadation.deleteOrFindDishes), menuController.findDishes);
router.delete('/delete-dishes', validate(menuValiadation.deleteOrFindDishes), menuController.deleteDishes);
router.patch('/update-dishes', validate(menuValiadation.updateDishes), menuController.updateDishes);
router.post('/sort-feature', validate(menuValiadation.sortFeature), menuController.sortFeature);
router.post('/sort-category', validate(menuValiadation.sortCategory), menuController.sortCategory);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu and dishes
 */

/**
 * @swagger
 * /menu/get-dishes:
 *   get:
 *     summary: Get all dishes
 *     tags: [Menu]
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
 *               $ref: '#/components/schemas/Dishes'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /menu/get-feature:
 *   get:
 *     summary: Get featured dishes
 *     tags: [Menu]
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
 *               $ref: '#/components/schemas/Dishes'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /menu/get-category:
 *   get:
 *     summary: Get dishes on category
 *     tags: [Menu]
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
 *               $ref: '#/components/schemas/Dishes'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /menu/add-dishes:
 *   post:
 *     summary: Add dishes to menu
 *     tags: [Menu]
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: must be unique in a menu
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               price:
 *                 type: number
 *               feature:
 *                 type: boolean
 *               category:
 *                 type: string
 *             example:
 *               name: Salmon Sashimi
 *               description: Fresh salmon shashimi with 7 pieces (15g each)
 *               image: xxxxxxxxxx
 *               price: 12.8
 *               feature: true
 *               category: Shashimi
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Dishes'
 *       "400":
 *          $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /menu/find-dishes:
 *   post:
 *     summary: Find a dish
 *     tags: [Menu]
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: must be unique in a menu
 *             example:
 *               name: Salmon Sashimi
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Dishes'
 *       "400":
 *          $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /menu/delete-dishes:
 *   delete:
 *     summary: Delete a dish
 *     tags: [Menu]
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: must be unique in a menu
 *             example:
 *               name: Salmon Sashimi
 *     responses:
 *       "204":
 *         description: No Content
 *       "400":
 *          $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /menu/update-dishes:
 *   patch:
 *     summary: Update dishes to menu
 *     tags: [Menu]
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
 *               - pastName
 *               - name
 *               - price
 *             properties:
 *               pastName:
 *                 type: string
 *                 description: must be unique in a menu
 *               name:
 *                 type: string
 *                 description: must be unique in a menu
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               price:
 *                 type: number
 *               feature:
 *                 type: boolean
 *               category:
 *                 type: string
 *             example:
 *               pastName: Salmon Sashimi
 *               name: Beef roll
 *               description: mixed beef with rice
 *               image: xxxxxxxxxx
 *               price: 4.2
 *               feature: false
 *               category: Roll
 *     responses:
 *       "200":
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Dishes'
 *       "400":
 *          $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /menu/sort-feature:
 *   post:
 *     summary: Sort Feature
 *     tags: [Menu]
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
 *               - feature
 *             properties:
 *               feature:
 *                 type: array
 *             example:
 *               feature: []
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *          $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /menu/sort-category:
 *   post:
 *     summary: Sort Category
 *     tags: [Menu]
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
 *               - category
 *             properties:
 *               category:
 *                 type: object
 *             example:
 *               category: {}
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *          $ref: '#/components/responses/BodyInfoError'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */
