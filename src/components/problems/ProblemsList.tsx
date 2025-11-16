import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProblemCard } from './ProblemCard';
import { Problem } from '@/hooks/useProblems';
import { Search } from 'lucide-react';

interface ProblemsListProps {
  problems: Problem[];
  onViewDetails: (problem: Problem) => void;
}

export const ProblemsList = ({ problems, onViewDetails }: ProblemsListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dangerFilter, setDangerFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  const filteredAndSortedProblems = useMemo(() => {
    let filtered = [...problems];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(problem => problem.status === statusFilter);
    }

    // Danger level filter
    if (dangerFilter !== 'all') {
      filtered = filtered.filter(problem => problem.danger_level === dangerFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'danger-high':
          const dangerOrder = { high: 3, medium: 2, low: 1 };
          return (dangerOrder[b.danger_level] || 0) - (dangerOrder[a.danger_level] || 0);
        case 'danger-low':
          const dangerOrderLow = { high: 3, medium: 2, low: 1 };
          return (dangerOrderLow[a.danger_level] || 0) - (dangerOrderLow[b.danger_level] || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [problems, searchQuery, statusFilter, dangerFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un problème..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="resolved">Résolu</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dangerFilter} onValueChange={setDangerFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Niveau de danger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="high">Élevé</SelectItem>
              <SelectItem value="medium">Modéré</SelectItem>
              <SelectItem value="low">Faible</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récent</SelectItem>
              <SelectItem value="oldest">Plus ancien</SelectItem>
              <SelectItem value="danger-high">Danger décroissant</SelectItem>
              <SelectItem value="danger-low">Danger croissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredAndSortedProblems.length} problème(s) trouvé(s)
        </div>
      </div>

      {/* Problems Grid */}
      {filteredAndSortedProblems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Aucun problème trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
