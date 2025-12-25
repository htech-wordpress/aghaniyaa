
export function downloadDemoCSVTemplate() {
    const headers = [
        'Category', 'Full Name', 'Email', 'Mobile', 'Source', 'Message',
        'Loan Type', 'Amount', 'Reason',
        'Employment Type', 'Monthly Income',
        'Street Address', 'City', 'State', 'Zip Code',
        'Bank Name', 'Account Holder', 'Account Number', 'IFSC',
        'Existing Loans'
    ];

    const sampleRow = [
        'personal-loan', 'John Doe', 'john@example.com', '9876543210', 'Referral', 'Looking for loan',
        'Personal Loan', '500000', 'Medical Emergency',
        'Salaried', '50000',
        '123 Main St', 'Mumbai', 'Maharashtra', '400001',
        'HDFC Bank', 'John Doe', '1234567890', 'HDFC0001234',
        'SBI: 20000 (EMI: 5000)'
    ];

    const csvContent = [
        headers.join(','),
        sampleRow.map(f => `"${String(f).replace(/"/g, '""')}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'demo_leads_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
