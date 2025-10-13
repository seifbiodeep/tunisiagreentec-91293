
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import RegistrationForm from '@/components/RegistrationForm';
import ProblemReporting from '@/components/ProblemReporting';
import Dashboard from '@/components/Dashboard';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <div id="registration-form">
        <RegistrationForm />
      </div>
      <div id="problem-reporting">
        <ProblemReporting />
      </div>
      <Dashboard />
      <Services />
      <Footer />
    </div>
  );
};

export default Index;
