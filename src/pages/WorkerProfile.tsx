import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Worker } from '@/types';
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Briefcase,
  ArrowLeft,
  Calendar,
  User as UserIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function WorkerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    location: '',
    jobDetails: '',
    scheduledDate: '',
  });

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        // Since we don't have a single worker fetch endpoint yet, we'll fetch all and filter
        // In a real app, you'd have GET /workers/{id}
        const workers = await api.workers.list();
        const found = workers.find((w: Worker) => w.id.toString() === id);
        setWorker(found || null);
      } catch (error) {
        toast.error('Failed to load worker profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorker();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Worker not found</h1>
          <Link to="/workers">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book a worker');
      navigate('/auth?mode=login');
      return;
    }

    try {
      if (!worker.id) {
        throw new Error("Worker ID is missing");
      }

      const specialty = (worker.specialties && worker.specialties.length > 0)
        ? worker.specialties[0]
        : 'General';

      await api.bookings.create({
        workerId: parseInt(worker.id),
        specialty: specialty,
        location: bookingData.location,
        jobDetails: bookingData.jobDetails,
        scheduledDate: bookingData.scheduledDate,
      });
      toast.success('Booking request sent successfully!');
      setIsBookingOpen(false);
      setBookingData({ location: '', jobDetails: '', scheduledDate: '' });
    } catch (error: any) {
      const message = error.message || 'Failed to send booking request';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <Link
          to="/workers"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workers
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="glass-card rounded-2xl p-8 mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-violet-500/10 to-blue-500/10" />
              <div className="flex flex-col md:flex-row gap-8 relative">
                <div className="relative shrink-0">
                  <img
                    src={worker.avatar || `https://ui-avatars.com/api/?name=${worker.name}&background=8b5cf6&color=fff&size=150`}
                    alt={worker.name}
                    className="w-32 h-32 rounded-2xl object-cover ring-4 ring-white shadow-xl"
                  />
                  {worker.isAvailable && (
                    <div className="absolute -bottom-3 -right-3 px-3 py-1.5 bg-green-500 text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-lg ring-2 ring-white">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Available
                    </div>
                  )}
                </div>

                <div className="flex-1 pt-2 md:pt-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                    {worker.name}
                  </h1>

                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-violet-500" />
                      {worker.location || 'Location not set'}
                    </div>
                    {worker.age && (
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-violet-500" />
                        {worker.age} years old
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-slate-900">{worker.rating}</span>
                      <span>({worker.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-violet-500" />
                      {worker.completedJobs} jobs completed
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {worker.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="bg-white/50 border-slate-200 text-slate-700 px-3 py-1">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="glass-card rounded-2xl p-8 mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-violet-500" />
                About
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {worker.bio || 'No bio available.'}
              </p>
            </div>

            {/* Reviews Placeholder */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-violet-500" />
                Reviews
              </h2>
              <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Star className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                <p>Reviews will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="glass-card rounded-2xl p-6 sticky top-24 border-t-4 border-t-violet-500 shadow-xl">
              <div className="text-center mb-8 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-4xl font-bold text-slate-900">
                  ₹{worker.hourlyRate || 0}
                </div>
                <div className="text-slate-500 text-sm font-medium uppercase tracking-wide mt-1">per hour</div>
              </div>

              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={!worker.isAvailable}
                  >
                    {worker.isAvailable ? 'Book Now' : 'Currently Unavailable'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Book {worker.name}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBooking} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Job Location</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="location"
                            placeholder="Enter your address"
                            value={bookingData.location}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, location: e.target.value })
                            }
                            className="pl-10"
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          title="Use Current Location"
                          onClick={() => {
                            if ('geolocation' in navigator) {
                              toast.info("Fetching location...");
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  const { latitude, longitude } = position.coords;
                                  setBookingData(prev => ({
                                    ...prev,
                                    location: `${latitude}, ${longitude}`
                                  }));
                                  toast.success("Location updated!");
                                },
                                (error) => {
                                  toast.error("Could not get location. Please enter manually.");
                                  console.error(error);
                                }
                              );
                            } else {
                              toast.error("Geolocation not supported");
                            }
                          }}
                        >
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Preferred Slot</Label>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="date"
                            id="booking-date"
                            className="pl-10"
                            required
                            onChange={(e) => {
                              const date = e.target.value;
                              const currentStart = bookingData.scheduledDate ? bookingData.scheduledDate.split('T')[1]?.substring(0, 5) : '';
                              setBookingData(prev => ({
                                ...prev,
                                scheduledDate: currentStart ? `${date}T${currentStart}` : `${date}T09:00`
                              }));
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Start Time</span>
                            <Input
                              type="time"
                              required
                              onChange={(e) => {
                                const time = e.target.value;
                                const date = bookingData.scheduledDate ? bookingData.scheduledDate.split('T')[0] : new Date().toISOString().split('T')[0];
                                setBookingData(prev => ({
                                  ...prev,
                                  scheduledDate: `${date}T${time}`
                                }));
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">End Time</span>
                            <Input
                              type="time"
                              id="end-time"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="details">Job Details</Label>
                      <Textarea
                        id="details"
                        placeholder="Describe the work you need done..."
                        value={bookingData.jobDetails}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, jobDetails: e.target.value })
                        }
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="button" variant="hero" className="w-full" onClick={(e) => {
                      e.preventDefault();
                      // Manual submit to capture End Time
                      const form = e.currentTarget.closest('form');
                      if (!form?.checkValidity()) {
                        form?.reportValidity();
                        return;
                      }

                      const endTimeInput = form.querySelector('#end-time') as HTMLInputElement;
                      const endTime = endTimeInput?.value;

                      // Append slot info to details logic
                      const startTime = bookingData.scheduledDate.split('T')[1];
                      const date = bookingData.scheduledDate.split('T')[0];

                      const finalJobDetails = `${bookingData.jobDetails}\n\n[Scheduled Slot: ${date} | ${startTime} - ${endTime}]`;

                      // Call the original handleBooking logic but with modified details
                      // We need to call api.bookings.create directly or update state then submit?
                      // Better to call create directly here 

                      if (!isAuthenticated) {
                        toast.error('Please login to book a worker');
                        navigate('/auth?mode=login');
                        return;
                      }

                      if (!worker?.id) return;

                      const specialty = (worker.specialties?.[0]) || 'General';

                      api.bookings.create({
                        workerId: parseInt(worker.id),
                        specialty: specialty,
                        location: bookingData.location,
                        jobDetails: finalJobDetails,
                        scheduledDate: bookingData.scheduledDate,
                      }).then(() => {
                        toast.success('Booking request sent successfully!');
                        setIsBookingOpen(false);
                        setBookingData({ location: '', jobDetails: '', scheduledDate: '' });
                      }).catch((err: any) => {
                        toast.error(err.message || 'Failed');
                      });
                    }}>
                      Send Booking Request
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <div className="mt-6 pt-6 border-t border-border space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{worker.phone || 'Contact after booking'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{worker.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Usually responds within 1 hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
