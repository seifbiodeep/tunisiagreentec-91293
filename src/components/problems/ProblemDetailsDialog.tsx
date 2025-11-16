import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Problem } from '@/hooks/useProblems';
import { MapPin, Calendar, AlertTriangle, User, ExternalLink } from 'lucide-react';

interface ProblemDetailsDialogProps {
  problem: Problem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProblemDetailsDialog = ({ problem, open, onOpenChange }: ProblemDetailsDialogProps) => {
  if (!problem) return null;

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOpenMap = () => {
    if (problem.location_lat && problem.location_lng) {
      const mapsUrl = `https://www.google.com/maps?q=${problem.location_lat},${problem.location_lng}`;
      window.open(mapsUrl, '_blank');
    } else if (problem.location) {
      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(problem.location)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{problem.title}</DialogTitle>
          <DialogDescription>
            Détails complets du problème signalé
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {problem.image_url && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img 
                src={problem.image_url} 
                alt={problem.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Badge className={getDangerColor(problem.danger_level)}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              Danger: {getDangerText(problem.danger_level)}
            </Badge>
            <Badge className={getStatusColor(problem.status)}>
              Statut: {getStatusText(problem.status)}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Description</h4>
              <p className="text-foreground">{problem.description}</p>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Localisation</h4>
                <p className="text-foreground">{problem.location}</p>
                {(problem.location_lat && problem.location_lng) && (
                  <p className="text-sm text-muted-foreground">
                    Coordonnées: {problem.location_lat}, {problem.location_lng}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Date de signalement</h4>
                <p className="text-foreground">{formatDate(problem.created_at)}</p>
              </div>
            </div>

            {problem.updated_at !== problem.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Dernière mise à jour</h4>
                  <p className="text-foreground">{formatDate(problem.updated_at)}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">ID du signaleur</h4>
                <p className="text-foreground text-xs font-mono">{problem.reporter_id}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleOpenMap}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ouvrir sur la carte
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
