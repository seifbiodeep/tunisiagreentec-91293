import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, MapPin, Star, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export interface FilterState {
  search: string;
  type: string;
  category: string;
  location: string;
  rating: number;
  availability: string;
  certification: boolean;
  rseScore: number;
}

interface OrganizationFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
}

export const OrganizationFilters = ({ 
  filters, 
  onFiltersChange, 
  onResetFilters,
  activeFiltersCount 
}: OrganizationFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      {/* Recherche principale */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une organisation, service ou ville..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtres rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Type d'organisation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="entreprise">Entreprise</SelectItem>
            <SelectItem value="association">Association</SelectItem>
            <SelectItem value="ong">ONG</SelectItem>
            <SelectItem value="gouvernement">Gouvernement</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Domaine RSE" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les domaines</SelectItem>
            <SelectItem value="environnement">Environnement</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="economique">Économique</SelectItem>
            <SelectItem value="gouvernance">Gouvernance</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Localisation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les régions</SelectItem>
            <SelectItem value="tunis">Tunis</SelectItem>
            <SelectItem value="sfax">Sfax</SelectItem>
            <SelectItem value="sousse">Sousse</SelectItem>
            <SelectItem value="bizerte">Bizerte</SelectItem>
            <SelectItem value="gabes">Gabès</SelectItem>
            <SelectItem value="kairouan">Kairouan</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.availability} onValueChange={(value) => updateFilter('availability', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Disponibilité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="disponible">Disponible</SelectItem>
            <SelectItem value="occupé">Occupé</SelectItem>
            <SelectItem value="en_pause">En pause</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bouton filtres avancés */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres avancés
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={onResetFilters}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Note minimale */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Note minimale
              </label>
              <Select 
                value={filters.rating.toString()} 
                onValueChange={(value) => updateFilter('rating', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Toutes les notes</SelectItem>
                  <SelectItem value="3">3+ étoiles</SelectItem>
                  <SelectItem value="4">4+ étoiles</SelectItem>
                  <SelectItem value="5">5 étoiles uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Score RSE minimal */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Score RSE minimal
              </label>
              <Select 
                value={filters.rseScore.toString()} 
                onValueChange={(value) => updateFilter('rseScore', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tous les scores</SelectItem>
                  <SelectItem value="50">50+ points</SelectItem>
                  <SelectItem value="70">70+ points</SelectItem>
                  <SelectItem value="85">85+ points (Certifié)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Localisation précise */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ma localisation
              </label>
              <Button
                variant="outline"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                      // Ici on pourrait utiliser les coordonnées pour filtrer par proximité
                      console.log('Position:', position.coords);
                    });
                  }
                }}
                className="w-full justify-start"
              >
                Utiliser ma position
              </Button>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Certifications RSE</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="certification"
                checked={filters.certification}
                onChange={(e) => updateFilter('certification', e.target.checked)}
                className="rounded border-input"
              />
              <label htmlFor="certification" className="text-sm">
                Organisations certifiées uniquement
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};