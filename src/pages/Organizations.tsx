import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { OrganizationDirectory } from '@/components/organizations/OrganizationDirectory';

const Organizations = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <OrganizationDirectory />
      </main>
      <Footer />
    </div>
  );
};

export default Organizations;
