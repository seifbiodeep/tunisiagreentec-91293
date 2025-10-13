import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingWelcome } from './OnboardingWelcome';
import { OnboardingInterests } from './OnboardingInterests';
import { OnboardingActivities } from './OnboardingActivities';
import { OnboardingComplete } from './OnboardingComplete';
import { useToast } from '@/hooks/use-toast';

interface OnboardingFlowProps {
  user: any;
}

type OnboardingStep = 'welcome' | 'interests' | 'activities' | 'complete';

export const OnboardingFlow = ({ user }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const userName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Utilisateur';

  const handleWelcomeNext = () => {
    setCurrentStep('interests');
  };

  const handleInterestsNext = (interests: string[]) => {
    setSelectedInterests(interests);
    setCurrentStep('activities');
  };

  const handleActivitiesNext = (activities: string[]) => {
    setSelectedActivities(activities);
    setCurrentStep('complete');
  };

  const handleComplete = () => {
    // Ici, on pourrait sauvegarder les préférences en base de données
    toast({
      title: "Bienvenue dans EcoLink !",
      description: "Votre profil a été configuré avec succès. Vous recevez 100 points de bienvenue !",
    });
    
    navigate('/');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'interests':
        setCurrentStep('welcome');
        break;
      case 'activities':
        setCurrentStep('interests');
        break;
      case 'complete':
        setCurrentStep('activities');
        break;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <OnboardingWelcome 
            onNext={handleWelcomeNext}
            userName={userName}
          />
        );
      case 'interests':
        return (
          <OnboardingInterests 
            onNext={handleInterestsNext}
            onBack={handleBack}
          />
        );
      case 'activities':
        return (
          <OnboardingActivities 
            onNext={handleActivitiesNext}
            onBack={handleBack}
            userInterests={selectedInterests}
          />
        );
      case 'complete':
        return (
          <OnboardingComplete 
            onFinish={handleComplete}
            userName={userName}
            selectedInterests={selectedInterests}
            selectedActivities={selectedActivities}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto">
        {/* Progress indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['welcome', 'interests', 'activities', 'complete'].map((step, index) => {
              const stepIndex = ['welcome', 'interests', 'activities', 'complete'].indexOf(currentStep);
              const isActive = index === stepIndex;
              const isCompleted = index < stepIndex;
              
              return (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : isCompleted 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};