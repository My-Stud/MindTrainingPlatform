const fs = require('fs');
let content = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/admin/backend/src/controllers/dashboardController.js', 'utf8');
content = content.replace(
  /require\('\.\.\/utils\/wrapAll'\)/,
  'require(\'../utils/asyncHandler\')'
);
fs.writeFileSync('g:/Ishuu/Admin project_company_ready/apps/admin/backend/src/controllers/dashboardController.js', content);
