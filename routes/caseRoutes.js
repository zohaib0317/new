const express = require('express');
const router = express.Router();
const { createCase } = require('../controllers/createCaseController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Cases
 *   description: Case management for Super Admin
 */

/**
 * @swagger
 * /api/v1/cases:
 *   post:
 *     summary: Create a new case (Super Admin only)
 *     tags: [Cases]
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
 *               - dateOfIncident
 *               - assignedTo
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               patientName:
 *                 type: string
 *               dateOfIncident:
 *                 type: string
 *               classOfBusiness:
 *                 type: string
 *               adjusterNumber:
 *                 type: string
 *               claimNumber:
 *                 type: string
 *               insuranceName:
 *                 type: string
 *               amount:
 *                 type: number
 *               assignedTo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Case created successfully
 */
router.post('/cases', authMiddleware, createCase);

module.exports = router;
