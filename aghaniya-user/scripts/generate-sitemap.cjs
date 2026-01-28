const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Configuration
// Configuration
const DOMAIN = 'https://aghaniyaenterprises.com';
const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, '../../aghaniya-enterprises-llp-firebase-adminsdk-fbsvc-7da55bfd2b.json');
const DIST_DIR = path.resolve(__dirname, '../dist');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Initialize Firebase Admin
try {
  if (!admin.apps.length) {
    if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
      const serviceAccount = require(SERVICE_ACCOUNT_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || 'https://aghaniya-enterprises-llp-default-rtdb.firebaseio.com'
      });
      console.log('Firebase Admin initialized successfully.');
    } else {
      console.warn('Service account key not found. Skipping dynamic sitemap generation.');
      process.exit(0);
    }
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

// Static Routes
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/loans', priority: '0.9', changefreq: 'weekly' },
  { path: '/emi-calculator', priority: '0.7', changefreq: 'monthly' },
  { path: '/cibil-check', priority: '0.7', changefreq: 'monthly' },
  { path: '/our-team', priority: '0.6', changefreq: 'monthly' },
  { path: '/careers', priority: '0.6', changefreq: 'monthly' },
  { path: '/testimonials', priority: '0.6', changefreq: 'monthly' },
  { path: '/partners', priority: '0.6', changefreq: 'monthly' }
];

async function generateSitemap() {
  try {
    console.log('Fetching dynamic paths from Firebase...');
    const db = admin.database();

    // Fetch Loan Products
    // Based on stats.ts structure: companyStats -> loanProducts
    const snapshot = await db.ref('companyStats/loanProducts').once('value');
    const loanProducts = snapshot.val() || [];

    console.log(`Found ${Object.keys(loanProducts).length} loan products.`); // loanProducts might be an array or object

    let dynamicRoutes = [];

    // Handle if it's an array or object map
    const productsList = Array.isArray(loanProducts) ? loanProducts : Object.values(loanProducts);

    productsList.forEach(product => {
      if (product && product.id) {
        dynamicRoutes.push({
          path: `/loans/${product.id}`,
          priority: '0.9',
          changefreq: 'weekly'
        });
      }
    });

    const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const robotsContent = `User-agent: *
Allow: /
Sitemap: ${DOMAIN}/sitemap.xml
`;

    // Ensure output directories exist
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // Write to DIST (for production)
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
    fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsContent);

    // Optionally write to PUBLIC (for dev consistency, though not strictly required if only running post-build)
    // fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapContent);
    // fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsContent);

    console.log('✅ Sitemap and robots.txt generated successfully in dist/');
    process.exit(0);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
