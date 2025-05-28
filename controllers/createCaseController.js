const { Case,User,verification } = require('../models');

const createCase = async (req, res) => {
  try {
    const {
      title,
      description,
      patientName,
      doi,
      cob,
      adjNumber,
      claimNumber,
      insuranceName,
      amount
    } = req.body;

    const createdBy = req.userId;

    const newCase = await Case.create({
      title,
      description,
      patientName,
      doi,
      cob,
      adjNumber,
      claimNumber,
      insuranceName,
      amount,
      createdBy,
      status: 'Created' // always starts as unassigned
    });

    return res.status(201).json({
      success: true,
      message: 'Case created successfully',
      data: newCase
    });

  } catch (error) {
    console.error('Error creating case:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};




const assignCase = async (req, res) => {
  try {
    const { caseId, officerId, role, sharedFields } = req.body;

    console.log("Assigning case to officer with IDs:", { caseId, officerId });


    //  Validate input
    if (!caseId || !officerId || !role || !Array.isArray(sharedFields)) {
      return res.status(400).json({
        success: false,
        message: 'caseId, officerId, role, and sharedFields are required',
      });
    }

    //  Find the case
    const caseItem = await Case.findByPk(caseId);
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    //  Find the officer and check their role
    const officer = await User.findByPk(officerId);
    if (!officer || officer.role !== role) {
      return res.status(400).json({
        success: false,
        message: 'Officer not found or role mismatch',
      });
    }

    //  Update the case
    caseItem.assignedTo = officerId;
    caseItem.assignedRole = role;
    caseItem.sharedFields = sharedFields;
    caseItem.status = 'Assigned';

    await caseItem.save();

    // INSERT INTO verification table if role is VerificationOfficer
if (role === 'VerificationOfficer') {
  // Check for existing assignment to avoid duplicates
  const existing = await verification.findOne({
    where: { caseId, officerId }
  });

  if (!existing) {
    await verification.create({
      caseId,
      officerId,
      sharedFields,
      status: 'Pending' // initial status for new assignments
    });
  }
}

    return res.status(200).json({
      success: true,
      message: 'Case assigned successfully',
      data: caseItem,
    });

  } catch (error) {
    console.error('Error assigning case:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updateAssignedCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { officerId, role, sharedFields } = req.body;

    const caseItem = await Case.findByPk(caseId);
    if (!caseItem) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const officer = await User.findByPk(officerId);
    if (!officer || officer.role !== role) {
      return res.status(400).json({ success: false, message: 'Officer not found or role mismatch' });
    }

    // Update assignment
    caseItem.assignedTo = officerId;
    caseItem.assignedRole = role;
    caseItem.sharedFields = sharedFields || [];
    caseItem.status = 'Assigned';

    await caseItem.save();

    return res.status(200).json({
      success: true,
      message: 'Case reassigned successfully',
      data: caseItem
    });

  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// Get All Cases 
const getAllCases = async (req, res) => {
  try {
    const cases = await Case.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: 'All cases fetched successfully',
      data: cases
    });

  } catch (error) {
    console.error('Error fetching all cases:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

//  Get Case By ID 
const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundCase = await Case.findByPk(id);
    if (!foundCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Case fetched successfully',
      data: foundCase
    });

  } catch (error) {
    console.error('Error fetching case by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

//  Delete Case
const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;

    const foundCase = await Case.findByPk(id);
    if (!foundCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    await foundCase.destroy();

    return res.status(200).json({
      success: true,
      message: 'Case deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting case:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


const updateCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const {
      title,
      description,
      patientName,
      doi,
      cob,
      adjNumber,
      claimNumber,
      insuranceName,
      amount
    } = req.body;

    const caseItem = await Case.findByPk(caseId);
    if (!caseItem) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    // Update fields
    caseItem.title = title ?? caseItem.title;
    caseItem.description = description ?? caseItem.description;
    caseItem.patientName = patientName ?? caseItem.patientName;
    caseItem.doi = doi ?? caseItem.doi;
    caseItem.cob = cob ?? caseItem.cob;
    caseItem.adjNumber = adjNumber ?? caseItem.adjNumber;
    caseItem.claimNumber = claimNumber ?? caseItem.claimNumber;
    caseItem.insuranceName = insuranceName ?? caseItem.insuranceName;
    caseItem.amount = amount ?? caseItem.amount;

    await caseItem.save();

    return res.status(200).json({
      success: true,
      message: 'Case updated successfully',
      data: caseItem
    });

  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


module.exports = {
  createCase,
  assignCase,
  updateAssignedCase,
  getAllCases,
  getCaseById,
  deleteCase,
  updateCase
};
