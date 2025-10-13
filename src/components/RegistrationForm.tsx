
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, Building, Users } from 'lucide-react';

const tunisianGovernorates = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
  'Béja', 'Jendouba', 'Kef', 'Siliana', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
  'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Gafsa', 'Tozeur', 'Kebili',
  'Gabès', 'Medenine', 'Tataouine'
];

const RegistrationForm = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    governorate: '',
    municipality: '',
    userType: '',
    organizationName: '',
    organizationDescription: '',
    socialMediaLinks: '',
    services: '',
    prices: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would handle the actual registration
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rejoignez Tunisia Green Tech</h2>
            <p className="text-gray-600">Créez votre compte et commencez à faire la différence</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Inscription</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type d'utilisateur */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Type d'utilisateur</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'citoyen', label: 'Citoyen', icon: User, color: 'green' },
                      { value: 'association', label: 'Association', icon: Users, color: 'blue' },
                      { value: 'societe', label: 'Société/Organisation', icon: Building, color: 'purple' }
                    ].map(({ value, label, icon: Icon, color }) => (
                      <Card 
                        key={value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          userType === value ? `ring-2 ring-${color}-500 bg-${color}-50` : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setUserType(value);
                          handleInputChange('userType', value);
                        }}
                      >
                        <CardContent className="p-4 text-center">
                          <Icon className={`h-8 w-8 mx-auto mb-2 text-${color}-600`} />
                          <span className="font-medium">{label}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Informations personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input 
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input 
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Numéro de téléphone *</Label>
                    <Input 
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+216 XX XXX XXX"
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="governorate">Gouvernorat *</Label>
                    <Select onValueChange={(value) => handleInputChange('governorate', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre gouvernorat" />
                      </SelectTrigger>
                      <SelectContent>
                        {tunisianGovernorates.map((gov) => (
                          <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="municipality">Municipalité *</Label>
                    <Input 
                      id="municipality"
                      value={formData.municipality}
                      onChange={(e) => handleInputChange('municipality', e.target.value)}
                      required 
                    />
                  </div>
                </div>

                {/* Champs spécifiques selon le type d'utilisateur */}
                {(userType === 'association' || userType === 'societe') && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Informations {userType === 'association' ? 'de l\'association' : 'de l\'organisation'}
                    </h3>
                    
                    <div>
                      <Label htmlFor="organizationName">
                        Nom de {userType === 'association' ? 'l\'association' : 'l\'organisation'} *
                      </Label>
                      <Input 
                        id="organizationName"
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        required 
                      />
                    </div>

                    <div>
                      <Label htmlFor="organizationDescription">Description</Label>
                      <Textarea 
                        id="organizationDescription"
                        value={formData.organizationDescription}
                        onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                        placeholder="Décrivez brièvement vos activités..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="socialMediaLinks">Réseaux sociaux</Label>
                      <Textarea 
                        id="socialMediaLinks"
                        value={formData.socialMediaLinks}
                        onChange={(e) => handleInputChange('socialMediaLinks', e.target.value)}
                        placeholder="Facebook: ..., Instagram: ..., LinkedIn: ..."
                        rows={2}
                      />
                    </div>

                    {userType === 'societe' && (
                      <div>
                        <Label htmlFor="services">Services et tarifs</Label>
                        <Textarea 
                          id="services"
                          value={formData.services}
                          onChange={(e) => handleInputChange('services', e.target.value)}
                          placeholder="Listez vos services avec les prix (minimum 1000 TND + 10% de frais Tunisia Green Tech)"
                          rows={4}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note importante :</strong> Tunisia Green Tech applique des frais de service de 10% 
                    sur toutes les transactions. Le montant minimum d&apos;intervention est de 1000 TND.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                  disabled={!userType}
                >
                  Créer mon compte
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
