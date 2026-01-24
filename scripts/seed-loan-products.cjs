
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://aghaniya-default-rtdb.firebaseio.com"
    });
}

const db = admin.database();

const defaultFeatures = ['Quick Approval', 'Competitive Rates', 'Flexible Tenure', 'Minimal Documentation'];
const defaultEligibility = ['Age: 21-65 years', 'Min Income: ₹25,000/month', 'CIBIL Score: 700+'];
const defaultDocuments = ['KYC Documents', 'Actionable Income Proof', 'Bank Statements'];

const defaultStats = {
    experience: '10+',
    partners: '10+',
    cities: '10+',
    loansDisbursed: '₹100 Cr+',
    addresses: [
        {
            id: '1',
            label: 'Head Office',
            value: 'Aghaniya Enterprises LLP, Sohrab Hall, 2nd Floor, Near Pune Station, Pune - 411001, India',
            mapLink: 'https://www.google.com/maps/dir//Sohrab+Hall,+Tadiwala+Rd,+Sangamvadi,+Pune,+Maharashtra+411001',
            phone: '+91 70585 19247'
        }
    ],
    loanProducts: [
        { id: 'home-loan', title: 'Home Loan', description: 'Your Dream Home Awaits - Explore Our Range Of Home Loan Products.', iconName: 'Home', interestRate: '8.50 % P.A*', features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: '/loans/home-loan' },
        { id: 'personal-loan', title: 'Personal Loan', description: 'Achieve your dreams with our versatile personal loan options.', iconName: 'Briefcase', interestRate: '10.99 % P.A*', features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: '/loans/personal-loan' },
        { id: 'business-loan', title: 'Business Loan', description: 'Boost your business growth with our flexible financing options.', iconName: 'Building2', interestRate: '12.00 % P.A*', features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: '/loans/business-loan' },
        { id: 'lap', title: 'LAP', description: 'Unlock your property\'s value with tailored loan solutions.', iconName: 'Landmark', interestRate: '9.25 % P.A*', features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: '/loans/lap' },
        { id: 'education-loan', title: 'Education Loan', description: 'Invest in your child\'s future with our specialized education loans.', iconName: 'GraduationCap', interestRate: '9.50 % P.A*', features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: '/loans/education-loan' },
        { id: 'auto-loan', title: 'Auto Loan', description: 'Drive your dream car with our quick and flexible car loans.', iconName: 'Car', interestRate: '8.75 % P.A*', features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: '/loans/auto-loan' },
        { id: 'gold-loan', title: 'Gold loan', description: 'Meet your financial needs with gold loans from trusted banks.', iconName: 'Gem', interestRate: '9.00 % P.A*', features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: '/loans/gold-loan' },
        { id: 'doctor-loan', title: 'Doctor Loan', description: 'Specialized loans for medical professionals.', iconName: 'Stethoscope', interestRate: 'Custom', features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: '/loans/doctor-loan' },
        { id: 'unsecured-dod', title: "Unsecured DoD", description: "Flexible credit for daily operational needs.", iconName: "Shield", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/unsecured-dod" },
        { id: 'od-flexi', title: "OD-Flexi", description: "Overdraft facility with flexible repayment.", iconName: "Wallet", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/od-flexi" },
        { id: 'top-up-hl', title: "Top Up-HL", description: "Additional funding on your existing home loan.", iconName: "Home", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/top-up-hl" },
        { id: 'secured-dod', title: "Secured DoD", description: "Secured Dropline Overdraft for businesses.", iconName: "Shield", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/secured-dod" },
        { id: 'insurance', title: "Insurance", description: "Comprehensive insurance products.", iconName: "Shield", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/insurance" },
        { id: 'nrp', title: "NRP", description: "Non-Residential Premises loan.", iconName: "Banknote", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/nrp" },
        { id: 'hybrid-flexi', title: "Hybrid Flexi", description: "Hybrid flexible loan options.", iconName: "Wallet", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/hybrid-flexi" },
        { id: 'used-commercial-vehicle-loans', title: "Used Commercial Vehicle Loans", description: "Finance for pre-owned commercial vehicles.", iconName: "Truck", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/used-commercial-vehicle-loans" },
        { id: 'bt-lap', title: "BT-LAP", description: "Balance Transfer for Loan Against Property.", iconName: "Landmark", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/bt-lap" },
        { id: 'new-car-loan', title: "New Car Loan", description: "Get the car you've always wanted.", iconName: "Car", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/new-car-loan" },
        { id: 'top-up-lap', title: "Top Up-LAP", description: "Additional funds on Loan Against Property.", iconName: "Landmark", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/top-up-lap" },
        { id: 'term-loan', title: "Term Loan", description: "Fixed tenure loans for business expansion.", iconName: "Banknote", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/term-loan" },
        { id: 'cc-limit', title: "CC Limit", description: "Cash Credit limit for working capital.", iconName: "CreditCard", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/cc-limit" },
        { id: 'stpl', title: "STPL", description: "Short Term Personal Loan.", iconName: "Briefcase", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/stpl" },
        { id: 'stsl-lap', title: "STSL-LAP", description: "Short Term Secured Loan against Property.", iconName: "Landmark", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/stsl-lap" },
        { id: 'secured-od', title: "Secured OD", description: "Secured Overdraft facility.", iconName: "Wallet", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/secured-od" },
        { id: 'blse', title: "BLSE", description: "Business Loan for Self Employed.", iconName: "Building2", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/blse" },
        { id: 'lap-dod', title: "LAP-DoD", description: "LAP Dropline Overdraft.", iconName: "Landmark", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/lap-dod" },
        { id: 'msme-lap', title: "MSME-LAP", description: "Loan Against Property for MSMEs.", iconName: "Factory", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/msme-lap" },
        { id: 'used-auto-loan', title: "Used Auto Loan", description: "Finance for used cars.", iconName: "Car", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/used-auto-loan" },
        { id: 'affordable-hl', title: "Affordable - HL", description: "Affordable housing loans.", iconName: "Home", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/affordable-hl" },
        { id: 'od-bl', title: "OD-BL", description: "Overdraft for Business Loan.", iconName: "Wallet", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/od-bl" },
        { id: 'new-construction-equipments-loan', title: "New Construction Equipments Loan", description: "Finance for construction equipment.", iconName: "Construction", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/new-construction-equipments-loan" },
        { id: 'machinery-loan', title: "Machinery loan", description: "Finance for industrial machinery.", iconName: "Factory", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/machinery-loan" },
        { id: 'commercial', title: "Commercial", description: "Commercial property loans.", iconName: "Building2", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/commercial" },
        { id: 'unsecured-od', title: "Unsecured OD", description: "Unsecured Overdraft facility.", iconName: "Wallet", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/unsecured-od" },
        { id: 'sme-loan', title: "SME Loan", description: "Loans for Small and Medium Enterprises.", iconName: "Building2", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/sme-loan" },
        { id: 'corporate-finance-products', title: "Corporate Finance Products", description: "Solutions for corporate financial needs.", iconName: "Building2", features: defaultFeatures, eligibility: defaultEligibility, documents: defaultDocuments, route: "/loans/corporate-finance-products" }
    ]
};

async function seedProducts() {
    try {
        console.log('Seeding company stats with loan products...');
        await db.ref('settings/companyStats').set(defaultStats);
        console.log('Successfully seeded database!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedProducts();
