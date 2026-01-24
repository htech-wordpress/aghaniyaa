import {
    Home,
    Building2,
    Briefcase,
    GraduationCap,
    Car,
    Gem,
    Landmark,
    Shield,
    Wallet,
    Banknote,
    CreditCard,
    Stethoscope,
    Factory,
    Truck,
    Construction,
    Globe
} from 'lucide-react';

export interface LoanOption {
    id: string;
    title: string;
    description: string;
    icon: any;
    category: string;
    features?: string[];
    eligibility?: string[];
    documents?: string[];
    interestRate?: string;
}

const generateId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const genericFeatures = ['Quick Disbursal', 'Minimal Documentation', 'Competitive Interest Rates', 'Flexible Tenure'];
const genericEligibility = ['Age: 21-60 years', 'CIBIL Score: 700+', 'Stable Income Source'];
const genericDocuments = ['KYC Documents', 'Bank Statements (Last 6 Months)', 'Income Proof'];

const descriptions: Record<string, string> = {
    'home-loan': 'Your Dream Home Awaits - Explore Our Range Of Home Loan Products. Get the best interest rates and flexible repayment options.',
    'lap': 'Unlock your property\'s value with tailored loan solutions. Get high-value loans at competitive interest rates.',
    'personal-loan': 'Achieve your dreams with our versatile personal loan options. No collateral required, quick approval.',
    'business-loan': 'Boost your business growth with our flexible financing options. Working capital and expansion loans available.',
    'education-loan': 'Invest in your child\'s future with our specialized education loans. Cover tuition fees and living expenses.',
    'auto-loan': 'Drive your dream car with our quick and flexible car loans. Available for both new and used cars.',
    'gold-loan': 'Meet your financial needs with gold loans from trusted banks. Instant disbursal with minimum documentation.',
};

