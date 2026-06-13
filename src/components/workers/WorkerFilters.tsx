import { SPECIALTIES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';

interface WorkerFiltersProps {
  selectedSpecialty: string | null;
  setSelectedSpecialty: (specialty: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locationQuery: string;
  setLocationQuery: (query: string) => void;
  userLocation?: string | null;
}

export function WorkerFilters({
  selectedSpecialty,
  setSelectedSpecialty,
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  userLocation,
}: WorkerFiltersProps) {
  const clearFilters = () => {
    setSelectedSpecialty(null);
    setSearchQuery('');
    setLocationQuery('');
  };

  const hasActiveFilters = selectedSpecialty || searchQuery || locationQuery;

  return (
    <div className="space-y-6">
      {/* Search Inputs */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Enter location..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="pl-10 h-12 pr-24" // Added padding for button
          />
          {userLocation && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 text-xs text-primary hover:text-primary/80 hover:bg-primary/10"
              onClick={() => setLocationQuery(userLocation)}
            >
              My Location
            </Button>
          )}
        </div>
      </div>

      {/* Specialty Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filter by specialty</span>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? null : specialty)}
              className="rounded-full"
            >
              {specialty}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
