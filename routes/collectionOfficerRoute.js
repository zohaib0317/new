const express = require('express')
const router = express.Router()
const{
getAssignedCases,
addComment,
updateCaseStatus,
returnCaseToAdmin
}=require('../controllers/collectionOfficerController')
const authMiddleware = require('../middleware/authMiddleware')

/**
 * @swagger
 * tags:
 *   name: Collection
 *   description: Collection Officer APIs
 */

/**
 * @swagger
 * /api/v1/collection/cases:
 *   get:
 *     summary: Get all verified cases assigned to the Collection Officer
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned verified cases
 */
router.get('/collection', authMiddleware, getAssignedCases);

/**
 * @swagger
 * /api/v1/collection/case/comment:
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
 *                 example: cb6d5ea6-3e4f-4a98-a637-8d2aa2c73d54
 *               text:
 *                 type: string
 *                 example: Called the patient but couldn’t collect
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post('/collection/comment', authMiddleware, addComment);

/**
 * @swagger
 * /api/v1/collection/case/status:
 *   put:
 *     summary: Update the status of a case (Collected or Sent to Legal)
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
 *                 enum: [Collected, Legal]
 *                 example: Collected
 *     responses:
 *       200:
 *         description: Case status updated
 */
router.put('/collection/status', authMiddleware, updateCaseStatus);

/**
 * @swagger
 * /api/v1/collection/case/return:
 *   put:
 *     summary: Return case to Super Admin if unable to collect
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
 *                 example: cb6d5ea6-3e4f-4a98-a637-8d2aa2c73d54
 *     responses:
 *       200:
 *         description: Case returned to Admin
 */
router.put('/collection/return', authMiddleware, returnCaseToAdmin);

module.exports = router;