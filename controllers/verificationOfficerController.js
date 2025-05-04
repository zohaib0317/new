// controllers/caseController.js

const { Case,Comment,User } = require("../models")

/*const createCase = async (req, res) => {
    try {
        const {
            title,
            description,
            patientName,
            dateOfIncident,
            classOfBusiness,
            adjusterNumber,
            claimNumber,
            insuranceName,
            amount,
            assignedTo
        } = req.body;

        // Assume  that document is already uploaded and OCR extracted data is 

        const newCase = await Case.create({
            title,
            description,
            patientName,
            dateOfIncident,
            classOfBusiness,
            adjusterNumber,
            claimNumber,
            insuranceName,
            amount,
            assignedTo, // User ID of the Verification Officer
            status: 'Created'
        });

        res.status(201).json({ success: true, message: 'Case created successfully', data: newCase });
    } catch (error) {
        console.error('Error creating case:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};*/


const getAssignedCases = async (req, res) => {
    try {
        const officerId = req.user.id; // from authMiddleware
        const assignedCases = await Case.findAll({
            where: { assignedTo: officerId },
            include: [
                { model: Comment },
                { model: User, attributes: ['id', 'name', 'role'] }
            ]
        });

        res.status(200).json({ success: true, data: assignedCases });
    } catch (error) {
        console.error('Error fetching assigned cases:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Add a comment to a specific case
const addComment = async (req, res) => {
    try {
        const { caseId, text } = req.body;
        const userId = req.user.id;

        const newComment = await Comment.create({
            caseId,
            userId,
            text
        });

        res.status(201).json({ success: true, message: 'Comment added', data: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update the status of a case (e.g., Verified or Needs Review)
const updateCaseStatus = async (req, res) => {
    try {
        const { caseId, newStatus } = req.body;

        const caseRecord = await Case.findByPk(caseId);
        if (!caseRecord) {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }

        caseRecord.status = newStatus; // e.g., 'Verified', 'Needs Review'
        await caseRecord.save();

        res.status(200).json({ success: true, message: 'Case status updated', data: caseRecord });
    } catch (error) {
        console.error('Error updating case status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Return case back to Super Admin after verification
const returnCaseToAdmin = async (req, res) => {
    try {
        const { caseId } = req.body;

        const caseToReturn = await Case.findByPk(caseId);
        if (!caseToReturn) {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }

        caseToReturn.assignedTo = null; // Unassigning case
        caseToReturn.status = 'Returned to Admin'; // Update status
        await caseToReturn.save();

        res.status(200).json({ success: true, message: 'Case returned to Super Admin', data: caseToReturn });
    } catch (error) {
        console.error('Error returning case:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


module.exports={getAssignedCases,addComment,updateCaseStatus,returnCaseToAdmin}