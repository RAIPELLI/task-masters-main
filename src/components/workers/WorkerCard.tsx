import { Worker } from '@/types';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WorkerCardProps {
  worker: Worker;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const { t } = useTranslation();
  return (
    <div className="group glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-violet-500/30">
      {/* Header with availability badge */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={worker.avatar || `https://ui-avatars.com/api/?name=${worker.name}&background=8b5cf6&color=fff`}
              alt={worker.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20 group-hover:ring-violet-500/50 transition-all"
            />
            {worker.isAvailable && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-lg text-foreground truncate group-hover:text-violet-600 transition-colors">
                {worker.name}
              </h3>
              {worker.matchScore && (
                <Badge variant="hero" className="h-6 px-2 text-[10px] gap-1 shrink-0 animate-pulse-subtle shadow-violet-500/20">
                  <Sparkles className="w-3 h-3 fill-current" />
                  {Math.round(worker.matchScore)}% {t('workerCard.match')}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{worker.location}</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-slate-700 text-sm">{worker.rating}</span>
                <span className="text-slate-400 text-xs">({worker.reviewCount})</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${worker.isAvailable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {worker.isAvailable ? t('workerCard.available') : t('workerCard.busy')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {worker.specialties.map((specialty) => (
            <Badge key={specialty} variant="outline" className="text-xs bg-white/50 border-slate-200">
              {specialty}
            </Badge>
          ))}
        </div>
      </div>

      {/* Bio */}
      {worker.bio && (
        <div className="px-6 pb-4">
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{worker.bio}</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-white/20 backdrop-blur-sm flex items-center justify-between group-hover:bg-violet-50/30 transition-colors">
        <div>
          <span className="text-xl font-bold text-slate-900">₹{worker.hourlyRate}</span>
          <span className="text-slate-500 text-sm font-medium">{t('workerCard.perHour')}</span>
        </div>
        <Link to={`/workers/${worker.id}`}>
          <Button variant="default" size="sm" className="shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40">
            {t('workerCard.viewProfile')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
