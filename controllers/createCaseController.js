const { Case } = require('../models');

const createCase = async (req, res) => {
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

        const createdBy = req.user.id;

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
            assignedTo,
            createdBy,
            status: 'Created'
        });

        res.status(201).json({
            success: true,
            message: 'Case created successfully',
            data: newCase
        });
    } catch (error) {
        console.error('Error creating case:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { createCase };
