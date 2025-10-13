import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Globe, DollarSign, ExternalLink, Star, Users, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Organization } from '@/hooks/useOrganizations';

interface OrganizationCardProps {
  organization: Organization;
  onContact: (org: Organization) => void;
  onRequestQuote: (org: Organization, service: any) => void;
  onViewDetails: (org: Organization) => void;
}

export const OrganizationCard = ({ 
  organization, 
  onContact, 
  onRequestQuote, 
  onViewDetails 
}: OrganizationCardProps) => {
  const { toast } = useToast();

  const handleCall = () => {
    if (organization.phone) {
      window.open(`tel:${organization.phone}`, '_self');
      toast({
        title: "Appel en cours",
        description: `Appel vers ${organization.name}`,
      });
    }
  };

  const handleVisitWebsite = () => {
    if (organization.website) {
      const url = organization.website.startsWith('http') 
        ? organization.website 
        : `https://${organization.website}`;
      window.open(url, '_blank');
    }
  };

  const getTypeColor = (type: Organization['type']) => {
    switch (type) {
      case 'entreprise': return 'bg-blue-100 text-blue-800';
      case 'association': return 'bg-green-100 text-green-800';
      case 'ong': return 'bg-purple-100 text-purple-800';
      case 'gouvernemental': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (status: Organization['availability_status']) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'occupé': return 'bg-red-100 text-red-800';
      case 'en_pause': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 flex items-center gap-2">
              {organization.name}
              {organization.rse_score > 85 && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getTypeColor(organization.type)}>
                {organization.type}
              </Badge>
              <Badge variant="outline">
                {organization.category}
              </Badge>
              <Badge className={getAvailabilityColor(organization.availability_status)}>
                {organization.availability_status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{organization.rating}/5</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{organization.team_size} membres</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{organization.years_active} ans</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{organization.city}, {organization.region}</span>
        </div>

        {organization.phone && (
          <button
            onClick={handleCall}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-full text-left"
          >
            <Phone className="h-4 w-4" />
            <span>{organization.phone}</span>
          </button>
        )}

        {organization.website && (
          <button
            onClick={handleVisitWebsite}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-full text-left"
          >
            <Globe className="h-4 w-4" />
            <span>{organization.website}</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        )}

        {organization.certifications && organization.certifications.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-sm">Certifications RSE</h4>
            <div className="flex flex-wrap gap-1">
              {organization.certifications.slice(0, 3).map((cert, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {cert}
                </Badge>
              ))}
              {organization.certifications.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{organization.certifications.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {organization.services && organization.services.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Services phares</h4>
            <div className="space-y-2">
              {organization.services.slice(0, 2).map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-sm">{service.name}</span>
                    <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-primary">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold text-sm">{service.price}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onRequestQuote(organization, service)}
                      className="mt-1 text-xs"
                    >
                      Devis
                    </Button>
                  </div>
                </div>
              ))}
              {organization.services.length > 2 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  +{organization.services.length - 2} autres services
                </p>
              )}
            </div>
          </div>
        )}

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Score RSE</span>
            <span className="text-lg font-bold text-primary">{organization.rse_score}/100</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${organization.rse_score}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-4">
          <Button 
            variant="outline"
            onClick={() => onViewDetails(organization)}
            className="text-sm"
          >
            Voir détails
          </Button>
          <Button 
            onClick={() => onContact(organization)}
            className="text-sm"
          >
            Contacter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export type { Organization };