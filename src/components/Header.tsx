
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Leaf, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">Tunisia Green Tech</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-green-600 transition-colors">Accueil</a>
            <a href="/organisations" className="text-gray-700 hover:text-green-600 transition-colors">Organisations RSE</a>
            <a href="/problemes" className="text-gray-700 hover:text-green-600 transition-colors">Problèmes</a>
            <a href="#services" className="text-gray-700 hover:text-green-600 transition-colors">Services</a>
            <a href="#apropos" className="text-gray-700 hover:text-green-600 transition-colors">À propos</a>
            <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Mon compte
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/auth')}
              >
                Se connecter
              </Button>
            )}
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-gray-700 hover:text-green-600 transition-colors">Accueil</a>
              <a href="/organisations" className="text-gray-700 hover:text-green-600 transition-colors">Organisations RSE</a>
              <a href="/problemes" className="text-gray-700 hover:text-green-600 transition-colors">Problèmes</a>
              <a href="#services" className="text-gray-700 hover:text-green-600 transition-colors">Services</a>
              <a href="#apropos" className="text-gray-700 hover:text-green-600 transition-colors">À propos</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
              
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/profile')}
                  >
                    Mon profil
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    Se déconnecter
                  </Button>
                </>
              ) : (
                <Button 
                  className="bg-green-600 hover:bg-green-700 w-full"
                  onClick={() => navigate('/auth')}
                >
                  Se connecter
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
