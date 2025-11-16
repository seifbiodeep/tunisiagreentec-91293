import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, AlertTriangle, Eye } from 'lucide-react';
import { Problem } from '@/hooks/useProblems';

interface ProblemCardProps {
  problem: Problem;
  onViewDetails: (problem: Problem) => void;
}

export const ProblemCard = ({ problem, onViewDetails }: ProblemCardProps) => {
  const getDangerColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return 'Résolu';
      case 'in-progress': return 'En cours';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const getDangerText = (level: string) => {
    switch (level) {
      case 'high': return 'Élevé';
      case 'medium': return 'Modéré';
      case 'low': return 'Faible';
      default: return 'Inconnu';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      {problem.image_url && (
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <img 
            src={problem.image_url} 
            alt={problem.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">
            {problem.title}
          </h3>
          <Badge className={getDangerColor(problem.danger_level)}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {getDangerText(problem.danger_level)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {problem.description}
        </p>

        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="line-clamp-1">{problem.location}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Signalé le {formatDate(problem.created_at)}</span>
        </div>

        <Badge className={getStatusColor(problem.status)}>
          {getStatusText(problem.status)}
        </Badge>
      </CardContent>

      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewDetails(problem)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );
};
