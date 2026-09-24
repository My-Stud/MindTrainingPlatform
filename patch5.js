const fs = require('fs');
const path = 'g:/Ishuu/Admin project_company_ready/apps/web/src/app/games/[slug]/page.js';
let content = fs.readFileSync(path, 'utf8');

const stateInjection = `    const [key, setKey] = useState(0);
    const iframeRef = useRef(null);
    const [viewportHeight, setViewportHeight] = useState(0);

    useEffect(() => {
      const updateHeight = () => setViewportHeight(window.innerHeight);
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }, []);
`;
content = content.replace('    const [key, setKey] = useState(0);\r\n    const iframeRef = useRef(null);', stateInjection);
content = content.replace('    const [key, setKey] = useState(0);\n    const iframeRef = useRef(null);', stateInjection);

content = content.replace(
  /<div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 [^"]*">/g,
  '<div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 w-full flex flex-col min-h-0" style={{ height: viewportHeight > 0 ? `${viewportHeight - 80}px` : \'100vh\' }}>'
);

fs.writeFileSync(path, content);
console.log("Patched page.js with innerHeight");
