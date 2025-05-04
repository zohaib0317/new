const { Case, Comment, User } = require('../models');

// 1. Get all assigned and verified cases
const getAssignedCases = async (req, res) => {
  try {
    const officerId = req.user.id;

    const cases = await Case.findAll({
      where: {
        assignedTo: officerId,
        status: 'Verified'
      },
      include: [
        { model: Comment },
        { model: User, as: 'assignedUser', attributes: ['id', 'name', 'role'] }
      ]
    });

    res.status(200).json({ success: true, data: cases });
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. Add a comment
const addComment = async (req, res) => {
  try {
    const { caseId, text } = req.body;
    const userId = req.user.id;

    const comment = await Comment.create({ caseId, userId, text });

    res.status(201).json({ success: true, message: 'Comment added', data: comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3. Update case status (Collected or Sent to Legal)
const updateCaseStatus = async (req, res) => {
  try {
    const { caseId, newStatus } = req.body;

    if (!['Collected', 'Legal'].includes(newStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status for collection phase' });
    }

    const caseRecord = await Case.findByPk(caseId);

    if (!caseRecord || caseRecord.assignedTo !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Case not found or unauthorized' });
    }

    caseRecord.status = newStatus;
    await caseRecord.save();

    res.status(200).json({ success: true, message: 'Case status updated', data: caseRecord });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 4. Return case to Super Admin
const returnCaseToAdmin = async (req, res) => {
  try {
    const { caseId } = req.body;

    const caseRecord = await Case.findByPk(caseId);

    if (!caseRecord || caseRecord.assignedTo !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Case not found or unauthorized' });
    }

    caseRecord.assignedTo = null;
    caseRecord.status = 'Returned to Admin';
    await caseRecord.save();

    res.status(200).json({ success: true, message: 'Case returned to admin', data: caseRecord });
  } catch (error) {
    console.error('Error returning case:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
module.exports={getAssignedCases,addComment,updateCaseStatus,returnCaseToAdmin}