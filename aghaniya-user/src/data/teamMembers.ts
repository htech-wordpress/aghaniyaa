export interface TeamMember {
    id: string;
    name: string;
    position: string;
    image: string;
    experience: string;
    description: string;
    education: string;
    specializations: string[];
    achievements: string[];
    email: string;
    phone: string;
    linkedin?: string;
}

export const teamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Rakesh Kumar Mishra',
        position: 'Director',
        image: '/director/Rakesh-Aghaniya-director.png',
        experience: '15+ Years',
        description: 'Rakesh Kumar Mishra is a seasoned financial professional with over 15 years of experience in the banking and finance industry. He specializes in helping individuals and businesses secure the best loan options tailored to their needs.',
        education: 'MBA in Finance',
        specializations: [
            'Home Loans & Property Financing',
            'Business Loans & Working Capital',
            'Investment Advisory',
            'Credit Risk Assessment'
        ],
        achievements: [
            'Successfully processed loans worth ₹500+ Crores',
            'Awarded "Best Loan Advisor" by Financial Services Association',
            'Helped 5000+ customers achieve their financial goals',

        ],
        email: 'rakesh.kumar@aghaniya.com',
        phone: '+91 70585 19247',
        // linkedin: 'https://linkedin.com/in/rakesh-kumar-mishra'
    },
    {
        id: '2',
        name: 'Jibu Kumar',
        position: 'Director',
        image: '/director/Jibu-Aghaniya-director.png',
        experience: '6+ Years',
        description: 'Jibu Kumar brings extensive expertise in loan distribution and customer relations. With a proven track record of facilitating smooth loan processes, she ensures clients receive the best financial solutions with minimal hassle.',
        education: 'B.A',
        specializations: [
            'Personal Loans & Quick Disbursal',
            'Business Loans & Working Capital',
            'Commercial Loans',
            'Gold Loans & Asset-backed Financing'
        ],
        achievements: [
            'Processed 3000+ loan applications successfully',
            'Maintained 98% customer satisfaction rate',
            'Expert in multi-product financial solutions'
        ],
        email: 'jiby.kumar@aghaniya.com',
        phone: '+91 62033 01532',
        // linkedin: 'https://linkedin.com/in/jibykumar'
    },
];
