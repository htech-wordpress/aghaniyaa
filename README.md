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
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"

2. **Configure Base Path** (if needed):
   - If your repository name is `username.github.io`, the app will be served from the root
   - For project repositories, update the `VITE_BASE_PATH` in `.github/workflows/deploy.yml` to match your repository name
   - Example: If your repo is `my-username/my-repo`, set `VITE_BASE_PATH: /my-repo/`

3. **Push to main branch**:
   - The workflow will automatically build and deploy your application
   - The deployment will be available at: `https://yourusername.github.io/repository-name/`

4. **Check deployment status**:
   - Go to the Actions tab in your GitHub repository
   - Monitor the "Deploy to GitHub Pages" workflow

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

## License

This project is private and proprietary.
