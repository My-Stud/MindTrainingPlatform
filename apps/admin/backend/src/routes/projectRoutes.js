const express = require('express');
const { body } = require('express-validator');
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  syncPortalGamesHandler,
} = require('../controllers/projectController');
const { getFolders, createFolder } = require('../controllers/folderController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post('/sync-portal-games', syncPortalGamesHandler);

router.get('/', getProjects);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Project name is required'),
    body('fieldLabels.field1').optional().notEmpty().withMessage('Field 1 label is required'),
    body('fieldLabels.field2').optional().notEmpty().withMessage('Field 2 label is required'),
    body('fieldLabels.field3').optional().notEmpty().withMessage('Field 3 label is required'),
    body('mainQuestionField').optional().isIn(['field1', 'field2', 'field3']).withMessage('Invalid main question field'),
    body('questionsPerQuiz').optional().isInt({ min: 1, max: 100 }).withMessage('Questions per quiz must be 1-100'),
  ],
  validate,
  createProject
);

router.get('/:id', getProject);

router.get('/:id/folders', getFolders);
router.post(
  '/:id/folders',
  [body('name').notEmpty().withMessage('Folder name is required')],
  validate,
  createFolder
);

router.put(
  '/:id',
  [
    body('name').optional().notEmpty().withMessage('Project name cannot be empty'),
    body('fieldLabels.field1').optional().notEmpty().withMessage('Field 1 label is required'),
    body('fieldLabels.field2').optional().notEmpty().withMessage('Field 2 label is required'),
    body('fieldLabels.field3').optional().notEmpty().withMessage('Field 3 label is required'),
    body('mainQuestionField').optional().isIn(['field1', 'field2', 'field3']).withMessage('Invalid main question field'),
    body('questionsPerQuiz').optional().isInt({ min: 1, max: 100 }).withMessage('Questions per quiz must be 1-100'),
  ],
  validate,
  updateProject
);

router.delete('/:id', deleteProject);

module.exports = router;