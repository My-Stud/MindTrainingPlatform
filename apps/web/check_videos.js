const countries = [
  'afghanistan', 'armenia', 'azerbaijan', 'bahrain', 'bangladesh', 'bhutan', 'brunei', 'cambodia', 'china', 'cyprus',
  'georgia', 'india', 'indonesia', 'iran', 'iraq', 'israel', 'japan', 'jordan', 'kazakhstan', 'kuwait', 'kyrgyzstan',
  'laos', 'lebanon', 'malaysia', 'maldives', 'mongolia', 'myanmar', 'nepal', 'north-korea', 'oman', 'pakistan',
  'palestine', 'philippines', 'qatar', 'russia', 'saudi-arabia', 'singapore', 'south-korea', 'sri-lanka', 'syria',
  'taiwan', 'tajikistan', 'thailand', 'timor-leste', 'turkey', 'turkmenistan', 'united-arab-emirates', 'uzbekistan',
  'vietnam', 'yemen', 'north_korea', 'south_korea', 'sri_lanka', 'timor_leste', 'united_arab_emirates'
];

async function check() {
  const existing = [];
  for (const c of countries) {
    const url = `https://Viebrain-Videos.b-cdn.net/ASIA/${c}-1.mp4`;
    try {
      const r = await fetch(url, {method: 'HEAD'});
      if (r.status === 200) {
        existing.push(c);
        console.log(c);
      }
    } catch(e) {}
  }
  require('fs').writeFileSync('asian_videos.json', JSON.stringify(existing));
}
check();
