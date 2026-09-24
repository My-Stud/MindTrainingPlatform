const fs = require('fs');
let content = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/admin/backend/src/routes/dashboardRoutes.js', 'utf8');
content = content.replace(
  /require\('\.\.\/middleware\/authMiddleware'\)/,
  'require(\'../middleware/auth\')'
);
fs.writeFileSync('g:/Ishuu/Admin project_company_ready/apps/admin/backend/src/routes/dashboardRoutes.js', content);
