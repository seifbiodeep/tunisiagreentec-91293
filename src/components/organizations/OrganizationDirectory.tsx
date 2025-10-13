import { useState, useMemo } from 'react';
import { OrganizationCard, Organization } from './OrganizationCard';
import { OrganizationFilters, FilterState } from './OrganizationFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Building2, TrendingUp, Users, Award, MapPin, Phone, Globe, Mail } from 'lucide-react';

// Données enrichies d'organisations RSE
const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'EcoClean Tunisie',
    type: 'entreprise',
    category: 'environnement',
    location: { city: 'Tunis', region: 'Grand Tunis' },
    contact: {
      phone: '+216 71 123 456',
      email: 'contact@ecoclean.tn',
      website: 'www.ecoclean.tn',
      socialMedia: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/ecoclean-tunisie' }
      ]
    },
    rating: 4.8,
    certifications: ['ISO 14001', 'RSE Tunisie', 'B-Corp'],
    services: [
      {
        id: 's1',
        name: 'Nettoyage de décharges',
        description: 'Intervention complète avec équipement professionnel',
        price: '1500 TND',
        duration: '2-3 jours',
        category: 'nettoyage',
        impact: 'fort'
      },
      {
        id: 's2',
        name: 'Traitement des eaux usées',
        description: 'Solutions écologiques pour le traitement',
        price: '2500 TND',
        duration: '1-2 semaines',
        category: 'traitement',
        impact: 'fort'
      }
    ],
    stats: {
      projectsCompleted: 150,
      yearsActive: 8,
      teamSize: 25,
      clientsSatisfied: 140
    },
    availability: { status: 'disponible' },
    rseScore: 92,
    specialties: ['Décontamination', 'Recyclage', 'Audit environnemental']
  },
  {
    id: '2',
    name: 'Association Verte Tunisie',
    type: 'association',
    category: 'environnement',
    location: { city: 'Sfax', region: 'Centre' },
    contact: {
      phone: '+216 74 987 654',
      email: 'info@vertetunisie.org',
      socialMedia: [
        { platform: 'Facebook', url: 'https://facebook.com/vertetunisie' },
        { platform: 'Instagram', url: 'https://instagram.com/vertetunisie' }
      ]
    },
    rating: 4.6,
    certifications: ['Agrément gouvernemental', 'Label Eco-Association'],
    services: [
      {
        id: 's3',
        name: 'Sensibilisation environnementale',
        description: 'Programmes éducatifs pour écoles et entreprises',
        price: 'Gratuit',
        duration: '1 jour',
        category: 'education',
        impact: 'moyen'
      },
      {
        id: 's4',
        name: 'Plantation d\'arbres',
        description: 'Campagnes de reboisement participatif',
        price: '800 TND',
        duration: '1 jour',
        category: 'plantation',
        impact: 'fort'
      }
    ],
    stats: {
      projectsCompleted: 85,
      yearsActive: 12,
      teamSize: 15,
      clientsSatisfied: 200
    },
    availability: { status: 'disponible' },
    rseScore: 88,
    specialties: ['Éducation environnementale', 'Reboisement', 'Mobilisation citoyenne']
  },
  {
    id: '3',
    name: 'SocialTech Solutions',
    type: 'entreprise',
    category: 'social',
    location: { city: 'Sousse', region: 'Centre-Est' },
    contact: {
      phone: '+216 73 456 789',
      email: 'contact@socialtech.tn',
      website: 'www.socialtech.tn'
    },
    rating: 4.7,
    certifications: ['ISO 26000', 'Great Place to Work'],
    services: [
      {
        id: 's5',
        name: 'Formation professionnelle',
        description: 'Programmes d\'insertion pour jeunes défavorisés',
        price: '1200 TND',
        duration: '3 mois',
        category: 'formation',
        impact: 'fort'
      }
    ],
    stats: {
      projectsCompleted: 45,
      yearsActive: 5,
      teamSize: 20,
      clientsSatisfied: 80
    },
    availability: { status: 'occupé', nextAvailable: '2024-02-15' },
    rseScore: 85,
    specialties: ['Inclusion sociale', 'Formation numérique', 'Entrepreneuriat social']
  }
];

export const OrganizationDirectory = () => {
  const { toast } = useToast();
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'rseScore' | 'distance'>('rating');
  
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
    let filtered = mockOrganizations.filter(org => {
      const matchesSearch = !filters.search || 
        org.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        org.location.city.toLowerCase().includes(filters.search.toLowerCase()) ||
        org.specialties.some(s => s.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesType = !filters.type || org.type === filters.type;
      const matchesCategory = !filters.category || org.category === filters.category;
      const matchesLocation = !filters.location || org.location.city.toLowerCase() === filters.location.toLowerCase();
      const matchesRating = org.rating >= filters.rating;
      const matchesAvailability = !filters.availability || org.availability.status === filters.availability;
      const matchesCertification = !filters.certification || org.certifications.length > 0;
      const matchesRseScore = org.rseScore >= filters.rseScore;

      return matchesSearch && matchesType && matchesCategory && matchesLocation && 
             matchesRating && matchesAvailability && matchesCertification && matchesRseScore;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'rseScore':
          return b.rseScore - a.rseScore;
        case 'distance':
          // Ici on pourrait calculer la distance réelle
          return a.location.city.localeCompare(b.location.city);
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, sortBy]);

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

  const handleRequestQuote = (org: Organization, service: Organization['services'][0]) => {
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
      type: '',
      category: '',
      location: '',
      rating: 0,
      availability: '',
      certification: false,
      rseScore: 0
    });
  };

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
            <div className="text-2xl font-bold text-primary">{mockOrganizations.length}</div>
            <div className="text-sm text-muted-foreground">Organisations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {mockOrganizations.reduce((sum, org) => sum + org.services.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Services</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {mockOrganizations.filter(org => org.availability.status === 'disponible').length}
            </div>
            <div className="text-sm text-muted-foreground">Disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round(mockOrganizations.reduce((sum, org) => sum + org.rseScore, 0) / mockOrganizations.length)}
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
            <option value="rseScore">Score RSE</option>
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
                        {selectedOrganization.location.city}, {selectedOrganization.location.region}
                      </div>
                      {selectedOrganization.contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {selectedOrganization.contact.phone}
                        </div>
                      )}
                      {selectedOrganization.contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {selectedOrganization.contact.email}
                        </div>
                      )}
                      {selectedOrganization.contact.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {selectedOrganization.contact.website}
                        </div>
                      )}
                    </div>
                  </div>

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
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Statistiques</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>{selectedOrganization.stats.projectsCompleted} projets</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{selectedOrganization.stats.teamSize} membres</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>{selectedOrganization.stats.yearsActive} ans d'expérience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Score RSE: {selectedOrganization.rseScore}/100</span>
                      </div>
                    </div>
                  </div>

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
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-4">Tous les services</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOrganization.services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <h5 className="font-medium">{service.name}</h5>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium text-primary">{service.price}</span>
                        <Badge variant={service.impact === 'fort' ? 'default' : 'secondary'}>
                          Impact {service.impact}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};