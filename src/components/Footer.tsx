
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">Tunisia Green Tech</span>
            </div>
            <p className="text-gray-400">
              La première plateforme tunisienne pour connecter les citoyens 
              aux organisations environnementales.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-500 transition-colors">Accueil</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Pour les Organisations</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-500 transition-colors">Devenir partenaire</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Tarification</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@tunisiagreentech.tn</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+216 71 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Tunis, Tunisie</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Tunisia Green Tech. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
