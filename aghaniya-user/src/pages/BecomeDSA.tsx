import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { saveLeadAsync } from '@/lib/leads';

const locations = [
    'Mumbai (Head Office)',
    'Delhi NCR',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Other',
];

export function BecomeDSA() {
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        address: '',
        preferredLocation: '',
        currentCity: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await saveLeadAsync('becomedsa', {
                ...formData,
                source: 'become-dsa-page',
            });
            alert(
                'Thank you for your interest in building your career as a DSA with AGHANIYA ENTERPRISES. Our HR team will contact you soon.'
            );
            setFormData({
                fullName: '',
                mobile: '',
                email: '',
                address: '',
                preferredLocation: '',
                currentCity: '',
            });
        } catch (error) {
            console.error('Error saving DSA lead', error);
            alert('Something went wrong while submitting your details. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-hero-gradient py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <ScrollAnimation direction="fade" delay={0.2}>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Become a DSA</h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
                            Partner with AGHANIYA ENTERPRISES and grow your business in financial distribution.
                        </p>
                    </ScrollAnimation>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 pb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side - Registration Form */}
                    <div className="lg:col-span-4">
                        <ScrollAnimation direction="right" delay={0.2}>
                            <Card className="border-0 shadow-2xl bg-white sticky top-24">
                                <div className="h-2 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900" />
                                <CardHeader className="pb-2 pt-6">
                                    <CardTitle className="text-2xl font-bold text-slate-800">DSA Registration Form</CardTitle>
                                    <CardDescription>
                                        Fill in your details to register as a partner.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className="text-slate-700">Name *</Label>
                                            <Input
                                                id="fullName"
                                                required
                                                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                                value={formData.fullName}
                                                onChange={(e) => handleChange('fullName', e.target.value)}
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="mobile" className="text-slate-700">Contact number *</Label>
                                            <Input
                                                id="mobile"
                                                type="tel"
                                                required
                                                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                                value={formData.mobile}
                                                onChange={(e) => handleChange('mobile', e.target.value)}
                                                placeholder="Enter your contact number"
                                                maxLength={10}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-slate-700">Mail id *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                                value={formData.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                placeholder="Enter your email"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-slate-700">Address</Label>
                                            <Textarea
                                                id="address"
                                                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-none"
                                                value={formData.address}
                                                onChange={(e) => handleChange('address', e.target.value)}
                                                placeholder="Enter your address"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="preferredLocation" className="text-slate-700">Preferred Location *</Label>
                                            <Select
                                                value={formData.preferredLocation}
                                                onValueChange={(value) => handleChange('preferredLocation', value)}
                                                required
                                            >
                                                <SelectTrigger id="preferredLocation" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                                                    <SelectValue placeholder="Select location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {locations.map((loc) => (
                                                        <SelectItem key={loc} value={loc}>
                                                            {loc}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="currentCity" className="text-slate-700">Currently working at (Current City) *</Label>
                                            <Input
                                                id="currentCity"
                                                required
                                                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                                value={formData.currentCity}
                                                onChange={(e) => handleChange('currentCity', e.target.value)}
                                                placeholder="Current City"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full mt-4" size="lg" disabled={isSubmitting}>
                                            {isSubmitting ? 'Submitting...' : 'Register as DSA'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>
                    </div>

                    {/* Right Side - Informational Content */}
                    <div className="lg:col-span-8 space-y-8 text-slate-700">
                        <ScrollAnimation direction="up" delay={0.1}>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Direct Selling Agents (DSAs)</h2>
                                <p className="leading-relaxed mb-6">
                                    A DSA represents a company but does so on a flexible, non-salaried basis. Their primary role is identifying potential customers, explaining the features and benefits of products or services, and facilitating successful transactions.
                                </p>

                                <h3 className="text-xl font-bold text-slate-800 mb-3">What Are Direct Selling Agents (DSAs) in the Banking Sector?</h3>
                                <p className="leading-relaxed mb-4">
                                    A Direct Selling Agent (DSA) is a professional intermediary who partners with banks and non-banking financial companies (NBFCs) to promote and sell financial products to prospective customers. These products may include home loans, personal loans, credit cards, business loans, and more.
                                </p>
                                <p className="leading-relaxed mb-4">
                                    DSAs play a vital role in the financial ecosystem by:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mb-4">
                                    <li>Identifying potential clients</li>
                                    <li>Explaining product features and benefits</li>
                                    <li>Assisting with the loan or credit application process</li>
                                    <li>Ensuring proper documentation and compliance</li>
                                </ul>
                                <p className="leading-relaxed">
                                    In return for their services, DSAs earn a commission based on the volume or value of the business they generate.
                                </p>
                            </div>
                        </ScrollAnimation>

                        <ScrollAnimation direction="up" delay={0.2}>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Types of Direct Selling Agents (DSAs)</h3>
                                <p className="mb-6 leading-relaxed">Direct Selling Agents can be categorized into three main types based on their affiliations and the range of products they offer:</p>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-2">Independent DSAs</h4>
                                        <p className="leading-relaxed">
                                            Independent DSAs are not tied to a single financial institution. They work with multiple banks and NBFCs, allowing them to offer a broader range of financial products. This flexibility enables them to provide customized solutions tailored to the specific needs of their clients.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-2">Bank-Associated DSAs</h4>
                                        <p className="leading-relaxed">
                                            These DSAs are exclusively affiliated with a single bank. They promote and sell only that bank’s financial products. Often, bank-associated DSAs receive dedicated training and support from the bank, ensuring they have in-depth knowledge of the bank's offerings and policies.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-2">DSA Channel Partners</h4>
                                        <p className="leading-relaxed">
                                            Channel partner DSAs collaborate with multiple financial institutions under a structured partnership model. This allows them to cater to a wide variety of customer profiles by offering products from different banks, improving conversion rates, and customer satisfaction.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>

                        <ScrollAnimation direction="up" delay={0.3}>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Direct Selling Agent (DSA) Eligibility Criteria</h3>
                                <p className="mb-6 leading-relaxed">
                                    To apply for a DSA ID and begin working as a Direct Selling Agent for a bank or NBFC, applicants must meet the following eligibility requirements:
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        { title: 'Minimum Age', text: 'The applicant must be at least 18 years old, as per the bank’s minimum age requirement.' },
                                        { title: 'Occupation', text: 'Open to salaried individuals, self-employed professionals, freelancers, and business owners.' },
                                        { title: 'Citizenship', text: 'The applicant must be an Indian citizen.' },
                                        { title: 'Documentation', text: 'Must submit valid KYC documents, income proof, bank details, and other paperwork as specified by the partnering bank or NBFC.' },
                                        { title: 'Knowledge & Skills', text: 'A formal degree in finance or banking is not mandatory, but the applicant must have a good understanding of financial products and how to communicate them effectively to clients.' }
                                    ].map((item, i) => (
                                        <li key={i} className="flex flex-col md:flex-row md:items-start gap-2">
                                            <span className="font-bold text-slate-800 w-40 shrink-0">{item.title}:</span>
                                            <span className="text-slate-600">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </ScrollAnimation>

                        <ScrollAnimation direction="up" delay={0.3}>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Documents Required for DSA Registration</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="py-4 font-bold text-slate-800 w-1/3">Document Purpose</th>
                                                <th className="py-4 font-bold text-slate-800">Documents to be Furnished</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="py-4 border-b border-slate-100 align-top font-medium">Identity Proof</td>
                                                <td className="py-4 border-b border-slate-100">- PAN Card</td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 border-b border-slate-100 align-top font-medium">Address Proof</td>
                                                <td className="py-4 border-b border-slate-100">
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>Aadhaar Card</li>
                                                        <li>Passport</li>
                                                        <li>Voter ID Card</li>
                                                        <li>Bank Statement or Passbook</li>
                                                        <li>Utility Bill (Electricity/Water Bill)</li>
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 border-b border-slate-100 align-top font-medium">Proof of Business (if applicable)</td>
                                                <td className="py-4 border-b border-slate-100">
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>Sole Proprietorship</li>
                                                        <li>Partnership - Partnership Deed</li>
                                                        <li>LLP and PVT.LTD - GST Registration Certificate</li>
                                                        <li>Shop Establishment Certificate</li>
                                                        <li>Business Registration Documents (if registering as a business entity)</li>
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 align-top font-medium">Photographs</td>
                                                <td className="py-4">- Recent passport-sized photographs (usually 2–4 copies)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </ScrollAnimation>

                        <ScrollAnimation direction="up" delay={0.4}>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-800 mb-4">What is the Role of a DSA in Home Loans?</h3>
                                <p className="mb-6 leading-relaxed">
                                    A Direct Selling Agent (DSA) plays a key role in simplifying the home loan process for both borrowers and lending institutions. Acting as a bridge between customers and banks or NBFCs, the DSA ensures a smooth loan application and approval journey.
                                </p>
                                <h4 className="text-lg font-bold text-slate-800 mb-4">Key Responsibilities of a DSA in Home Loans:</h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { title: 'Lead Generation', text: 'Identifies potential home loan seekers through networking, marketing, or referrals.' },
                                        { title: 'Client Consultation', text: 'Explains different home loan options, interest rates, eligibility criteria, and documentation requirements to customers.' },
                                        { title: 'Document Collection', text: 'Assists applicants in gathering and submitting all necessary documents for home loan processing.' },
                                        { title: 'Application Submission', text: 'Fills out and submits the loan application on behalf of the client to the partnered bank or NBFC.' },
                                        { title: 'Follow-up and Coordination', text: 'Coordinates with the financial institution for updates, responds to queries, and ensures timely processing of the application.' },
                                        { title: 'Ensures Compliance', text: 'Makes sure the application meets the lender’s regulatory and policy standards.' },
                                        { title: 'Customer Support', text: 'Provides assistance and guidance throughout the process.' }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <h5 className="font-bold text-primary mb-1">{item.title}</h5>
                                            <p className="text-sm text-slate-600">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-6 italic text-slate-500 border-t border-slate-100 pt-4">
                                    In Return: The DSA earns a commission from the financial institution for every successful loan application or disbursal they facilitate.
                                </p>
                            </div>
                        </ScrollAnimation>

                        <ScrollAnimation direction="up" delay={0.5}>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Benefits to Financial Institutions</h3>
                                <p className="mb-6 leading-relaxed">
                                    DSAs (Direct Selling Agents) provide significant advantages to financial institutions, not only enhancing customer engagement but also contributing to the institution's growth and efficiency. Here's how DSAs benefit financial institutions:
                                </p>
                                <ul className="space-y-6">
                                    {[
                                        { title: 'Expand Reach and Market Penetration', text: 'DSAs allow financial institutions to access untapped markets, especially in areas where they might not have physical branches. They can target niche or underserved demographics, increasing market coverage.' },
                                        { title: 'Operational Cost Reduction', text: 'Financial institutions can streamline their operations by outsourcing the customer acquisition process and other early-stage tasks to DSAs. This reduces the need for extensive in-house resources, saving on staffing, infrastructure, and administrative costs.' },
                                        { title: 'Improved Customer Service', text: 'DSAs provide a more personalized service, as they often interact directly with customers and can address specific needs and concerns in real-time. This enhances the overall customer experience, leading to greater satisfaction and loyalty.' },
                                        { title: 'Increased Sales and Revenue', text: 'Since DSAs work on commission or incentives based on the sales they generate, they have a direct motivation to bring in more customers, driving increased business and revenue for financial institutions.' },
                                        { title: 'Faster and Efficient Customer Onboarding', text: 'DSAs play a key role in helping financial institutions streamline the customer onboarding process, manage document collection, and guide customers through application procedures. This speeds up the overall process and ensures that customers are more likely to follow through with their financial commitments.' },
                                        { title: 'Focus on Core Activities', text: 'By offloading customer acquisition and documentation tasks to DSAs, financial institutions can focus more on their core functions, such as product development, portfolio management, and strategic planning.' },
                                    ].map((item, i) => (
                                        <li key={i}>
                                            <h4 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h4>
                                            <p className="text-slate-600 leading-relaxed">{item.text}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </ScrollAnimation>

                    </div>
                </div>
            </div>
        </div>
    );
}
