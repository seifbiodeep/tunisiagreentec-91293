import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProblemsList } from '@/components/problems/ProblemsList';
import { ProblemsMap } from '@/components/problems/ProblemsMap';
import { ProblemDetailsDialog } from '@/components/problems/ProblemDetailsDialog';
import { useProblems, Problem } from '@/hooks/useProblems';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Map, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Problems = () => {
  const { problems, loading } = useProblems();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (problem: Problem) => {
    setSelectedProblem(problem);
    setDetailsOpen(true);
  };

  const handleReportProblem = () => {
    navigate('/#problem-reporting');
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Chargement des problèmes...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Problèmes Écologiques
                </h1>
                <p className="text-muted-foreground text-lg">
                  Suivez et consultez tous les problèmes écologiques signalés en Tunisie
                </p>
              </div>
              
              {user && (
                <Button 
                  size="lg"
                  onClick={handleReportProblem}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Signaler un problème
                </Button>
              )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total</div>
                <div className="text-3xl font-bold text-foreground">{problems.length}</div>
              </div>
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">En attente</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {problems.filter(p => p.status === 'pending').length}
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">En cours</div>
                <div className="text-3xl font-bold text-blue-600">
                  {problems.filter(p => p.status === 'in-progress').length}
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">Résolus</div>
                <div className="text-3xl font-bold text-green-600">
                  {problems.filter(p => p.status === 'resolved').length}
                </div>
              </div>
            </div>

          </div>

          {/* Tabs for List and Map views */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Carte
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <ProblemsList 
                problems={problems} 
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
            
            <TabsContent value="map">
              <ProblemsMap 
                problems={problems} 
                onSelectProblem={handleViewDetails}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Details Dialog */}
      <ProblemDetailsDialog
        problem={selectedProblem}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
};

export default Problems;
