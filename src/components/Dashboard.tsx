
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Eye, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useProblems } from '@/hooks/useProblems';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { problems, loading } = useProblems();
  const { user } = useAuth();
  const { toast } = useToast();

  const getDangerColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return 'Résolu';
      case 'in-progress': return 'En cours';
      case 'pending': return 'En attente';
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
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleViewDetails = (problem: any) => {
    toast({
      title: "Détails du problème",
      description: `${problem.title} - ${problem.location}`,
    });
  };

  const handleTakeCharge = (problem: any) => {
    toast({
      title: "Prise en charge",
      description: "Fonctionnalité à implémenter : prise en charge du problème",
    });
  };

  const handleOpenMap = (location: string) => {
    if (location.includes(',')) {
      const [lat, lng] = location.split(',').map(coord => coord.trim());
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(mapsUrl, '_blank');
    } else {
      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  // Statistiques
  const totalProblems = problems.length;
  const pendingProblems = problems.filter(p => p.status === 'pending').length;
  const resolvedProblems = problems.filter(p => p.status === 'resolved').length;
  const resolutionRate = totalProblems > 0 ? Math.round((resolvedProblems / totalProblems) * 100) : 0;

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Chargement...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tableau de Bord</h2>
          <p className="text-gray-600">Suivez les problèmes écologiques signalés et leur résolution</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Signalements</p>
                  <p className="text-3xl font-bold text-gray-900">{totalProblems}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingProblems}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Résolus</p>
                  <p className="text-3xl font-bold text-green-600">{resolvedProblems}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de Résolution</p>
                  <p className="text-3xl font-bold text-purple-600">{resolutionRate}%</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des problèmes */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Problèmes Récents</h3>
          {problems.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">Aucun problème signalé pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            problems.slice(0, 10).map((problem) => (
              <Card key={problem.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden">
                      {problem.image_url ? (
                        <img 
                          src={problem.image_url} 
                          alt={problem.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Pas d'image
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xl font-semibold text-gray-900">{problem.title}</h4>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getDangerColor(problem.danger_level)}`}></div>
                          <span className="text-sm text-gray-600">{getDangerText(problem.danger_level)}</span>
                          <Badge className={getStatusColor(problem.status)}>
                            {getStatusText(problem.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-2">{problem.description}</p>
                      
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleOpenMap(problem.location)}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                            title="Ouvrir dans Google Maps"
                          >
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{problem.location}</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{formatDate(problem.created_at)}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(problem)}
                        >
                          Voir les détails
                        </Button>
                        {problem.status === 'pending' && user && (
                          <Button 
                            className="bg-green-600 hover:bg-green-700" 
                            size="sm"
                            onClick={() => handleTakeCharge(problem)}
                          >
                            Prendre en charge
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
