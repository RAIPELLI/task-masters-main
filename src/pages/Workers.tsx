import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { WorkerCard } from '@/components/workers/WorkerCard';
import { WorkerFilters } from '@/components/workers/WorkerFilters';
import { api } from '@/lib/api';
import { Worker } from '@/types';
import { Users, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { VoiceSearch } from '@/components/voice/VoiceSearch';

export default function Workers() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const initialSpecialty = searchParams.get('specialty');

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(initialSpecialty);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [useAI, setUseAI] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const [hasInitializedLocation, setHasInitializedLocation] = useState(false);

  // Effect to sync state with URL params (e.g. from Voice Navigation)
  useEffect(() => {
    const specialty = searchParams.get('specialty');
    if (specialty) {
      setSelectedSpecialty(specialty);
    }
  }, [searchParams]);

  // Effect to handle voice data passed via navigation state
  useEffect(() => {
    if (location.state?.voiceData) {
      const { scheduled_date, job_details, message } = location.state.voiceData;
      if (scheduled_date || job_details) {
        toast.info(`Voice Request: ${job_details || 'Booking'} for ${scheduled_date ? new Date(scheduled_date).toLocaleString() : 'soon'}`, {
          duration: 5000,
        });
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated && user?.location && !hasInitializedLocation) {
      setLocationQuery(user.location);
      setHasInitializedLocation(true);
    }
  }, [isAuthenticated, user, hasInitializedLocation]);

  useEffect(() => {
    const fetchWorkers = async () => {
      setIsLoading(true);
      try {
        let data;
        if (useAI && isAuthenticated) {
          data = await api.workers.recommend(selectedSpecialty || undefined);
        } else {
          data = await api.workers.list(selectedSpecialty || undefined);
        }
        setWorkers(data);
      } catch (error) {
        toast.error('Failed to load workers');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkers();
  }, [selectedSpecialty, useAI, isAuthenticated]);

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      // Filter by search query (name or specialty)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = worker.name.toLowerCase().includes(query);
        const matchesSpecialty = worker.specialties.some((s) =>
          s.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesSpecialty) {
          return false;
        }
      }

      // Filter by location
      if (locationQuery) {
        const query = locationQuery.toLowerCase();
        if (!worker.location?.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [workers, searchQuery, locationQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('workers.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('workers.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Voice Search Button */}
            <div className="hidden md:block">
              <VoiceSearch className="w-12 h-12" />
            </div>

            {isAuthenticated && (
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/20 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary uppercase tracking-wider">{t('workers.aiMatching')}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight">{t('workers.smartRecs')}</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-primary/10 mx-1" />
                <Switch
                  checked={useAI}
                  onCheckedChange={setUseAI}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-6 mb-8 relative">
          <div className="absolute top-6 right-6 md:hidden">
            <VoiceSearch />
          </div>
          <WorkerFilters
            selectedSpecialty={selectedSpecialty}
            setSelectedSpecialty={setSelectedSpecialty}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            userLocation={user?.location}
          />
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {isLoading
              ? t('workers.searching')
              : t('workers.found', { count: filteredWorkers.length, count_plural: t('workers.found_plural', { count: filteredWorkers.length }) })}
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">{t('workers.loading')}</div>
        ) : filteredWorkers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">{t('workers.noWorkers')}</h3>
            <p className="text-muted-foreground">
              {t('workers.adjustFilters')}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
