const { Collection, Case, Comment } = require('../models');

const getAssignedCases = async (req, res) => {
  const officerId = req.userId;

  const assigned = await Collection.findAll({
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

const getCaseById = async (req, res) => {
  const officerId = req.userId;
  const caseId = req.params.id;

  const assignment = await Collection.findOne({
    where: { officerId, caseId },
    include: [{ model: Case }]
  });

  if (!assignment) return res.status(404).json({ message: 'Case not found' });

  const caseData = assignment.Case;
  const visible = {};
  assignment.sharedFields.forEach(field => {
    visible[field] = caseData[field];
  });

  return res.json({ success: true, data: visible });
};

const addComment = async (req, res) => {
  const { caseId, text } = req.body;
  const comment = await Comment.create({
    caseId,
    userId: req.userId,
    text
  });
  res.status(201).json({ success: true, message: 'Comment added', data: comment });
};

const updateCaseStatus = async (req, res) => {
  const { caseId, newStatus, rejectionReason } = req.body;
  const officerId = req.userId;

  const assignment = await Collection.findOne({ where: { officerId, caseId } });
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  assignment.status = newStatus;
  if (newStatus === 'Rejected') assignment.rejectionReason = rejectionReason;

  await assignment.save();

  return res.json({ success: true, message: 'Status updated' });
};

const returnCaseToAdmin = async (req, res) => {
  const { caseId } = req.body;
  const officerId = req.userId;

  const assignment = await Collection.findOne({ where: { officerId, caseId } });
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

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