export const loanOptions: LoanOption[] = [
    {
        title: "Home Loan",
        icon: Home,
        category: "home",
        features: ['Interest Rates starting @ 8.50%', 'Tenure up to 30 years', 'No Hidden Charges', 'Doorstep Service'],
        eligibility: ['Salaried / Self-Employed', 'Age 21-65', 'Credit Score > 700'],
        documents: ['Identity Proof (Aadhar/PAN)', 'Address Proof', 'Salary Slips / ITR', 'Property Documents']
    },
    {
        title: "Personal Loan",
        icon: Briefcase,
        category: "personal",
        features: ['Instant Approval', 'No Collateral Required', 'Flexible Repayment (12-60 months)', 'Paperless Process'],
        eligibility: ['Min Salary: ₹25,000', 'Age 21-58', 'Work Experience: 2+ Years'],
        documents: ['PAN Card', 'Aadhar Card', 'Last 3 Months Bank Statement', 'Salary Slips']
    },
    {
        title: "Business Loan",
        icon: Building2,
        category: "business",
        features: ['Loans up to ₹5 Crores', 'Collateral-free options available', 'Overdraft Facility', 'Flexible EMI'],
        eligibility: ['Business Vintage > 3 Years', 'Turnover > ₹40 Lakhs', 'Profitable Business'],
        documents: ['GST Returns', 'Audited Financials', 'KYC of Directors', 'Business Proof']
    },
    {
        title: "LAP",
        icon: Landmark,
        category: "property",
        features: ['High LTV Ratio', 'Low Interest Rates', 'Longer Tenure (up to 15 years)', 'Use funds for any purpose'],
        eligibility: ['Property should be free of disputes', 'Income sufficiency', 'Good Credit History'],
        documents: ['Property Papers', 'Income Proof', 'KYC', 'Bank Statements']
    },
    {
        title: "Education Loan",
        icon: GraduationCap,
        category: "education",
        features: ['Up to 100% Financing', 'Moratorium Period available', 'Tax Benefits under Sec 80E', 'Co-applicant required'],
        eligibility: ['Confirmed Admission', 'Co-applicant Income', 'Academic Record'],
        documents: ['Admission Letter', 'Fee Structure', 'KYC of Student & Parent', 'Income Proof of Parent']
    },
    {
        title: "Auto Loan",
        icon: Car,
        category: "vehicle",
        features: ['Up to 100% On-Road Funding', 'Attractive Rates', 'Tenure up to 7 Years', 'Pre-approved offers'],
        eligibility: ['Salaried / Business', 'Age 21+', 'Income > ₹3 Lakhs p.a.'],
        documents: ['KYC', 'Income Proof', 'Vehicle Quotation', 'Bank Statements']
    },
    {
        title: "Gold loan",
        icon: Gem,
        category: "gold",
        features: ['Instant Cash', 'Rate per gram as per market', 'Pay only Interest option', 'Safety of Ornaments'],
        eligibility: ['Age 18+', 'Owner of Gold Ornaments'],
        documents: ['KYC Only']
    },
    { title: "Doctor Loan", icon: Stethoscope, category: "professional" },

    { title: "Unsecured DoD", icon: Shield, category: "business" },
    { title: "OD-Flexi", icon: Wallet, category: "business" },
    { title: "Top Up-HL", icon: Home, category: "home" },
    { title: "Secured DoD", icon: Shield, category: "business" },
    { title: "Insurance", icon: Shield, category: "insurance" },
    { title: "NRP", icon: Banknote, category: "other" },
    { title: "Hybrid Flexi", icon: Wallet, category: "other" },
    { title: "Used Commercial Vehicle Loans", icon: Truck, category: "vehicle" },
    { title: "BT-LAP", icon: Landmark, category: "property" },
    { title: "New Car Loan", icon: Car, category: "vehicle" },
    { title: "Top Up-LAP", icon: Landmark, category: "property" },
    { title: "Term Loan", icon: Banknote, category: "business" },
    { title: "CC Limit", icon: CreditCard, category: "credit" },
    { title: "STPL", icon: Briefcase, category: "personal" },
    { title: "STSL-LAP", icon: Landmark, category: "property" },
    { title: "Secured OD", icon: Wallet, category: "business" },
    { title: "BLSE", icon: Building2, category: "business" },
    { title: "LAP-DoD", icon: Landmark, category: "property" },
    { title: "MSME-LAP", icon: Factory, category: "business" },
    { title: "Used Auto Loan", icon: Car, category: "vehicle" },
    { title: "Affordable - HL", icon: Home, category: "home" },
    { title: "OD-BL", icon: Wallet, category: "business" },
    { title: "New Construction Equipments Loan", icon: Construction, category: "vehicle" },
    { title: "HLC", icon: Home, category: "home" },
    { title: "WC", icon: Banknote, category: "business" },
    { title: "HLUC", icon: Home, category: "home" },
    { title: "OD-PL", icon: Wallet, category: "personal" },
    { title: "Machinery loan", icon: Factory, category: "business" },
    { title: "Commercial", icon: Building2, category: "business" },
    { title: "VPL", icon: Car, category: "vehicle" },
    { title: "Unsecured OD", icon: Wallet, category: "business" },
    { title: "TOP UP-PL", icon: Briefcase, category: "personal" },
    { title: "LAS (Loan Against Securities)", icon: Banknote, category: "other" },
    { title: "Canada - Bridge financing", icon: Globe, category: "international" },
    { title: "STL-LAP", icon: Landmark, category: "property" },
    { title: "LAP-Vishwas", icon: Landmark, category: "property" },
    { title: "MSME", icon: Factory, category: "business" },
    { title: "Professional Loan", icon: Briefcase, category: "professional" },
    { title: "CCBG-LAP", icon: Landmark, category: "property" },
    { title: "HL-OD", icon: Home, category: "home" },
    { title: "New Commercial Vehicle Loan", icon: Truck, category: "vehicle" },
    { title: "BT-PL", icon: Briefcase, category: "personal" },
    { title: "LRD", icon: Building2, category: "property" },
    { title: "Charge to Customer", icon: Banknote, category: "other" },
    { title: "Canada - Renewal", icon: Globe, category: "international" },
    { title: "SME Loan", icon: Building2, category: "business" },
    { title: "Corporate Finance Products", icon: Building2, category: "business" },
    { title: "STBL", icon: Building2, category: "business" },
    { title: "STSL-HL", icon: Home, category: "home" },
    { title: "RB-LAP", icon: Landmark, category: "property" },
    { title: "Used Construction Equipments Loan", icon: Construction, category: "vehicle" },
    { title: "BT TOP UP-HL", icon: Home, category: "home" },
    { title: "STL-HL", icon: Home, category: "home" },
    { title: "Home Start", icon: Home, category: "home" },
].map(opt => {
    const id = generateId(opt.title);
    return {
        ...opt,
        id,
        description: descriptions[id] || `Apply for ${opt.title} with Aghaniya Enterprises LLP. Quick approval and competitive rates.`,
        features: opt.features || genericFeatures,
        eligibility: opt.eligibility || genericEligibility,
        documents: opt.documents || genericDocuments,
    };
});
