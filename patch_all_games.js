const fs = require('fs');
const path = require('path');

const basePath = 'g:/Ishuu/Admin project_company_ready/apps/web/public/games-static';
const games = fs.readdirSync(basePath);

const injectedScript = `<script>
      const __originalFetch = window.fetch;
      window.fetch = async function() {
        let url = arguments[0];
        if (typeof url === 'string' && url.includes('/quiz') && url.includes('projects')) {
            const api = new URLSearchParams(window.location.search).get("api");
            const slug = new URLSearchParams(window.location.search).get("slug");
            if (api && slug) {
                arguments[0] = api.replace(/\\/+$/, '') + "/api/public/projects/" + slug + "/quiz";
            }
        }
        
        const response = await __originalFetch.apply(this, arguments);
        const clone = response.clone();
        
        response.json = async function() {
            const data = await clone.json();
            if (data && data.data && Array.isArray(data.data)) {
                data.data.forEach(q => {
                    if (Array.isArray(q.options)) q.options.sort(() => Math.random() - 0.5);
                });
            } else if (Array.isArray(data)) {
                data.forEach(q => {
                    if (Array.isArray(q.options)) q.options.sort(() => Math.random() - 0.5);
                });
            }
            return data;
        };
        return response;
      };
    </script>`;

for (const game of games) {
    const indexPath = path.join(basePath, game, 'index.html');
    if (!fs.existsSync(indexPath)) continue;
    
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Remove old __originalFetch block if it exists
    html = html.replace(/<script>\s*const __originalFetch[\s\S]*?<\/script>/, '');
    
    // Insert new block right after <head>
    html = html.replace('<head>', '<head>\n    ' + injectedScript);
    
    fs.writeFileSync(indexPath, html);
    console.log('Patched', game);
}
