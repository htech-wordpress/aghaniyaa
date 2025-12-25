# AGHANIYA - Bank DSA Web Application

A modern, responsive customer-facing web application for a Bank Direct Selling Agent (DSA) platform built with React, TypeScript, Vite, and Shadcn UI.

> **Note**: This is the customer-facing application. For the admin panel, see the `aghaniya-admin` project.

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
- **CIBIL Check** for credit score checking
- **About Us** page with company information
- **Contact Us** page with contact form
- **Our Team** page
- **Careers** page for job applications
- **Bank Partners** section showcasing partner institutions

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Navigation
- **Lucide React** - Icons
- **Firebase** - Backend (Firestore for data storage)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Deployment to GitHub Pages

> For Firebase Hosting multi-site deploys (admin + user), see `DEPLOYMENT.md` for target setup and `firebase target:apply` examples.

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

4. **Check deployment status**:
   - Go to the Actions tab in your GitHub repository
   - Monitor the "Deploy to GitHub Pages" workflow
   - Verify that `404.html` is generated in the build artifacts

**Note**: The `404.html` file is automatically generated during build to handle SPA routing on GitHub Pages.

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
│   ├── LoanForm.tsx     # Reusable loan application form
│   ├── WhatsAppButton.tsx # WhatsApp contact button
│   └── ...
├── pages/
│   ├── Home.tsx         # Landing page
│   ├── About.tsx        # About Us page
│   ├── Contact.tsx      # Contact Us page
│   ├── Loans.tsx        # Loans listing page
│   ├── LoanDetail.tsx   # Individual loan detail page
│   ├── CreditCards.tsx  # Credit cards page
│   ├── EMICalculator.tsx # EMI calculator page
│   ├── CibilCheck.tsx   # CIBIL checker page
│   ├── OurTeam.tsx      # Team page
│   └── Careers.tsx      # Careers page
├── lib/
│   ├── firebase.ts      # Firebase configuration
│   ├── leads.ts         # Lead management functions
│   └── utils.ts         # Utility functions
└── App.tsx              # Main app component with routing
```

## Pages

- `/` - Landing page with banners and loan categories
- `/about` - About Us page
- `/contact` - Contact Us page with form
- `/loans` - All loan types overview
- `/loans/:loanType` - Individual loan application form
- `/credit-cards` - Credit card listings and application
- `/emi-calculator` - EMI calculator tool
- `/cibil-check` - CIBIL score checker
- `/our-team` - Our team page
- `/careers` - Careers and job application page

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
- ✅ CIBIL score checker
- ✅ Lead submission to Firebase
- ✅ SPA routing support for GitHub Pages
- ✅ WhatsApp integration

## Admin Panel

For managing leads, users, and settings, see the separate **aghaniya-admin** project in the `aghaniya-admin` folder.

## License

This project is private and proprietary.

