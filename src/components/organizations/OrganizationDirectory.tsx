import { useState, useMemo } from 'react';
import { OrganizationCard } from './OrganizationCard';
import { OrganizationFilters, FilterState } from './OrganizationFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Building2, TrendingUp, Users, Award, MapPin, Phone, Globe, Mail } from 'lucide-react';
import { useOrganizations, Organization } from '@/hooks/useOrganizations';

export const OrganizationDirectory = () => {
  const { toast } = useToast();
  const { organizations: dbOrganizations, loading } = useOrganizations();
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'rse_score' | 'distance'>('rating');
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    category: '',
    location: '',
    rating: 0,
    availability: '',
    certification: false,
    rseScore: 0
  });

  // Filtrage et tri des organisations
  const filteredOrganizations = useMemo(() => {
    let filtered = dbOrganizations.filter(org => {
      const matchesSearch = !filters.search || 
        org.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        org.city.toLowerCase().includes(filters.search.toLowerCase()) ||
        (org.specialties && org.specialties.some(s => s.toLowerCase().includes(filters.search.toLowerCase())));
      
      const matchesType = !filters.type || filters.type === 'all' || org.type === filters.type;
      const matchesCategory = !filters.category || filters.category === 'all' || org.category === filters.category;
      const matchesLocation = !filters.location || filters.location === 'all' || org.city.toLowerCase() === filters.location.toLowerCase();
      const matchesRating = org.rating >= filters.rating;
      const matchesAvailability = !filters.availability || filters.availability === 'all' || org.availability_status === filters.availability;
      const matchesCertification = !filters.certification || (org.certifications && org.certifications.length > 0);
      const matchesRseScore = org.rse_score >= filters.rseScore;

      return matchesSearch && matchesType && matchesCategory && matchesLocation && 
             matchesRating && matchesAvailability && matchesCertification && matchesRseScore;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'rse_score':
          return b.rse_score - a.rse_score;
        case 'distance':
          return a.city.localeCompare(b.city);
        default:
          return 0;
      }
    });

    return filtered;
  }, [dbOrganizations, filters, sortBy]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== 0 && value !== false
    ).length;
  }, [filters]);

  const handleContact = (org: Organization) => {
    setSelectedOrganization(org);
    toast({
      title: "Contact initié",
      description: `Préparation du contact avec ${org.name}`,
    });
  };

  const handleRequestQuote = (org: Organization, service: any) => {
    toast({
      title: "Demande de devis",
      description: `Devis demandé pour ${service.name} auprès de ${org.name}`,
    });
  };

  const handleViewDetails = (org: Organization) => {
    setSelectedOrganization(org);
    setIsDetailsOpen(true);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      location: 'all',
      rating: 0,
      availability: 'all',
      certification: false,
      rseScore: 0
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-lg">Chargement des organisations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Annuaire des Organisations RSE</h1>
        <p className="text-muted-foreground mb-6">
          Découvrez et collaborez avec les acteurs du développement durable en Tunisie
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{dbOrganizations.length}</div>
            <div className="text-sm text-muted-foreground">Organisations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {dbOrganizations.reduce((sum, org) => sum + (org.services?.length || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Services</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {dbOrganizations.filter(org => org.availability_status === 'disponible').length}
            </div>
            <div className="text-sm text-muted-foreground">Disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {dbOrganizations.length > 0 ? Math.round(dbOrganizations.reduce((sum, org) => sum + org.rse_score, 0) / dbOrganizations.length) : 0}
            </div>
            <div className="text-sm text-muted-foreground">Score RSE moyen</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <OrganizationFilters
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={resetFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Barre de résultats et tri */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {filteredOrganizations.length} organisation(s) trouvée(s)
          </span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">
              {activeFiltersCount} filtre(s) actif(s)
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Trier par:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="rating">Note</option>
            <option value="rse_score">Score RSE</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>

      {/* Grille des organisations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrganizations.map((org) => (
          <OrganizationCard
            key={org.id}
            organization={org}
            onContact={handleContact}
            onRequestQuote={handleRequestQuote}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune organisation trouvée</h3>
          <p className="text-muted-foreground mb-4">
            Essayez de modifier vos critères de recherche
          </p>
          <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
        </div>
      )}

      {/* Dialog des détails */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedOrganization && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {selectedOrganization.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedOrganization.city}, {selectedOrganization.region}
                      </div>
                      {selectedOrganization.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {selectedOrganization.phone}
                        </div>
                      )}
                      {selectedOrganization.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {selectedOrganization.email}
                        </div>
                      )}
                      {selectedOrganization.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {selectedOrganization.website}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedOrganization.specialties && selectedOrganization.specialties.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Spécialités</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedOrganization.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Statistiques</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>{selectedOrganization.projects_completed} projets</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{selectedOrganization.team_size} membres</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>{selectedOrganization.years_active} ans d&apos;expérience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Score RSE: {selectedOrganization.rse_score}/100</span>
                      </div>
                    </div>
                  </div>

                  {selectedOrganization.certifications && selectedOrganization.certifications.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedOrganization.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedOrganization.services && selectedOrganization.services.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-4">Tous les services</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOrganization.services.map((service) => (
                      <div key={service.id} className="border rounded-lg p-4">
                        <h5 className="font-medium">{service.name}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-medium text-primary">{service.price}</span>
                          {service.impact_level && (
                            <Badge variant={service.impact_level === 'fort' ? 'default' : 'secondary'}>
                              Impact {service.impact_level}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};