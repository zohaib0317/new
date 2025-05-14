const express = require('express');
const router = express.Router();
const {
  getAssignedCases,
  getCaseById,
  addComment,
  updateCaseStatus,
  returnCaseToAdmin
} = require('../controllers/collectionOfficerController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Collection
 *   description: Collection Officer APIs
 */

/**
 * @swagger
 * /api/v1/collection:
 *   get:
 *     summary: Get all assigned cases for the logged-in collection officer
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned cases
 */
router.get('/', authMiddleware(['CollectionOfficer']), getAssignedCases);

/**
 * @swagger
 * /api/v1/collection/{id}:
 *   get:
 *     summary: Get a single assigned case by ID
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Case ID
 *     responses:
 *       200:
 *         description: Case data
 *       404:
 *         description: Case not found
 */
router.get('/:id', authMiddleware(['CollectionOfficer']), getCaseById);

/**
 * @swagger
 * /api/v1/collection/comment:
 *   post:
 *     summary: Add a comment to a case
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - caseId
 *               - text
 *             properties:
 *               caseId:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post('/comment', authMiddleware(['CollectionOfficer']), addComment);

/**
 * @swagger
 * /api/v1/collection/status:
 *   put:
 *     summary: Update the status of a case
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - caseId
 *               - newStatus
 *             properties:
 *               caseId:
 *                 type: string
 *               newStatus:
 *                 type: string
 *                 example: Collected
 *     responses:
 *       200:
 *         description: Case status updated
 */
router.put('/status', authMiddleware(['CollectionOfficer']), updateCaseStatus);

/**
 * @swagger
 * /api/v1/collection/return:
 *   put:
 *     summary: Return case to Super Admin
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - caseId
 *             properties:
 *               caseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Case returned to Super Admin
 */
router.put('/return', authMiddleware(['CollectionOfficer']), returnCaseToAdmin);

module.exports = router;
