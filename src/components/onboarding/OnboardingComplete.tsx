import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Sparkles, 
  Users, 
  Calendar, 
  Trophy,
  ArrowRight,
  Gift
} from 'lucide-react';

interface OnboardingCompleteProps {
  onFinish: () => void;
  userName: string;
  selectedInterests: string[];
  selectedActivities: string[];
}

export const OnboardingComplete = ({ 
  onFinish, 
  userName, 
  selectedInterests, 
  selectedActivities 
}: OnboardingCompleteProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Félicitations {userName} ! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            Votre profil EcoLink est maintenant configuré et personnalisé
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gift className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Bonus de bienvenue</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Recevez 100 points EcoLink pour commencer votre parcours écologique !
          </p>
          <Badge className="bg-primary text-primary-foreground px-4 py-2">
            +100 Points EcoLink 🌟
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-primary/20">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Centres d'intérêt</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedInterests.length} domaine{selectedInterests.length > 1 ? 's' : ''} sélectionné{selectedInterests.length > 1 ? 's' : ''}
              </p>
              <Badge variant="outline">Profil personnalisé ✓</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Activités</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedActivities.length} activité{selectedActivities.length > 1 ? 's' : ''} réservée{selectedActivities.length > 1 ? 's' : ''}
              </p>
              <Badge variant="outline">Planning créé ✓</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Communauté</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Accès à la communauté EcoLink
              </p>
              <Badge variant="outline">Membre actif ✓</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-primary" />
          <span>Prochaines étapes</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">1</span>
            </div>
            <span className="text-sm">Explorez votre tableau de bord personnalisé</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">2</span>
            </div>
            <span className="text-sm">Rejoignez vos premières activités écologiques</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">3</span>
            </div>
            <span className="text-sm">Connectez-vous avec d'autres membres de la communauté</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={onFinish}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          Accéder à mon tableau de bord
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Votre aventure écologique commence maintenant !
        </p>
      </div>
    </div>
  );
};