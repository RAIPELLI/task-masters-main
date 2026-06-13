import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Worker, Booking, SPECIALTIES } from '@/types';
import { BookingCard } from '@/components/bookings/BookingCard';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import {
  Briefcase,
  Star,
  IndianRupee,
  Clock,
  Calendar,
  Settings,
  Plus,
  Check,
  MapPin,
  User as UserIcon,
} from 'lucide-react';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const worker = user as Worker;
  const [completedJobs, setCompletedJobs] = useState(worker?.completedJobs || 0);
  const [isAvailable, setIsAvailable] = useState(worker?.isAvailable ?? true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingSpecialties, setIsEditingSpecialties] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [profileData, setProfileData] = useState({
    age: worker?.age?.toString() || '',
    hourlyRate: worker?.hourlyRate?.toString() || '',
    location: worker?.location || '',
    bio: worker?.bio || '',
  });

  useEffect(() => {
    if (worker) {
      setSelectedSpecialties(worker.specialties || []);
      setProfileData({
        age: worker.age?.toString() || '',
        hourlyRate: worker.hourlyRate?.toString() || '',
        location: worker.location || '',
        bio: worker.bio || '',
      });
      setIsAvailable(worker.isAvailable ?? true);
      setCompletedJobs(worker.completedJobs || 0);
    }
  }, [worker]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await api.bookings.list();
        setBookings(bookingsData);
      } catch (error) {
        // toast.error('Failed to load bookings'); // Silent error for polling
        console.error('Failed to load bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
      const interval = setInterval(fetchBookings, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const calculateMonthlyEarnings = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return bookings
      .filter(b =>
        b.status === 'completed' &&
        b.quotedPrice &&
        new Date(b.createdAt) >= firstDayOfMonth
      )
      .reduce((sum, b) => sum + (b.quotedPrice || 0), 0);
  };

  const stats = [
    { icon: Briefcase, label: 'Total Jobs', value: completedJobs, bgColor: 'bg-blue-500/10 border-blue-200/50' },
    { icon: Star, label: 'Rating', value: worker?.rating || 0, bgColor: 'bg-yellow-500/10 border-yellow-200/50' },
    { icon: IndianRupee, label: 'This Month', value: `₹${calculateMonthlyEarnings().toLocaleString()}`, bgColor: 'bg-emerald-500/10 border-emerald-200/50' },
    { icon: Calendar, label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, bgColor: 'bg-amber-500/10 border-amber-200/50' },
    { icon: IndianRupee, label: 'Penalty Balance', value: `₹${worker?.penaltyAmount || 0}`, color: 'text-red-500', bgColor: 'bg-rose-500/10 border-rose-200/50' },
  ];

  const handleToggleAvailability = async (checked: boolean) => {
    try {
      await api.workers.updateMe({ is_available: checked });
      setIsAvailable(checked);
      toast.success(`You are now ${checked ? 'available' : 'busy'}`);
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const handleAccept = async (bookingId: string) => {
    try {
      await api.bookings.update(parseInt(bookingId), { status: 'accepted' });
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'accepted' as const } : b))
      );
      toast.success('Booking accepted!');
    } catch (error) {
      toast.error('Failed to accept booking');
    }
  };

  const handleReject = async (bookingId: string, reason?: string) => {
    try {
      await api.bookings.update(parseInt(bookingId), { status: 'cancelled', cancellation_reason: reason });
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
      );
      if (reason) {
        window.location.reload();
      }
      toast.info('Booking cancelled/rejected');
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleQuote = async (bookingId: string, price: number) => {
    try {
      await api.bookings.update(parseInt(bookingId), { status: 'quoted', quoted_price: price });
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, status: 'quoted' as const, quotedPrice: price } : b
        )
      );
      toast.success('Quote sent to customer!');
    } catch (error) {
      toast.error('Failed to send quote');
    }
  };

  const handleComplete = async (bookingId: string, otp?: string) => {
    try {
      const updatePayload: any = { status: 'completed' };
      if (otp) {
        updatePayload.completion_otp = otp;
      }

      const updatedBooking = await api.bookings.update(parseInt(bookingId), updatePayload);

      // If status didn't change to completed, it means OTP was sent
      if (updatedBooking.status !== 'completed' && !otp) {
        toast.info('OTP sent to customer. Please enter it to verify.');
        return updatedBooking.status;
      }

      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'completed' as const } : b))
      );
      setCompletedJobs(prev => prev + 1);
      toast.success('Work marked as completed!');
      return 'completed';
    } catch (error) {
      toast.error('Failed to update booking status');
      return undefined;
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.workers.updateMe({
        specialties: selectedSpecialties,
        age: profileData.age ? parseInt(profileData.age) : null,
        hourly_rate: profileData.hourlyRate ? parseFloat(profileData.hourlyRate) : null,
        location: profileData.location,
        bio: profileData.bio,
      });
      toast.success('Profile updated successfully');
      setIsEditingSpecialties(false);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleAddCustomSpecialty = () => {
    if (!customSpecialty.trim()) return;
    if (selectedSpecialties.includes(customSpecialty.trim())) {
      toast.error('Specialty already added');
      return;
    }
    setSelectedSpecialties(prev => [...prev, customSpecialty.trim()]);
    setCustomSpecialty('');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {worker?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your bookings and profile
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 glass-card rounded-xl">
            <span className="text-sm font-bold text-foreground uppercase tracking-wide">Availability</span>
            <Switch
              checked={isAvailable}
              onCheckedChange={handleToggleAvailability}
            />
            <Badge className={isAvailable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}>
              {isAvailable ? 'Available' : 'Busy'}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-2xl p-5 relative overflow-hidden group backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${stat.bgColor || 'bg-white/60 border-white/50'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className={`text-2xl font-bold ${stat.color || 'text-foreground'}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* My Profile Details */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">My Profile Details</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingSpecialties(!isEditingSpecialties)}
              className="rounded-full"
            >
              {isEditingSpecialties ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {isEditingSpecialties ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Age</label>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    value={profileData.age}
                    onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Hourly Rate (₹)</label>
                  <Input
                    type="number"
                    placeholder="Rate per hour"
                    value={profileData.hourlyRate}
                    onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Work Area / Address</label>
                  <Input
                    placeholder="e.g. Bandra, Mumbai"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Write a short bio about yourself</label>
                <Textarea
                  placeholder="Tell customers about your experience and skills..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">My Specialties</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Show all selected specialties (including custom ones) */}
                  {selectedSpecialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="hero"
                      className="px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-all"
                      onClick={() => toggleSpecialty(specialty)}
                    >
                      {specialty}
                      <Plus className="w-3 h-3 rotate-45" />
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add custom specialty (e.g. Yoga Instructor)"
                    value={customSpecialty}
                    onChange={(e) => setCustomSpecialty(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSpecialty();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomSpecialty}
                  >
                    Add
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Suggested from our list:</p>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map((specialty) => {
                    const isSelected = selectedSpecialties.includes(specialty as string);
                    if (isSelected) return null; // Already shown in the selected list
                    return (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => toggleSpecialty(specialty as string)}
                        className="px-3 py-1.5 rounded-full text-sm font-medium transition-all bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        <Plus className="w-3 h-3 inline-block mr-1" />
                        {specialty}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="hero"
                  size="sm"
                  onClick={handleUpdateProfile}
                  className="px-8"
                >
                  Save Profile Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Age</div>
                    <div className="text-foreground font-medium">{worker?.age || 'Not set'} years</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Hourly Rate</div>
                    <div className="text-foreground font-medium">₹{worker?.hourlyRate || '0'}/hr</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Location</div>
                    <div className="text-foreground font-medium">{worker?.location || 'Not set'}</div>
                  </div>
                </div>
              </div>

              {worker?.bio && (
                <div className="pt-4 border-t border-border/50">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-2">Professional Bio</div>
                  <p className="text-sm text-foreground leading-relaxed">{worker.bio}</p>
                </div>
              )}

              <div className="pt-4 border-t border-border/50">
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-3">Service Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {worker?.specialties && worker.specialties.length > 0 ? (
                    worker.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-sm px-3 py-1">
                        {specialty}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No specialties selected</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Requests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Booking Requests</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          {bookings.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole="worker"
                  onAccept={() => handleAccept(booking.id)}
                  onReject={() => handleReject(booking.id)}
                  onCancel={(reason) => handleReject(booking.id, reason)}
                  onQuote={(price) => handleQuote(booking.id, price)}
                  onComplete={(otp) => handleComplete(booking.id, otp)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-card rounded-2xl border border-dashed border-slate-300">
              <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h3 className="text-lg font-bold text-foreground mb-2">No pending requests</h3>
              <p className="text-muted-foreground">New booking requests will appear here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
