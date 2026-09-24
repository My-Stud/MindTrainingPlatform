const prisma = require('../db');
const { wrapAll } = require('../utils/asyncHandler');

// @desc    Get all folders for a project
// @route   GET /api/projects/:id/folders
// @access  Private
const getFolders = async (req, res) => {
  const projectId = Number(req.params.id);
  const folders = await prisma.folder.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ folders });
};

// @desc    Create a new folder
// @route   POST /api/projects/:id/folders
// @access  Private
const createFolder = async (req, res) => {
  const projectId = Number(req.params.id);
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Folder name is required' });

  const folder = await prisma.folder.create({
    data: { name, projectId },
  });
  res.status(201).json(folder);
};

// @desc    Update a folder
// @route   PUT /api/folders/:folderId
// @access  Private
const updateFolder = async (req, res) => {
  const folderId = Number(req.params.folderId);
  const { name } = req.body;
  
  if (!name) return res.status(400).json({ message: 'Folder name is required' });

  const updated = await prisma.folder.update({
    where: { id: folderId },
    data: { name },
  });
  res.json(updated);
};

// @desc    Delete a folder
// @route   DELETE /api/folders/:folderId
// @access  Private
const deleteFolder = async (req, res) => {
  const folderId = Number(req.params.folderId);
  await prisma.folder.delete({ where: { id: folderId } });
  res.json({ message: 'Folder deleted' });
};

// @desc    Empty a folder (delete all questions inside it)
// @route   POST /api/folders/:folderId/empty
// @access  Private
const emptyFolder = async (req, res) => {
  const folderId = Number(req.params.folderId);
  await prisma.question.deleteMany({ where: { folderId } });
  res.json({ message: 'Folder emptied' });
};


const getFolder = async (req, res) => {
  const folder = await prisma.folder.findUnique({
    where: { id: Number(req.params.folderId) }
  });
  if (!folder) {
    return res.status(404).json({ message: 'Folder not found' });
  }
  res.json(folder);
};

module.exports = wrapAll({
  getFolder, getFolders, createFolder, updateFolder, deleteFolder, emptyFolder });
