
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !showOnboarding) {
      navigate('/');
    }
  }, [user, navigate, showOnboarding]);

  const handleSuccess = () => {
    if (isLogin) {
      navigate('/');
    } else {
      // Après création de compte, lancer l'onboarding
      setShowOnboarding(true);
    }
  };

  // Si on affiche l'onboarding
  if (showOnboarding && user) {
    return <OnboardingFlow user={user} />;
  }

  return (
    <AuthLayout
      title={isLogin ? 'Connexion' : 'Créer un compte'}
      subtitle={isLogin ? 'Connectez-vous à votre compte Tunisia Green Tech' : 'Rejoignez la communauté Tunisia Green Tech'}
    >
      {isLogin ? (
        <SignInForm
          onToggleMode={() => setIsLogin(false)}
          onSuccess={handleSuccess}
        />
      ) : (
        <SignUpForm
          onToggleMode={() => setIsLogin(true)}
          onSuccess={handleSuccess}
        />
      )}
    </AuthLayout>
  );
};

export default Auth;
