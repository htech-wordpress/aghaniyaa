import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Loans } from '@/pages/Loans';
import { LoanDetail } from '@/pages/LoanDetail';
// import { CreditCards } from '@/pages/CreditCards';
import { EMICalculator } from '@/pages/EMICalculator';
import { CibilCheck } from '@/pages/CibilCheck';
import { OurTeam } from '@/pages/OurTeam';

import { BecomeDSA } from '@/pages/BecomeDSA';
import { Testimonials } from '@/pages/Testimonials';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Careers } from './pages/Careers';
import { CertificatesAwards } from '@/pages/CertificatesAwards';
import { Media } from '@/pages/Media';
import { Partners } from '@/pages/Partners';
import { ScrollToTop } from '@/components/ScrollToTop';

function App() {
  // Get base path from Vite config
  const basePath = import.meta.env.BASE_URL;

  return (
    <BrowserRouter basename={basePath}>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/:loanType" element={<LoanDetail />} />
            {/* <Route path="/credit-cards" element={<CreditCards />} /> */}
            <Route path="/emi-calculator" element={<EMICalculator />} />
            <Route path="/cibil-check" element={<CibilCheck />} />
            <Route path="/our-team" element={<OurTeam />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/becomedsa" element={<BecomeDSA />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/certificates-awards" element={<CertificatesAwards />} />
            <Route path="/media" element={<Media />} />
            <Route path="/partners" element={<Partners />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
}

export default App;
