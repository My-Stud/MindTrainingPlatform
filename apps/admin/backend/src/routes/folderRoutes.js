const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  updateFolder,
  deleteFolder,
  emptyFolder,
  getFolder,
} = require('../controllers/folderController');

const router = express.Router();

router.use(protect);

router.put(
  '/:folderId',
  [body('name').notEmpty().withMessage('Folder name is required')],
  validate,
  updateFolder
);

router.get('/:folderId', getFolder);
router.delete('/:folderId', deleteFolder);
router.post('/:folderId/empty', emptyFolder);

module.exports = router;
