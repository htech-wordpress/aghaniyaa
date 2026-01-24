const fs = require('fs');
const path = require('path');

// Paths
const logosDir = path.join(__dirname, '../public/logos');
const readmePath = path.join(__dirname, '../../indian-banks/README.md');

// 1. Parse README for Bank Name -> Slug mapping
let slugMap = {};
try {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    const lines = readmeContent.split('\n');
    lines.forEach(line => {
        // Regex to match table row: | Bank Name | `slug` | ...
        const match = line.match(/\|\s*(.+?)\s*\|\s*`(.+?)`\s*\|/);
        if (match) {
            const name = match[1].trim();
            const slug = match[2].trim();
            slugMap[name.toLowerCase()] = slug;
        }
    });
} catch (e) {
    console.error("Could not read README.md from " + readmePath);
}

// 2. Helper to find logo for a partner name
function findLogo(partnerName) {
    const pName = partnerName.toLowerCase();

    // Strategy 1: Exact/Fuzzy match against README names
    let slug = null;

    // Direct match
    if (slugMap[pName]) slug = slugMap[pName];

    // "Contains" match (README name inside Partner name or vice versa)
    if (!slug) {
        for (const [dbName, dbSlug] of Object.entries(slugMap)) {
            if (pName.includes(dbName) || dbName.includes(pName)) {
                slug = dbSlug;
                break;
            }
        }
    }

    // Strategy 2: Common Aliases (Manual overrides for tricky ones)
    if (!slug) {
        if (pName.includes('icici')) slug = 'icic';
        if (pName.includes('hdfc')) slug = 'hdfc';
        if (pName.includes('sbi') || pName.includes('state bank of india')) slug = 'sbin';
        if (pName.includes('axis')) slug = 'utib'; // UTIB is Axis
        if (pName.includes('kotak')) slug = 'kkbk';
        if (pName.includes('yes')) slug = 'yesb';
        if (pName.includes('indusind')) slug = 'indb';
        if (pName.includes('idfc')) slug = 'idfb';
        if (pName.includes('rbl')) slug = 'ratn';
        if (pName.includes('hsbc')) slug = 'hsbc';
        if (pName.includes('canara')) slug = 'cnrb';
        if (pName.includes('baroda')) slug = 'barb';
        if (pName.includes('union')) slug = 'ubin';
        if (pName.includes('punjab national')) slug = 'punb';
        if (pName.includes('idbi')) slug = 'ibkl';
        if (pName.includes('federal')) slug = 'fdrl';
        if (pName.includes('au small')) slug = 'aubl';
        if (pName.includes('ujjivan')) slug = 'ujvn';
        if (pName.includes('standard chartered')) slug = 'scbl';
        if (pName.includes('indian bank')) slug = 'idib';
        if (pName.includes('overseas')) slug = 'ioba';
        if (pName.includes('maharashtra')) slug = 'mahb';
        if (pName.includes('central bank')) slug = 'cbin';
        if (pName.includes('uco')) slug = 'ucba';
        if (pName.includes('punjab & sind')) slug = 'psib';
        if (pName.includes('city union')) slug = 'ciub';
        if (pName.includes('dhanlaxmi')) slug = 'dlxb';
        if (pName.includes('karnataka')) slug = 'karb';
        if (pName.includes('karur')) slug = 'kvbl';
        if (pName.includes('tamilnad')) slug = 'tmbl';
    }

    if (!slug) return null;

    // 3. Verify existence in public/logos/slug/[logo.svg|logo.png]
    const slugDir = path.join(logosDir, slug);
    // Check if directory exists
    if (fs.existsSync(slugDir) && fs.lstatSync(slugDir).isDirectory()) {
        if (fs.existsSync(path.join(slugDir, 'logo.svg'))) return `/logos/${slug}/logo.svg`;
        if (fs.existsSync(path.join(slugDir, 'logo.png'))) return `/logos/${slug}/logo.png`;
    }

    return null;
}


