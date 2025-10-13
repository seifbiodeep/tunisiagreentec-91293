
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, MapPin, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProblems } from '@/hooks/useProblems';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ProblemReporting = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dangerLevel, setDangerLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { createProblem, refetch } = useProblems();
  const { toast } = useToast();
  const navigate = useNavigate();

  const dangerLevels = [
    { value: 'low' as const, label: 'Faible', color: 'green', description: 'Problème mineur, action non urgente' },
    { value: 'medium' as const, label: 'Modéré', color: 'yellow', description: 'Attention requise, intervention recommandée' },
    { value: 'high' as const, label: 'Élevé', color: 'red', description: 'Problème grave, intervention urgente nécessaire' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          toast({
            title: "Position obtenue",
            description: "Votre position GPS a été ajoutée au signalement",
          });
        },
        (error) => {
          toast({
            title: "Erreur de géolocalisation",
            description: "Impossible d'obtenir votre position",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour signaler un problème",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await createProblem({
        title,
        description,
        location,
        danger_level: dangerLevel,
        status: 'pending'
      });

      toast({
        title: "Problème signalé",
        description: "Votre signalement a été enregistré avec succès",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setDangerLevel('low');
      setSelectedImage(null);
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de signaler le problème",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Signaler un Problème Écologique</h2>
          <p className="text-gray-600 mb-8">Vous devez être connecté pour signaler un problème</p>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => navigate('/auth')}
          >
            Se connecter
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Signaler un Problème Écologique</h2>
            <p className="text-gray-600">Aidez-nous à protéger l'environnement en signalant les problèmes que vous observez</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Nouveau Signalement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="problemTitle">Titre du problème *</Label>
                  <Input 
                    id="problemTitle"
                    placeholder="Ex: Décharge sauvage, Pollution de rivière..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description détaillée *</Label>
                  <Textarea 
                    id="description"
                    placeholder="Décrivez le problème observé, son ampleur, les conséquences potentielles..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required 
                  />
                </div>

                <div>
                  <Label>Niveau de danger *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {dangerLevels.map(({ value, label, color, description }) => (
                      <Card 
                        key={value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          dangerLevel === value ? `ring-2 ring-${color}-500 bg-${color}-50` : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setDangerLevel(value)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className={`w-4 h-4 rounded-full bg-${color}-500 mx-auto mb-2`}></div>
                          <h4 className="font-medium">{label}</h4>
                          <p className="text-xs text-gray-600 mt-1">{description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Emplacement *</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="location"
                      placeholder="Adresse précise ou coordonnées GPS"
                      className="flex-1"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={handleGetLocation}
                      title="Obtenir ma position GPS"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Photo du problème</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label 
                        htmlFor="image"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 mb-4 text-gray-500" />
                          {selectedImage ? (
                            <p className="text-sm text-gray-500">{selectedImage.name}</p>
                          ) : (
                            <>
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Cliquez pour uploader</span>
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG ou JPEG (MAX. 10MB)</p>
                            </>
                          )}
                        </div>
                        <input 
                          id="image" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Important :</strong> Un signalement précis avec photo et localisation 
                    permet une intervention plus rapide et efficace.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                  disabled={loading}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le signalement'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemReporting;
