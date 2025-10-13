import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Recycle, 
  Bike, 
  Leaf, 
  Home, 
  Utensils, 
  Car, 
  Lightbulb, 
  TreePine,
  Droplets,
  Wind,
  Sun,
  Fish
} from 'lucide-react';

interface OnboardingInterestsProps {
  onNext: (interests: string[]) => void;
  onBack: () => void;
}

const interests = [
  { id: 'recycling', name: 'Recyclage & Déchets', icon: Recycle, color: 'bg-green-100 text-green-700' },
  { id: 'transport', name: 'Transport Vert', icon: Bike, color: 'bg-blue-100 text-blue-700' },
  { id: 'energy', name: 'Énergies Renouvelables', icon: Sun, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'home', name: 'Maison Écologique', icon: Home, color: 'bg-purple-100 text-purple-700' },
  { id: 'food', name: 'Alimentation Durable', icon: Utensils, color: 'bg-orange-100 text-orange-700' },
  { id: 'electric', name: 'Véhicules Électriques', icon: Car, color: 'bg-indigo-100 text-indigo-700' },
  { id: 'efficiency', name: 'Efficacité Énergétique', icon: Lightbulb, color: 'bg-cyan-100 text-cyan-700' },
  { id: 'nature', name: 'Protection Nature', icon: TreePine, color: 'bg-emerald-100 text-emerald-700' },
  { id: 'water', name: 'Gestion de l\'Eau', icon: Droplets, color: 'bg-sky-100 text-sky-700' },
  { id: 'air', name: 'Qualité de l\'Air', icon: Wind, color: 'bg-teal-100 text-teal-700' },
  { id: 'biodiversity', name: 'Biodiversité', icon: Fish, color: 'bg-lime-100 text-lime-700' },
  { id: 'garden', name: 'Jardinage Écologique', icon: Leaf, color: 'bg-green-100 text-green-700' }
];

export const OnboardingInterests = ({ onNext, onBack }: OnboardingInterestsProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    if (selectedInterests.length > 0) {
      onNext(selectedInterests);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Quels sont vos centres d'intérêt écologiques ?
        </h2>
        <p className="text-muted-foreground">
          Sélectionnez les domaines qui vous intéressent pour recevoir des recommandations personnalisées
        </p>
        <div className="flex justify-center">
          <Badge variant="outline" className="px-3 py-1">
            {selectedInterests.length} sélectionné{selectedInterests.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {interests.map((interest) => {
          const Icon = interest.icon;
          const isSelected = selectedInterests.includes(interest.id);
          
          return (
            <Card
              key={interest.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => toggleInterest(interest.id)}
            >
              <CardContent className="p-4 text-center space-y-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto ${
                  isSelected ? 'bg-primary text-primary-foreground' : interest.color
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-sm leading-tight">
                  {interest.name}
                </h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button 
          onClick={handleNext}
          disabled={selectedInterests.length === 0}
          className="px-8"
        >
          Continuer ({selectedInterests.length})
        </Button>
      </div>
    </div>
  );
};