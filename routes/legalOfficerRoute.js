const express = require('express');
const router = express.Router();
const {
  getAssignedCases,
  getCaseById,
  addComment,
  updateCaseStatus,
  returnCaseToAdmin
} = require('../controllers/legalOfficerController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Legal
 *   description: Legal Officer APIs
 */

/**
 * @swagger
 * /api/v1/legal:
 *   get:
 *     summary: Get all assigned cases for the logged-in legal officer
 *     tags: [Legal]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned cases
 */
router.get('/', authMiddleware(['LegalOfficer']), getAssignedCases);

/**
 * @swagger
 * /api/v1/legal/{id}:
 *   get:
 *     summary: Get a single assigned case by ID
 *     tags: [Legal]
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
router.get('/:id', authMiddleware(['LegalOfficer']), getCaseById);

/**
 * @swagger
 * /api/v1/legal/comment:
 *   post:
 *     summary: Add a comment to a case
 *     tags: [Legal]
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
router.post('/comment', authMiddleware(['LegalOfficer']), addComment);

/**
 * @swagger
 * /api/v1/legal/status:
 *   put:
 *     summary: Update the status of a case
 *     tags: [Legal]
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
 *                 example: Legal
 *     responses:
 *       200:
 *         description: Case status updated
 */
router.put('/status', authMiddleware(['LegalOfficer']), updateCaseStatus);

/**
 * @swagger
 * /api/v1/legal/return:
 *   put:
 *     summary: Return case to Super Admin
 *     tags: [Legal]
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
router.put('/return', authMiddleware(['LegalOfficer']), returnCaseToAdmin);

module.exports = router;
