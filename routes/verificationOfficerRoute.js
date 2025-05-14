const express = require('express');
const router = express.Router();
const {
  getAssignedCases,
  getCaseById,
  addComment,
  updateCaseStatus,
  returnCaseToAdmin
} = require('../controllers/verificationOfficerController');

const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Verification
 *   description: APIs for Verification Officer
 */

/**
 * @swagger
 * /api/v1/verification/cases:
 *   get:
 *     summary: Get all cases assigned to the logged-in verification officer
 *     tags: [Verification]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned cases
 */
router.get('/cases', authMiddleware(['VerificationOfficer']), getAssignedCases);

/**
 * @swagger
 * /api/v1/verification/cases/{id}:
 *   get:
 *     summary: Get a specific assigned case by ID
 *     tags: [Verification]
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
router.get('/cases/:id', authMiddleware(['VerificationOfficer']), getCaseById);

/**
 * @swagger
 * /api/v1/verification/case/comment:
 *   post:
 *     summary: Add a comment to a case
 *     tags: [Verification]
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
 *               - comment
 *             properties:
 *               caseId:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added
 *       404:
 *         description: Case not found
 */
router.post('/case/comment', authMiddleware(['VerificationOfficer']), addComment);

/**
 * @swagger
 * /api/v1/verification/case/status:
 *   put:
 *     summary: Update the status of a case
 *     tags: [Verification]
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
 *                 example: Verified
 *     responses:
 *       200:
 *         description: Case status updated
 *       404:
 *         description: Case not found
 */
router.put('/case/status', authMiddleware(['VerificationOfficer']), updateCaseStatus);

/**
 * @swagger
 * /api/v1/verification/case/return:
 *   put:
 *     summary: Return case to Super Admin
 *     tags: [Verification]
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
 *       404:
 *         description: Case not found
 */
router.put('/case/return', authMiddleware(['VerificationOfficer']), returnCaseToAdmin);

module.exports = router;
