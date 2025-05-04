const express = require('express')
const router = express.Router()
const {
    getAssignedCases,
    addComment,
    markCaseComplete,
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
   * /api/v1/legal/cases:
   *   get:
   *     summary: Get all legal cases assigned to the Legal Officer
   *     tags: [Legal]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: List of assigned legal cases
   */
  router.get('/legal', authMiddleware, getAssignedCases);
  
  /**
   * @swagger
   * /api/v1/legal/case/comment:
   *   post:
   *     summary: Add a comment to a legal case
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
   *                 example: d7f1d2ee-98f0-45b1-bce0-4f4fa0e3c1ae
   *               text:
   *                 type: string
   *                 example: Sent legal notice to insurance
   *     responses:
   *       201:
   *         description: Comment added
   */
  router.post('/legal/comment', authMiddleware, addComment);
  
  /**
   * @swagger
   * /api/v1/legal/case/complete:
   *   put:
   *     summary: Mark case as Complete
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
   *                 example: d7f1d2ee-98f0-45b1-bce0-4f4fa0e3c1ae
   *     responses:
   *       200:
   *         description: Case marked as complete
   */
  router.put('/legal/complete', authMiddleware, markCaseComplete);
  
  /**
   * @swagger
   * /api/v1/legal/case/return:
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
   *                 example: d7f1d2ee-98f0-45b1-bce0-4f4fa0e3c1ae
   *     responses:
   *       200:
   *         description: Case returned to Admin
   */
  router.put('/legal/return', authMiddleware, returnCaseToAdmin);
  
  module.exports = router;