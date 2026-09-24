const fs = require('fs');
const path = 'g:/Ishuu/Admin project_company_ready/apps/web/src/app/games/[slug]/page.js';
let content = fs.readFileSync(path, 'utf8');

const injection = `
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
`;

if (!content.includes('const [viewportHeight')) {
  content = content.replace(
    'const iframeRef = useRef(null);',
    'const iframeRef = useRef(null);' + injection
  );
  fs.writeFileSync(path, content);
  console.log('Injected viewportHeight');
} else {
  console.log('Already injected');
}