// 2. Define Data (Source copied from original file)
const topPartners = [
    { name: "Poonawalla Credit Pvt Ltd", color: "text-[#E31E24]", bgColor: "bg-[#FFF0F0]", borderColor: "border-[#E31E24]/20" },
    { name: "Abu Dhabi Islamic Bank", color: "text-[#D11242]", bgColor: "bg-[#FFF0F4]", borderColor: "border-[#D11242]/20" },
    { name: "ICICI BANK", color: "text-[#F37E20]", bgColor: "bg-[#FFF4EB]", borderColor: "border-[#F37E20]/20" },
    { name: "CHOLA MANDALAM BANK", color: "text-[#234A97]", bgColor: "bg-[#F0F6FF]", borderColor: "border-[#234A97]/20" },
    { name: "BAJAJ", color: "text-[#005DA0]", bgColor: "bg-[#EBF7FF]", borderColor: "border-[#005DA0]/20" },
    { name: "L&T", color: "text-[#FFE100]", bgColor: "bg-[#FFFFEB]", borderColor: "border-[#FFE100]/50" },
    { name: "Hero Housing Finance", color: "text-[#E31E24]", bgColor: "bg-[#FFF0F0]", borderColor: "border-[#E31E24]/20" },
    { name: "UGRO Capital Limited", color: "text-[#00AEEF]", bgColor: "bg-[#F0FAFF]", borderColor: "border-[#00AEEF]/20" },
    { name: "FULLERTON", color: "text-[#F68B1F]", bgColor: "bg-[#FFF6EB]", borderColor: "border-[#F68B1F]/20" },
    { name: "Piramal Housing Finance", color: "text-[#F37021]", bgColor: "bg-[#FFF4EC]", borderColor: "border-[#F37021]/20" },
    { name: "HDFC BANK", color: "text-[#004C8F]", bgColor: "bg-[#EBF4FF]", borderColor: "border-[#004C8F]/20" },
    { name: "AXIS BANK", color: "text-[#97144D]", bgColor: "bg-[#FFF0F5]", borderColor: "border-[#97144D]/20" },
    { name: "KOTAK BANK", color: "text-[#ED1C24]", bgColor: "bg-[#FFF0F0]", borderColor: "border-[#ED1C24]/20" },
    { name: "State Bank of India", color: "text-[#280071]", bgColor: "bg-[#F0F4FF]", borderColor: "border-[#280071]/20" },
    { name: "INDUSIND BANK", color: "text-[#8D0B12]", bgColor: "bg-[#FFF0F1]", borderColor: "border-[#8D0B12]/20" },
    { name: "YES", color: "text-[#005A9C]", bgColor: "bg-[#EBF6FF]", borderColor: "border-[#005A9C]/20" },
    { name: "IDFC", color: "text-[#9D1D27]", bgColor: "bg-[#FFF0F1]", borderColor: "border-[#9D1D27]/20" },
    { name: "Bank of Baroda", color: "text-[#F26522]", bgColor: "bg-[#FFF4EB]", borderColor: "border-[#F26522]/20" },
    { name: "Union Bank of India", color: "text-[#D61A22]", bgColor: "bg-[#FFF0F0]", borderColor: "border-[#D61A22]/20" },
    { name: "Punjab National Bank", color: "text-[#A40A26]", bgColor: "bg-[#FFF0F2]", borderColor: "border-[#A40A26]/20" },
    { name: "Canara Bank", color: "text-[#006C9B]", bgColor: "bg-[#EBF7FF]", borderColor: "border-[#006C9B]/20" },
    { name: "CITI BANK", color: "text-[#003B70]", bgColor: "bg-[#EBF4FF]", borderColor: "border-[#003B70]/20" },
    { name: "Standard Chartered Bank", color: "text-[#0074BC]", bgColor: "bg-[#F0F8FF]", borderColor: "border-[#0074BC]/20" },
    { name: "HSBC", color: "text-[#DB0011]", bgColor: "bg-[#FFF0F0]", borderColor: "border-[#DB0011]/20" },
    { name: "Deutsche Bank", color: "text-[#0018A8]", bgColor: "bg-[#EBF3FF]", borderColor: "border-[#0018A8]/20" },
    { name: "RBL", color: "text-[#00468C]", bgColor: "bg-[#EBF4FF]", borderColor: "border-[#00468C]/20" },
    { name: "Federal Bank", color: "text-[#E87722]", bgColor: "bg-[#FFF6EC]", borderColor: "border-[#E87722]/20" },
    { name: "IDBI Bank", color: "text-[#1F6E43]", bgColor: "bg-[#F0F9F4]", borderColor: "border-[#1F6E43]/20" },
    { name: "Bandhan Bank Limited", color: "text-[#ED1C24]", bgColor: "bg-[#FFF0F0]", borderColor: "border-[#ED1C24]/20" },
    { name: "AU Small Finance Bank", color: "text-[#622F89]", bgColor: "bg-[#F5F0FA]", borderColor: "border-[#622F89]/20" },
    { name: "Jana Small Finance Bank Ltd", color: "text-[#F7941D]", bgColor: "bg-[#FFF8F0]", borderColor: "border-[#F7941D]/20" },
    { name: "Ujjivan Small Finance Bank", color: "text-[#005A87]", bgColor: "bg-[#EBF6FA]", borderColor: "border-[#005A87]/20" },
    { name: "Equitas Finance", color: "text-[#00558F]", bgColor: "bg-[#EBF6FF]", borderColor: "border-[#00558F]/20" },
    { name: "Muthoot Finance Ltd", color: "text-[#D61A22]", bgColor: "bg-[#FFF0F0]", borderColor: "border-[#D61A22]/20" },
    { name: "Tata Capital Financial Services", color: "text-[#005C9C]", bgColor: "bg-[#EBF6FF]", borderColor: "border-[#005C9C]/20" },
    { name: "Aditya Birla Finance Limited", color: "text-[#CE1126]", bgColor: "bg-[#FFF0F1]", borderColor: "border-[#CE1126]/20" },
    { name: "Mahindra Financial Services Ltd", color: "text-[#E31837]", bgColor: "bg-[#FFF0F0]", borderColor: "border-[#E31837]/20" },
    { name: "L&T- NBFC", color: "text-[#007AC2]", bgColor: "bg-[#F0F8FC]", borderColor: "border-[#007AC2]/20" },
    { name: "Suryoday Small Finance Bank", color: "text-[#FDDA24]", bgColor: "bg-[#FFFFF0]", borderColor: "border-[#FDDA24]/50" },
    { name: "Fincare Small Finance Bank", color: "text-[#6A2C91]", bgColor: "bg-[#F6F0FA]", borderColor: "border-[#6A2C91]/20" },
];

