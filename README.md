# AGHANIYA - Bank DSA Web Application

A modern, responsive web application for a Bank Direct Selling Agent (DSA) platform built with React, TypeScript, Vite, and Shadcn UI.

## Features

- **Landing Page** with animated banner slider
- **Loan Categories**:
  - Home Loan
  - Personal Loan
  - Business Loan
  - Education Loan
  - Car Loan
  - Gold Loan
  - Loan against Property
- **Credit Cards** section with multiple card options
- **EMI Calculator** with interactive sliders
- **About Us** page with company information
- **Contact Us** page with contact form
- **Bank Partners** section showcasing partner institutions

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Navigation
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages** in your repository settings:
   - Go to your repository on GitHub
   - Click on **Settings** tab
   - Scroll down to **Pages** section in the left sidebar
   - Under **Build and deployment**:
     - **Source**: Select **"GitHub Actions"**
   - Save the settings
   
   **Note**: The workflow includes `enablement: true` which should automatically enable Pages, but if you encounter the "Get Pages site failed" error, manually enable Pages in repository settings first.

2. **Configure Base Path** (if needed):
   - If your repository name is `username.github.io`, the app will be served from the root
   - For project repositories, update the `VITE_BASE_PATH` in `.github/workflows/deploy.yml` to match your repository name
   - Example: If your repo is `my-username/my-repo`, set `VITE_BASE_PATH: /my-repo/`

3. **Push to main branch**:
   - The workflow will automatically build and deploy your application
   - The deployment will be available at: `https://yourusername.github.io/repository-name/`
   - **SPA Routing**: The workflow automatically generates a `404.html` file to support client-side routing
   - All routes including admin routes (`/admin/login`, `/admin/dashboard`) will work correctly

4. **Check deployment status**:
   - Go to the Actions tab in your GitHub repository
   - Monitor the "Deploy to GitHub Pages" workflow
   - Verify that `404.html` is generated in the build artifacts

**Note**: The `404.html` file is automatically generated during build to handle SPA routing on GitHub Pages. This ensures that direct URL access to any route (including admin routes) works correctly.

### Troubleshooting

If you encounter the error: `"Get Pages site failed. Please verify that the repository has Pages enabled"`:

1. **Manually enable GitHub Pages**:
   - Go to your repository → Settings → Pages
   - Under "Build and deployment", select "GitHub Actions" as the source
   - Click Save

2. **Check repository permissions**:
   - Ensure the GitHub Actions has the necessary permissions
   - The workflow requires `pages: write` and `id-token: write` permissions (already configured)

3. **Verify workflow file**:
   - Ensure `.github/workflows/deploy.yml` is committed to the repository
   - The workflow should trigger on push to `main` branch

4. **Run the workflow**:
   - After enabling Pages, the workflow should run automatically on the next push
   - Or manually trigger it from the Actions tab → "Deploy to GitHub Pages" → "Run workflow"

### Manual Deployment

If you prefer to deploy manually:
```bash
# Build the project
npm run build

# The dist folder contains the production build
# Upload the contents to your hosting provider
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── layout/          # Header and Footer
│   ├── BannerSlider.tsx # Banner carousel component
│   └── LoanForm.tsx     # Reusable loan application form
├── pages/
│   ├── Home.tsx         # Landing page
│   ├── About.tsx        # About Us page
│   ├── Contact.tsx      # Contact Us page
│   ├── Loans.tsx        # Loans listing page
│   ├── LoanDetail.tsx   # Individual loan detail page
│   ├── CreditCards.tsx  # Credit cards page
│   └── EMICalculator.tsx # EMI calculator page
├── lib/
│   └── utils.ts         # Utility functions
└── App.tsx              # Main app component with routing
```

## Pages

- `/` - Landing page with banners and loan categories
- `/loans` - All loan types overview
- `/loans/:loanType` - Individual loan application form
- `/credit-cards` - Credit card listings and application
- `/about` - About Us page
- `/contact` - Contact Us page with form
- `/emi-calculator` - EMI calculator tool
- `/cibil-check` - CIBIL score checker
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard for managing leads

## Loan Types

1. **Home Loan** - For purchasing or constructing your dream home
2. **Personal Loan** - Flexible personal financing
3. **Business Loan** - Business expansion and working capital
4. **Education Loan** - Higher education financing
5. **Car Loan** - New and used car financing
6. **Gold Loan** - Loans against gold
7. **Loan against Property** - High-value property-backed loans

## Bank Partners

The platform features partnerships with leading financial institutions including:
- Bajaj Finserv
- HDFC Bank
- ICICI Bank
- Axis Bank
- SBI
- Kotak Bank
- RBL Bank
- And many more...

## Features

- ✅ Responsive design for all screen sizes
- ✅ Modern UI with Shadcn components
- ✅ Interactive EMI calculator
- ✅ Form validation
- ✅ Animated banner slider
- ✅ Type-safe with TypeScript
- ✅ Fast development with Vite
- ✅ Admin panel for lead management
- ✅ CIBIL score checker
- ✅ Lead management system with categories
- ✅ SPA routing support for GitHub Pages

## Admin Panel

The application includes a fully functional admin panel for managing leads:

- **Login**: Navigate to `/admin/login` (default password: `admin123`)
- **Dashboard**: View and manage all leads by category
- **Features**:
  - View leads by category (Home Loan, Personal Loan, Credit Cards, CIBIL Check, etc.)
  - Export leads as JSON
  - Delete individual leads
  - Expand lead details
  - Add dummy data for testing
  - Real-time statistics

### Admin Routes
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Lead management dashboard

## License

This project is private and proprietary.
