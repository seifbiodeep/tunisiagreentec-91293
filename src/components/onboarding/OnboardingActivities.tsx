import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Leaf,
  Bike,
  TreePine,
  Recycle,
  Utensils
} from 'lucide-react';

interface OnboardingActivitiesProps {
  onNext: (selectedActivities: string[]) => void;
  onBack: () => void;
  userInterests: string[];
}

const activities = [
  {
    id: 'bike-tour',
    title: 'Balade à vélo écologique',
    description: 'Découverte des pistes cyclables de la ville',
    location: 'Centre-ville, Tunis',
    date: 'Samedi 15 juillet',
    time: '09:00 - 12:00',
    participants: 12,
    maxParticipants: 20,
    difficulty: 'Facile',
    category: 'transport',
    icon: Bike,
    tags: ['Transport vert', 'Sport', 'Découverte']
  },
  {
    id: 'tree-planting',
    title: 'Plantation d\'arbres communautaire',
    description: 'Participation à la reforestation urbaine',
    location: 'Parc Belvédère, Tunis',
    date: 'Dimanche 16 juillet',
    time: '08:00 - 11:00',
    participants: 25,
    maxParticipants: 50,
    difficulty: 'Modéré',
    category: 'nature',
    icon: TreePine,
    tags: ['Reforestation', 'Communauté', 'Nature']
  },
  {
    id: 'recycling-workshop',
    title: 'Atelier de recyclage créatif',
    description: 'Apprenez à transformer vos déchets en objets utiles',
    location: 'Centre culturel, Sfax',
    date: 'Mercredi 19 juillet',
    time: '14:00 - 17:00',
    participants: 8,
    maxParticipants: 15,
    difficulty: 'Facile',
    category: 'recycling',
    icon: Recycle,
    tags: ['DIY', 'Recyclage', 'Créativité']
  },
  {
    id: 'organic-cooking',
    title: 'Cours de cuisine bio locale',
    description: 'Cuisiner avec des produits locaux et de saison',
    location: 'Ferme bio, Monastir',
    date: 'Samedi 22 juillet',
    time: '10:00 - 14:00',
    participants: 6,
    maxParticipants: 12,
    difficulty: 'Facile',
    category: 'food',
    icon: Utensils,
    tags: ['Bio', 'Local', 'Cuisine']
  },
  {
    id: 'urban-garden',
    title: 'Jardinage urbain participatif',
    description: 'Création d\'un potager communautaire',
    location: 'Quartier Manouba',
    date: 'Samedi 29 juillet',
    time: '08:00 - 12:00',
    participants: 15,
    maxParticipants: 25,
    difficulty: 'Modéré',
    category: 'garden',
    icon: Leaf,
    tags: ['Jardinage', 'Communauté', 'Légumes']
  },
  {
    id: 'eco-cleanup',
    title: 'Nettoyage écologique des plages',
    description: 'Protection du littoral méditerranéen',
    location: 'Plage de Hammamet',
    date: 'Dimanche 30 juillet',
    time: '07:00 - 10:00',
    participants: 30,
    maxParticipants: 60,
    difficulty: 'Facile',
    category: 'nature',
    icon: Recycle,
    tags: ['Nettoyage', 'Plage', 'Protection']
  }
];

export const OnboardingActivities = ({ onNext, onBack, userInterests }: OnboardingActivitiesProps) => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Filtrer les activités selon les intérêts de l'utilisateur
  const recommendedActivities = activities.filter(activity => 
    userInterests.includes(activity.category)
  );
  
  const otherActivities = activities.filter(activity => 
    !userInterests.includes(activity.category)
  );

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const ActivityCard = ({ activity, isRecommended = false }: { activity: any, isRecommended?: boolean }) => {
    const Icon = activity.icon;
    const isSelected = selectedActivities.includes(activity.id);
    
    return (
      <Card
        className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
          isSelected 
            ? 'ring-2 ring-primary border-primary bg-primary/5' 
            : 'hover:border-primary/50'
        } ${isRecommended ? 'border-primary/30' : ''}`}
        onClick={() => toggleActivity(activity.id)}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="w-5 h-5 text-primary" />
              {isRecommended && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Recommandé
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {activity.difficulty}
            </Badge>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-1">{activity.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{activity.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{activity.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{activity.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{activity.participants}/{activity.maxParticipants} participants</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {activity.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Découvrez des activités écologiques près de chez vous
        </h2>
        <p className="text-muted-foreground">
          Choisissez les activités qui vous intéressent pour commencer votre parcours écologique
        </p>
        <div className="flex justify-center">
          <Badge variant="outline" className="px-3 py-1">
            {selectedActivities.length} activité{selectedActivities.length > 1 ? 's' : ''} sélectionnée{selectedActivities.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {recommendedActivities.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Star className="w-5 h-5 text-primary" />
            <span>Recommandées pour vous</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedActivities.map((activity) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                isRecommended={true}
              />
            ))}
          </div>
        </div>
      )}

      {otherActivities.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Autres activités disponibles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherActivities.map((activity) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button 
          onClick={() => onNext(selectedActivities)}
          className="px-8"
        >
          {selectedActivities.length > 0 ? `Continuer (${selectedActivities.length})` : 'Passer cette étape'}
        </Button>
      </div>
    </div>
  );
};