const otherPartners = [
    "CAPRI GLOBAL", "Credit Saison India", "Aavas Financiers Limited", "LENDING KART-NBFC", "KIFS Housing Finance Ltd",
    "Finable technology", "Hinduja Housing Finance Limited", "DCB", "Utkarsh Small Finance Bank Ltd", "VASTU HOUSING FINANCE",
    "Shubham Housing Finance Co. Ltd", "CAPRI FINANCE", "ART Housing Finance (India) Limited", "Clix Capital",
    "SHRIRAM (Truhome Finance)", "Bank of Maharashtra", "PNB HOUSING", "ICICI Home Finance", "Aadhar housing Finance",
    "Vastu Finserve India Private Limited", "INCRED FINANCE", "BAJAJ FINSERV DIRECT LIMITED", "ADITYA BIRLA HOUSING FINANCE",
    "Easy Home Finance Limited", "Kogta Financial (India) Limited", "Fullerton Grihashakti", "Bank of India",
    "DMI Housing Finance Pvt Ltd", "Creditvidya (Prefer)", "Fedbank Financial Services Ltd", "INDIFI", "Muthoot Homefin India ltd.",
    "HDB", "AVANSE FINANCIAL SERVICES LTD", "IIFL", "CSL Finance Limited", "Mashreeq Bank", "CENTRAL BANK OF INDIA",
    "HERO FINCORP", "Axis Finance", "Growth Source Financial Technologies Pvt Ltd", "Mahindra Rural Housing Finance Limited",
    "INDIAN BANK", "INDOSTAR", "INDIABULLS", "Muthoot Housing Finance Company Ltd", "Flexiloan (Epimoney Private Limited)",
    "Godrej Housing Finance Limited", "Kuwy Technology Service Pvt Ltd", "SMC FINANCE", "Varthana Finance Private Limited",
    "HDFC Credila Financial Services Private Limited", "JM Financial Products Limited", "GIC Housing Finance Ltd",
    "Capital India Finance Limited", "AXIS ASHA", "Shinhan Bank India", "Edelweiss (Nido Home Finance)",
    "Mas Rural Housing and Mortgage Finance Ltd", "Krazybee Services Private Limited", "Karur Vysya Bank Ltd",
    "Motilal Oswal Home Finance Ltd (MOHFL)", "MAS Financial Services Limited", "Car dekho (Ruppy) finance", "KOTAK PRIME",
    "Repco Home Finance Limited", "Unity Small Finance Bank", "SUNDARAM HOME FINANCE", "Northern Arc Capital Limited",
    "InCred Digital", "Saraswat Bank", "Adani Housing Finance (Tyger)", "FT Cash", "PUNJAB & SIND BANK", "Muthoot Fincorp Limited",
    "Ambit Finvest Pvt. Ltd.", "Poonawalla Housing Finance Limited (MAGMA)", "ART Affordable Housing Finance Limited",
    "Cent Bank Home Finance Ltd", "Northern Arc Capital", "Catholic Syrian Bank (CSB)", "Arka Fincap Limited",
    "Profectus Capital Pvt Ltd", "KUWY", "NEO GROWTH", "JIO FINANCE LIMITED", "SRG Housing Finance Limited", "SBI CAPS",
    "INDIAN OVERSEAS BANK", "Ratnaafin Capital Pvt Ltd", "EMIRATES NBD", "Satin Housing Finance Limited", "PNB (CSL)",
    "Bharat Banking (Axis Bank)", "HDFC SALES", "Home First Finance Company", "Finsol Connect Private Limited",
    "Anand Rathi Global Finance Ltd", "Aeon Credit Service India Private Limited", "Charge To Customer", "Al Ahli United Bank",
    "4Fin Technologies Private Limited", "Al Ahli Bank of Kuwait", "Anand Rati", "UCO Bank", "Agrim housing finance pvt ltd",
    "Allahabad Bank", "Homeville Group (Singularity Creditworld Private Limited)", "Navi fintech pvt ltd", "Nivara Home Finance Limited",
    "Svatantra Micro Housing Finance", "Canada - Merix – NPX", "Roha Housing finance", "IBQ", "National Bank of Fujairah",
    "Commercial Bank of Dubai", "Capital Small Finance Bank Limited", "Aavas Financiers Ltd (Fitrr)", "TRUCAP FINANCE",
    "InCred Financial Services Limited (Fitrr)", "HINDUJA LEYLAND FINANCE", "Fairassets Technologies India Private Limited “(Faircent)”",
    "DMI Finance Pvt Ltd", "Propelld (Bluebear Technology Private Limited)", "RAK Bank", "Future General Insurance",
    "United Capital (United Commerce Pvt Ltd)", "Ummeed Housing Finance Pvt. Ltd.", "Ashv Finance (Intellegrow) – NBFC",
    "AUXILO FINSERV", "COMMONWEALTH BANK", "Burgan Bank", "Rapipay Fintech Private Limited", "INDEX ORGANICS AND AYURVEDIC PVT LTD",
    "Canada - B2B Bank", "Rupeek Fintech Pvt Ltd", "SBM Bank", "CBI BANK", "Paysence Service Pvt Ltd",
    "RAAS AFFORDABLE HOUSING FINANCE INDIA LTD", "Dubai Islamic Bank", "Niyogin Fintech Ltd", "HDFC LTD", "United Arab Bank",
    "Tractor Junction (Agro wheels Marketing Pvt Ltd)"
];


