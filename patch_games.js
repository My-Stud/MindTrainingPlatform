const fs = require('fs');
const path = require('path');
const gamesDir = 'g:/Ishuu/Admin project_company_ready/apps/web/public/games-static';
const games = fs.readdirSync(gamesDir);
const scriptStr = `
    <script>
      const __originalFetch = window.fetch;
      window.fetch = function() {
        let url = arguments[0];
        if (typeof url === 'string' && url.includes('/quiz') && url.includes('projects')) {
            const api = new URLSearchParams(window.location.search).get("api");
            const slug = new URLSearchParams(window.location.search).get("slug");
            if (api && slug) {
                arguments[0] = api + "/api/public/projects/" + slug + "/quiz";
            }
        }
        return __originalFetch.apply(this, arguments);
      };
    </script>
`;

for (const game of games) {
  const indexHtmlPath = path.join(gamesDir, game, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let content = fs.readFileSync(indexHtmlPath, 'utf8');
    if (!content.includes('__originalFetch')) {
      content = content.replace(/<head>/i, '<head>' + scriptStr);
      fs.writeFileSync(indexHtmlPath, content);
      console.log('Patched locally:', game);
    }
  }
}
