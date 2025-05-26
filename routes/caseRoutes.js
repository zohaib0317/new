const express = require('express');
const router = express.Router();
const { createCase,assignCase,updateAssignedCase,getAllCases,getCaseById,deleteCase } = require('../controllers/createCaseController');
const authMiddleware = require('../middleware/authMiddleware');
const { SUPER_ADMIN } = require('../utils/roles');
console.log("hello world3")
/**
 * @swagger
 * tags:
 *   name: Case
 *   description: Case creation and assignment APIs for Super Admin
 */

/**
 * @swagger
 * /api/v1/case:
 *   post:
 *     summary: Create a new case (without assigning)
 *     tags: [Case]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - patientName
 *               - claimNumber
 *               - amount
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Slip and Fall"
 *               description:
 *                 type: string
 *                 example: "Injury at supermarket"
 *               patientName:
 *                 type: string
 *                 example: "John Doe"
 *               doi:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-10"
 *               cob:
 *                 type: string
 *                 example: "Personal Injury"
 *               adjNumber:
 *                 type: string
 *                 example: "ADJ123"
 *               claimNumber:
 *                 type: string
 *                 example: "CLM456"
 *               insuranceName:
 *                 type: string
 *                 example: "XYZ Insurance"
 *               amount:
 *                 type: number
 *                 example: 8000.00
 *     responses:
 *       201:
 *         description: Case created successfully
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware([SUPER_ADMIN]), createCase);

/**
 * @swagger
 * /api/v1/case/assign:
 *   post:
 *     summary: Assign an existing case to an officer
 *     tags: [Case]
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
 *               - officerId
 *               - role
 *               - sharedFields
 *             properties:
 *               caseId:
 *                 type: string
 *                 example: "case-uuid-123"
 *               officerId:
 *                 type: string
 *                 example: "officer-uuid-456"
 *               role:
 *                 type: string
 *                 example: "Verification Officer"
 *               sharedFields:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["patientName", "doi", "claimNumber"]
 *     responses:
 *       200:
 *         description: Case assigned successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Case or officer not found
 *       500:
 *         description: Internal server error
 */
router.post('/assign', authMiddleware([SUPER_ADMIN]), assignCase);

/**
 * @swagger
 * /api/v1/case/{caseId}/reassign:
 *   put:
 *     summary: Reassign an existing case to a different officer
 *     tags: [Case]
 *     parameters:
 *       - name: caseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - officerId
 *               - role
 *             properties:
 *               officerId:
 *                 type: string
 *               role:
 *                 type: string
 *               sharedFields:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Case reassigned successfully
 */
router.put('/:caseId/reassign', authMiddleware(['SuperAdmin']), updateAssignedCase);



/**
 * @swagger
 * /api/v1/case/all:
 *   get:
 *     summary: Get all cases
 *     tags: [Case]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All cases fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get('/all', authMiddleware([SUPER_ADMIN]), getAllCases);


/**
 * @swagger
 * /api/v1/case/{id}:
 *   get:
 *     summary: Get a case by ID
 *     tags: [Case]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the case
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case fetched successfully
 *       404:
 *         description: Case not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware([SUPER_ADMIN]), getCaseById);


/**
 * @swagger
 * /api/v1/case/{id}:
 *   delete:
 *     summary: Delete a case by ID
 *     tags: [Case]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the case to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case deleted successfully
 *       404:
 *         description: Case not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware([SUPER_ADMIN]), deleteCase);


module.exports = router;
