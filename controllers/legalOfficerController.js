const { Case, Comment, User } = require('../models');

// 1. Get all cases assigned to this Legal Officer where status = 'Legal'
const getAssignedCases = async (req, res) => {
  try {
    const officerId = req.user.id;

    const legalCases = await Case.findAll({
      where: {
        assignedTo: officerId,
        status: 'Legal'
      },
      include: [
        { model: Comment },
        { model: User, as: 'assignedUser', attributes: ['id', 'name', 'role'] }
      ]
    });

    res.status(200).json({ success: true, data: legalCases });
  } catch (error) {
    console.error('Error fetching legal cases:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. Add a comment to a case
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

// 3. Update case status to 'Complete' only
const markCaseComplete = async (req, res) => {
  try {
    const { caseId } = req.body;

    const caseRecord = await Case.findByPk(caseId);
    if (!caseRecord || caseRecord.assignedTo !== req.user.id || caseRecord.status !== 'Legal') {
      return res.status(404).json({ success: false, message: 'Case not found or unauthorized' });
    }

    caseRecord.status = 'Complete';
    await caseRecord.save();

    res.status(200).json({ success: true, message: 'Case marked as complete', data: caseRecord });
  } catch (error) {
    console.error('Error marking case complete:', error);
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
module.exports={getAssignedCases,addComment,markCaseComplete,returnCaseToAdmin}