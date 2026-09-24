const { wrapAll } = require('../utils/asyncHandler');
const prisma = require('../db');

const getDashboardStats = async (req, res) => {
  const totalProjects = await prisma.project.count();
  const totalAdmins = await prisma.admin.count();

  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: {
        select: { questions: true }
      }
    }
  });

  const projectStats = projects.map(p => ({
    projectId: String(p.id),
    projectName: p.name,
    questionCount: p._count.questions
  }));

  const projectGrowth = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    d.setHours(23, 59, 59, 999);
    
    const count = projects.filter(p => new Date(p.createdAt) <= d).length;
    
    projectGrowth.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: count
    });
  }

  res.json({
    totalProjects,
    totalAdmins,
    projectStats,
    projectGrowth
  });
};

module.exports = wrapAll({ getDashboardStats });
