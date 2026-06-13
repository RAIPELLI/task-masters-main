import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Star,
  Briefcase,
  Wrench,
  CheckCircle,
  X,
  ArrowRight,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { ChatDialog } from '@/components/chat/ChatDialog';

interface BookingCardProps {
  booking: Booking;
  userRole: 'worker' | 'master';
  onAccept?: () => void;
  onReject?: () => void;
  onQuote?: (price: number) => void;
  onConfirm?: () => void;
  onCancel?: (reason?: string) => void;
  onComplete?: (otp?: string) => Promise<string | void>;
  onRate?: (rating: number, review: string) => void;
}

const statusThemes: Record<string, {
  bg: string;
  border: string;
  text: string;
  lightBg: string;
  iconBg: string;
  iconColor: string;
}> = {
  pending: {
    bg: 'bg-amber-500',
    border: 'border-amber-200',
    text: 'text-amber-700',
    lightBg: 'bg-amber-50/50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  accepted: {
    bg: 'bg-blue-500',
    border: 'border-blue-200',
    text: 'text-blue-700',
    lightBg: 'bg-blue-50/50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  quoted: {
    bg: 'bg-purple-500',
    border: 'border-purple-200',
    text: 'text-purple-700',
    lightBg: 'bg-purple-50/50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  confirmed: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    lightBg: 'bg-emerald-50/50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  completed: {
    bg: 'bg-primary',
    border: 'border-indigo-100',
    text: 'text-indigo-700',
    lightBg: 'bg-indigo-50/40',
    iconBg: 'bg-indigo-100/80',
    iconColor: 'text-indigo-600',
  },
  cancelled: {
    bg: 'bg-rose-500',
    border: 'border-rose-100',
    text: 'text-rose-700',
    lightBg: 'bg-rose-50/50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
};

export function BookingCard({
  booking,
  userRole,
  onAccept,
  onReject,
  onQuote,
  onConfirm,
  onCancel,
  onComplete,
  onRate,
}: BookingCardProps) {
  const { t } = useTranslation();

  const statusLabels: Record<string, string> = {
    pending: t('statuses.pending'),
    accepted: t('statuses.accepted'),
    quoted: t('statuses.quoted'),
    confirmed: t('statuses.confirmed'),
    completed: t('statuses.completed'),
    cancelled: t('statuses.cancelled'),
  };

  const theme = statusThemes[booking.status] || statusThemes.pending;
  const [quotePrice, setQuotePrice] = useState('500');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');

  const handleCompleteClick = async () => {
    const newStatus = await onComplete?.();
    if (newStatus && newStatus !== 'completed') {
      setShowOtpDialog(true);
    }
  };

  const submitOtp = async () => {
    if (!otp) return;
    const newStatus = await onComplete?.(otp);
    if (newStatus === 'completed') {
      setShowOtpDialog(false);
      setOtp('');
    }
  };

  const cancellationReasons = userRole === 'worker' ? [
    "I'm not coming",
    "Personal Emergency",
    "Transport Issue",
    "Double Booked",
    "Other"
  ] : [
    "I don't want work",
    "Found another worker",
    "Changed plans",
    "Worker unavailable",
    "Other"
  ];

  const handleCancelClick = () => {
    if (booking.status === 'confirmed') {
      setShowCancelDialog(true);
    } else {
      onCancel?.();
    }
  };

  const confirmCancellation = () => {
    const reason = cancelReason === 'Other' ? customReason : cancelReason;
    if (!reason) {
      alert("Please select a reason for cancellation.");
      return;
    }

    if (booking.status === 'confirmed') {
      if (window.confirm("Warning: Cancelling a confirmed booking will incur a ₹50 penalty. Do you wish to proceed?")) {
        (onCancel as any)?.(reason);
        setShowCancelDialog(false);
      }
    } else {
      onCancel?.();
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 group">
      {/* Upper Color Bar */}
      <div className={`h-2 w-full ${theme.bg}`} />

      {/* Header Section */}
      <div className="p-6 pb-4 flex items-start justify-between">
        <div className="flex gap-4">
          <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center shrink-0`}>
            <Briefcase className={`w-7 h-7 ${theme.iconColor}`} />
          </div>
          <div className="flex flex-col">
            <h3 className="font-extrabold text-xl text-slate-900 tracking-tight leading-tight">
              {booking.specialty}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                {t('workerCard.from')}
              </span>
              <span className="text-sm font-bold text-slate-600">
                {userRole === 'worker' ? booking.masterName : booking.workerName}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={`${theme.bg} text-white hover:${theme.bg} border-0 px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-black rounded-full`}>
            {statusLabels[booking.status]}
          </Badge>
          <span className="text-[10px] font-bold text-slate-400">{format(new Date(booking.createdAt), 'MMM d, h:mm a')}</span>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="px-6 space-y-5">

        {/* Location Section - Always Featured */}
        <div
          className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:bg-white hover:border-violet-200 hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group/loc"
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.location)}`, '_blank')}
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 group-hover/loc:bg-violet-50 transition-colors">
            <MapPin className="w-5 h-5 text-violet-500" />
          </div>
          <p className="text-sm font-bold text-slate-700 leading-snug line-clamp-2">
            {booking.location}
          </p>
        </div>

        {/* Scheduling & Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Requested</p>
              <p className="text-sm font-bold text-slate-700">{format(new Date(booking.createdAt), 'MMM d, h:mm a')}</p>
            </div>
          </div>

          {booking.scheduledDate && (
            <div className="bg-indigo-50 border border-indigo-100/50 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest leading-none mb-1">{t('workerCard.scheduled')}</p>
                <p className="text-sm font-bold text-slate-900">{format(new Date(booking.scheduledDate), 'MMM d, h:mm a')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Price Feature - Highlighted if present */}
        {booking.quotedPrice && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center justify-between group-hover:scale-[1.01] transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-black text-emerald-600/70 uppercase tracking-[0.1em] leading-none mb-1">{t('workerCard.quotedAmount')}</p>
                <p className="text-2xl font-black text-emerald-950">₹{booking.quotedPrice}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-emerald-600/50 uppercase">{t('workerCard.fixedRate')}</p>
            </div>
          </div>
        )}

        {/* Job Description section */}
        <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Wrench className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <CheckCircle className="w-3 h-3" /> {t('workerCard.jobRequirements')}
          </p>
          <p className="text-sm text-slate-700 font-medium leading-relaxed italic pr-8">
            "{booking.jobDetails || t('workerCard.noInstructions')}"
          </p>
        </div>

        {/* Cancellation Message */}
        {booking.status === 'cancelled' && booking.cancellationReason && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 items-start">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
              <X className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest leading-none mb-1">{t('workerCard.cancelReason')}</p>
              <p className="text-sm font-medium text-slate-800 leading-tight">{booking.cancellationReason}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 p-5 pt-0">
        <div className="bg-slate-50/80 rounded-2.5xl p-2 border border-slate-100 flex items-center justify-center gap-2">
          {userRole === 'worker' && (
            <div className="w-full flex flex-col gap-2">
              {booking.status === 'pending' && (
                <div className="flex gap-2 p-1">
                  <Button variant="hero" size="lg" onClick={onAccept} className="flex-1 rounded-2xl shadow-xl shadow-primary/20 h-12">
                    {t('workerCard.acceptTask')}
                  </Button>
                  <Button variant="outline" size="lg" onClick={onReject} className="flex-1 rounded-2xl h-12 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all">
                    {t('workerCard.decline')}
                  </Button>
                </div>
              )}
              {booking.status === 'accepted' && (
                <div className="flex flex-col p-2 gap-3">
                  <div className="relative group">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="number"
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                      className="pl-12 h-14 bg-white border-slate-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 text-lg font-bold"
                      placeholder="500"
                    />
                  </div>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => onQuote?.(parseFloat(quotePrice))}
                    className="w-full rounded-2xl h-14 shadow-xl shadow-primary/20 flex gap-3 text-base"
                    disabled={!quotePrice}
                  >
                    {t('workerCard.sendQuote')}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
              {booking.status === 'confirmed' && (
                <div className="flex flex-col gap-2 p-1">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="bg-white h-12 rounded-2xl flex gap-2 font-bold text-slate-700"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.location)}`, '_blank')}
                    >
                      <MapPin className="w-4 h-4 text-violet-500" />
                      {t('workerCard.map')}
                    </Button>
                    <ChatDialog
                      otherUserId={booking.masterId}
                      otherUserName={booking.masterName}
                      className="w-full"
                    />
                  </div>
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white flex gap-3 font-bold"
                    onClick={handleCompleteClick}
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    {t('workerCard.jobCompleted')}
                  </Button>
                  <button
                    className="mt-1 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors py-2"
                    onClick={handleCancelClick}
                  >
                    {t('workerCard.needToCancel')}
                  </button>
                </div>
              )}
            </div>
          )}

          {userRole === 'master' && (
            <div className="w-full flex flex-col gap-2">
              {booking.status === 'quoted' && (
                <div className="flex gap-2 p-1">
                  <Button variant="hero" size="lg" onClick={onConfirm} className="flex-1 rounded-2xl shadow-xl shadow-primary/20 h-12">
                    {t('workerCard.confirmBooking')}
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => onCancel?.()} className="flex-1 rounded-2xl h-12 border-rose-200 text-rose-600 hover:bg-rose-50 transition-all">
                    {t('workerCard.declineQuote')}
                  </Button>
                </div>
              )}
              {booking.status === 'pending' && (
                <Button variant="outline" onClick={() => onCancel?.()} className="w-full h-12 rounded-2xl text-slate-500 border-dashed border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300">
                  {t('workerCard.withdrawRequest')}
                </Button>
              )}
              {booking.status === 'confirmed' && (
                <div className="flex flex-col gap-2 p-1">
                  <ChatDialog
                    otherUserId={booking.workerId}
                    otherUserName={booking.workerName}
                    className="w-full"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-slate-400 font-bold hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                    onClick={handleCancelClick}
                  >
                    {t('workerCard.cancelAppointment')}
                  </Button>
                </div>
              )}
              {booking.status === 'completed' && !booking.rating && (
                <div className="flex flex-col p-2 gap-5 animate-slide-up">
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{t('workerCard.rateService')}</p>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`transition-all duration-300 hover:scale-125 ${star <= rating ? 'text-amber-400 delay-100' : 'text-slate-200'}`}
                        >
                          <Star className={`w-9 h-9 ${star <= rating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Input
                      placeholder={t('workerCard.shareExperience')}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="bg-white h-12 rounded-2xl border-inset focus:ring-4 focus:ring-primary/10"
                    />
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full rounded-2xl h-14 shadow-lg shadow-primary/20 text-base"
                      disabled={!rating || isSubmittingRating}
                      onClick={async () => {
                        setIsSubmittingRating(true);
                        await onRate?.(rating, review);
                        setIsSubmittingRating(false);
                      }}
                    >
                      {isSubmittingRating ? t('workerCard.posting') : t('workerCard.submitFeedback')}
                    </Button>
                  </div>
                </div>
              )}
              {booking.status === 'completed' && booking.rating && (
                <div className="p-5 bg-amber-50 rounded-2.5xl border border-amber-100 flex flex-col items-center animate-fade-in relative overflow-hidden">
                  <div className="absolute -top-1 -right-1 opacity-10">
                    <Star className="w-16 h-16 text-amber-500 fill-current" />
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= (booking.rating || 0) ? 'text-amber-400 fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  {booking.review && (
                    <p className="text-sm text-slate-700 font-bold italic text-center relative z-10">
                      "{booking.review}"
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Re-using defined Dialogs at end of component */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="rounded-3xl border-0 shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">{t('workerCard.cancelBooking')}</DialogTitle>
            <DialogDescription className="text-slate-500 text-base">
              {t('workerCard.cancelWarning')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                {t('workerCard.cancelReason')}
              </label>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger className="bg-slate-50 border-slate-100 h-14 rounded-2xl font-bold">
                  <SelectValue placeholder={t('workerCard.selectReason')} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-0 shadow-xl overflow-hidden p-1">
                  {cancellationReasons.map((reason) => (
                    <SelectItem key={reason} value={reason} className="rounded-xl h-11 font-medium">
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {cancelReason === 'Other' && (
              <div className="space-y-3 animate-fade-in">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                  Please Specify
                </label>
                <Input
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Tell us more..."
                  className="bg-slate-50 border-slate-100 h-14 rounded-2xl font-bold"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-3 sm:gap-0 mt-4">
            <Button variant="ghost" onClick={() => setShowCancelDialog(false)} className="rounded-2xl h-14 font-bold text-slate-500">
              {t('workerCard.keepBooking')}
            </Button>
            <Button variant="destructive" onClick={confirmCancellation} className="rounded-2xl h-14 font-bold px-8 shadow-lg shadow-rose-500/20">
              {t('workerCard.yesCancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="rounded-3xl border-0 shadow-2xl p-10 max-w-sm">
          <DialogHeader className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">{t('workerCard.securityCode')}</DialogTitle>
            <DialogDescription className="text-slate-500 pt-2 text-base font-medium">
              {t('workerCard.otpInstructions')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="text-center text-4xl tracking-[0.3em] bg-slate-50 border-slate-100 h-20 rounded-3xl font-black text-primary focus:ring-8 focus:ring-primary/10"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="hero"
              onClick={submitOtp}
              disabled={otp.length !== 6}
              className="w-full h-16 rounded-3xl text-lg font-black shadow-xl shadow-primary/20"
            >
              {t('workerCard.verifyAndPay')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
