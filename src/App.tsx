import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Loans } from '@/pages/Loans';
import { LoanDetail } from '@/pages/LoanDetail';
import { CreditCards } from '@/pages/CreditCards';
import { EMICalculator } from '@/pages/EMICalculator';

function App() {
  // Get base path from environment variable (for GitHub Pages deployment)
  const basePath = import.meta.env.VITE_BASE_PATH || '/';
  
  return (
    <BrowserRouter basename={basePath}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/:loanType" element={<LoanDetail />} />
            <Route path="/credit-cards" element={<CreditCards />} />
            <Route path="/emi-calculator" element={<EMICalculator />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
