
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Leaf, Users, Building, ShieldCheck } from 'lucide-react';

const Hero = () => {
  const handleReportProblem = () => {
    const problemSection = document.getElementById('problem-reporting');
    if (problemSection) {
      problemSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBecomePartner = () => {
    const registrationSection = document.getElementById('registration-form');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Connectons la Tunisie pour un 
              <span className="text-green-600"> Environnement Durable</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              EcoLink est la première plateforme tunisienne qui connecte les citoyens 
              aux organisations pour résoudre les problèmes écologiques de manière efficace et transparente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
                onClick={handleReportProblem}
              >
                Signaler un problème
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3 border-green-600 text-green-600 hover:bg-green-50"
                onClick={handleBecomePartner}
              >
                Devenir partenaire
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Citoyens Actifs</h3>
              <p className="text-gray-600">Signalez facilement les problèmes écologiques dans votre région</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Building className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Organisations</h3>
              <p className="text-gray-600">Intervenez rapidement pour résoudre les défis environnementaux</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Leaf className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Impact Durable</h3>
              <p className="text-gray-600">Créons ensemble un avenir plus vert pour la Tunisie</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <ShieldCheck className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Suivi Transparent</h3>
              <p className="text-gray-600">Suivez l'évolution de chaque intervention en temps réel</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
