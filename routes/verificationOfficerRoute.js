const express = require('express')
const router = express.Router()
const {
  
    getAssignedCases,
    addComment,
    updateCaseStatus,
    returnCaseToAdmin
} = require('../controllers/verificationOfficerController')
const authMiddleware =require('../middleware/authMiddleware')

/**
 * @swagger
 * tags:
 *   name: Verification
 *   description: Verification Officer APIs
 */

/**
 * @swagger
 * /api/v1/verification/cases:
 *   get:
 *     summary: Get all assigned cases for the logged-in verification officer
 *     tags: [Verification]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned cases
 */
router.get('/verification', authMiddleware, getAssignedCases);

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
 *               - text
 *             properties:
 *               caseId:
 *                 type: string
 *                 example: c4e92aa4-d8a2-4b4b-bc69-e20d9eb37cb2
 *               text:
 *                 type: string
 *                 example: Please verify insurance details.
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post('/verification/comment', authMiddleware, addComment);


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
 */
router.put('/verification/status', authMiddleware, updateCaseStatus);

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
 */
router.put('/verification/return', authMiddleware, returnCaseToAdmin);

module.exports = router;



