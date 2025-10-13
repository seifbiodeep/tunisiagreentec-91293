import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Users, MapPin, Target } from 'lucide-react';

interface OnboardingWelcomeProps {
  onNext: () => void;
  userName: string;
}

export const OnboardingWelcome = ({ onNext, userName }: OnboardingWelcomeProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Leaf className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenue {userName} ! 🌱
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Félicitations ! Votre compte Tunisia Green Tech est créé. Nous allons maintenant personnaliser votre expérience 
          en fonction de vos centres d&apos;intérêt écologiques.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-primary/20">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Objectifs personnalisés</h3>
            <p className="text-sm text-muted-foreground">
              Définissez vos objectifs écologiques
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Activités locales</h3>
            <p className="text-sm text-muted-foreground">
              Découvrez les activités près de chez vous
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Communauté</h3>
            <p className="text-sm text-muted-foreground">
              Rejoignez des groupes et associations
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Impact écologique</h3>
            <p className="text-sm text-muted-foreground">
              Suivez votre impact positif
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={onNext}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          Commencer la personnalisation
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Cela ne prendra que 2 minutes
        </p>
      </div>
    </div>
  );
};