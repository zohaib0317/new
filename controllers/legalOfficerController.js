const { Legal, Case, Comment } = require('../models');

// ✅ Get all cases assigned to the legal officer
const getAssignedCases = async (req, res) => {
  const officerId = req.userId;

  const assigned = await Legal.findAll({
    where: { officerId },
    include: [{ model: Case }]
  });

  const filtered = assigned.map(item => {
    const caseData = item.Case;
    const visible = {};
    item.sharedFields.forEach(field => {
      visible[field] = caseData[field];
    });
    return {
      caseId: item.caseId,
      status: item.status,
      fields: visible
    };
  });

  return res.json({ success: true, data: filtered });
};

// ✅ Get a single assigned case by ID
const getCaseById = async (req, res) => {
  const officerId = req.userId;
  const caseId = req.params.id;

  const assignment = await Legal.findOne({
    where: { officerId, caseId },
    include: [{ model: Case }]
  });

  if (!assignment) {
    return res.status(404).json({ message: 'Case not found' });
  }

  const caseData = assignment.Case;
  const visible = {};
  assignment.sharedFields.forEach(field => {
    visible[field] = caseData[field];
  });

  return res.json({ success: true, data: visible });
};

// ✅ Add a comment on a case
const addComment = async (req, res) => {
  const { caseId, text } = req.body;

  const comment = await Comment.create({
    caseId,
    userId: req.userId,
    text
  });

  res.status(201).json({
    success: true,
    message: 'Comment added',
    data: comment
  });
};

// ✅ Update status of the case (Approved/Rejected)
const updateCaseStatus = async (req, res) => {
  const { caseId, newStatus, rejectionReason } = req.body;
  const officerId = req.userId;

  const assignment = await Legal.findOne({ where: { officerId, caseId } });
  if (!assignment) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  assignment.status = newStatus;
  if (newStatus === 'Rejected') {
    assignment.rejectionReason = rejectionReason;
  }

  await assignment.save();

  return res.json({ success: true, message: 'Status updated' });
};

// ✅ Return case to super admin
const returnCaseToAdmin = async (req, res) => {
  const { caseId } = req.body;
  const officerId = req.userId;

  const assignment = await Legal.findOne({ where: { officerId, caseId } });
  if (!assignment) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  await assignment.destroy();

  const caseItem = await Case.findByPk(caseId);
  caseItem.assignedTo = null;
  caseItem.assignedRole = null;
  await caseItem.save();

  return res.json({ success: true, message: 'Case returned to admin' });
};

module.exports = {
  getAssignedCases,
  getCaseById,
  addComment,
  updateCaseStatus,
  returnCaseToAdmin
};