// 3. Process
const usedLogos = new Set();
const allPartners = [];

// Helper to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Default colors for other partners
const defaultStyle = {
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50/50',
    borderColor: 'border-indigo-100'
};

// 3a. Consolidate all potential partners
// Priority 1: Top Partners (keep their specific styles)
topPartners.forEach(p => {
    const logo = findLogo(p.name);
    allPartners.push(logo ? { ...p, logo } : p);
});

// Priority 2: Other Partners (apply default styles)
otherPartners.forEach(name => {
    const logo = findLogo(name);
    allPartners.push(logo
        ? { name, logo, ...defaultStyle }
        : { name, ...defaultStyle }
    );
});

// 3b. Deduplicate based on Logo
// If a logo is already used by a previous entry, skip the subsequent one.
// Partners without logos are always kept.
const uniquePartners = [];
allPartners.forEach(p => {
    if (p.logo) {
        if (!usedLogos.has(p.logo)) {
            usedLogos.add(p.logo);
            uniquePartners.push(p);
        }
        // else: duplicate logo, skip
    } else {
        uniquePartners.push(p);
    }
});

// 3c. Sort
// Group 1: With Logo -> Alphabetical
const withLogo = uniquePartners.filter(p => p.logo).sort((a, b) => a.name.localeCompare(b.name));

// Group 2: Without Logo -> Random
const withoutLogo = shuffleArray(uniquePartners.filter(p => !p.logo));

// Combined Result
const finalList = [...withLogo, ...withoutLogo];


// 4. Generate Output
console.log(`
export const partners = ${JSON.stringify(finalList, null, 4)};
`);
