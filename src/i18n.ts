import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "nav": {
                "findWorkers": "Find Workers",
                "signIn": "Sign In",
                "getStarted": "Get Started",
                "dashboard": "Dashboard",
                "myBookings": "My Bookings",
                "signOut": "Sign Out"
            },
            "processing": "Processing...",
            "hero": {
                "title": "Find Skilled Workers",
                "nearYou": "Near You",
                "subtitle": "Connect with verified service providers. Book instantly, get quotes fast, and enjoy quality service.",
                "trustedBy": "Trusted by users across {{count}} cities"
            },
            "features": {
                "search": { "title": "Find Skilled Workers", "desc": "Browse verified professionals across 15+ service categories in your area." },
                "verify": { "title": "Trusted & Verified", "desc": "All workers are background-verified with ratings and reviews from real customers." },
                "quick": { "title": "Quick Booking", "desc": "Send booking requests and get quotes within minutes, not hours." },
                "quality": { "title": "Quality Guaranteed", "desc": "Satisfaction guaranteed with our rating system and dispute resolution." }
            },
            "cta": {
                "findWorkers": "Find Workers",
                "joinAsWorker": "Join as Worker",
                "signUpFree": "Sign Up Free",
                "browseWorkers": "Browse Workers"
            },
            "popular": "Popular:",
            "stats": {
                "skilledWorkers": "Skilled Workers",
                "jobsCompleted": "Jobs Completed",
                "averageRating": "Average Rating",
                "citiesCovered": "Cities Covered"
            },
            "whyChoose": {
                "title": "Why Choose WorkHub?",
                "subtitle": "We make it easy to find reliable service professionals for all your needs"
            },
            "howItWorks": {
                "title": "How It Works",
                "subtitle": "Get help in just a few simple steps",
                "step1": { "title": "Search & Select", "desc": "Find workers by skill, location, and ratings" },
                "step2": { "title": "Send Request", "desc": "Share job details and your location" },
                "step3": { "title": "Get It Done", "desc": "Worker accepts, sends quote, and completes the job" }
            },
            "ready": {
                "title": "Ready to Get Started?",
                "subtitle": "Join thousands of happy customers and skilled workers on WorkHub today."
            },
            "auth": {
                "welcome": "Welcome",
                "choosePortal": "Choose your portal",
                "customer": { "title": "Customer", "desc": "I need to hire help for tasks" },
                "worker": { "title": "Worker", "desc": "I want to offer my services" },
                "signIn": "Sign In",
                "register": "Register Now",
                "fullName": "Full Name",
                "phone": "Phone Number",
                "email": "Email",
                "password": "Password",
                "enterDashboard": "Enter Dashboard",
                "completeSetup": "Complete Setup",
                "back": "Back to Portal"
            },
            "workers": {
                "title": "Find Skilled Workers",
                "subtitle": "Browse verified professionals and book services instantly",
                "aiMatching": "AI Matching",
                "smartRecs": "Smart recommendations",
                "searching": "Searching...",
                "found": "{{count}} worker found",
                "found_plural": "{{count}} workers found",
                "noWorkers": "No workers found",
                "adjustFilters": "Try adjusting your filters or search query",
                "loading": "Loading workers..."
            },
            "workerCard": {
                "viewProfile": "View Profile",
                "perHour": "/hr",
                "from": "From:",
                "requested": "Requested",
                "scheduled": "Scheduled",
                "quotedAmount": "Quoted Amount",
                "fixedRate": "Fixed Rate",
                "jobRequirements": "Job Requirements",
                "noInstructions": "No specific instructions provided.",
                "cancelReason": "Cancellation Reason",
                "acceptTask": "Accept Task",
                "decline": "Decline",
                "sendQuote": "Send Final Quote",
                "map": "Map",
                "jobCompleted": "Job Completed",
                "needToCancel": "Need to cancel?",
                "confirmBooking": "Confirm Booking",
                "declineQuote": "Decline Quote",
                "withdrawRequest": "Withdraw Request",
                "cancelAppointment": "Cancel Appointment",
                "rateService": "Rate Service Quality",
                "shareExperience": "Share your experience (optional)...",
                "posting": "Posting...",
                "submitFeedback": "Submit Feedback",
                "cancelBooking": "Cancel Booking",
                "selectReason": "Select a reason",
                "keepBooking": "Keep My Booking",
                "yesCancel": "Yes, Cancel",
                "securityCode": "Security Code",
                "otpInstructions": "Ask the customer for the 6-digit OTP to verify completion.",
                "verifyAndPay": "Verify & Get Paid",
                "cancelWarning": "Please select a reason for cancellation. Note: A ₹50 penalty applies for confirmed bookings."
            },
            "dashboard": {
                "welcome": "Welcome, {{name}}!",
                "manage": "Manage your bookings and find workers",
                "stats": {
                    "total": "Total Bookings",
                    "pending": "Pending",
                    "completed": "Completed",
                    "penalty": "Penalty Balance"
                },
                "quickActions": "Quick Actions",
                "myBookings": "My Bookings",
                "viewAll": "View All",
                "noBookings": "No bookings yet",
                "findWorkers": "Find and book workers for your needs",
                "bookWorker": "Book a Worker",
                "loading": "Loading dashboard..."
            },
            "notFound": {
                "title": "Oops! Page not found",
                "returnHome": "Return to Home"
            },
            "bookings": {
                "title": "My Bookings",
                "workerSubtitle": "Manage your booking requests",
                "customerSubtitle": "Track your service bookings",
                "filterBy": "Filter by status",
                "noBookings": "No bookings found",
                "empty": "You don't have any bookings yet",
                "noFilterMatch": "No {{status}} bookings"
            },
            "statuses": {
                "all": "All",
                "pending": "Pending",
                "accepted": "Accepted",
                "quoted": "Quoted",
                "confirmed": "Confirmed",
                "completed": "Completed",
                "cancelled": "Cancelled"
            }
        }
    },
    te: {
        translation: {
            "nav": {
                "findWorkers": "పనివారిని వెతకండి",
                "signIn": "లాగిన్",
                "getStarted": "ప్రారంభించండి",
                "dashboard": "డ్యాష్‌బోర్డ్",
                "myBookings": "నా బుకింగ్‌లు",
                "signOut": "సైన్ అవుట్"
            },
            "processing": "ప్రాసెస్ అవుతోంది...",
            "hero": {
                "title": "నైపుణ్యం కలిగిన పనివారిని",
                "nearYou": "వెతకండి",
                "subtitle": "ధృవీకరించబడిన సేవా ప్రదాతలతో కనెక్ట్ అవ్వండి. తక్షణమే బుక్ చేసుకోండి, వేగంగా కోట్స్ పొందండి మరియు నాణ్యమైన సేవను ఆస్వాదించండి.",
                "trustedBy": "{{count}} నగరాల్లోని వినియోగదారులచే విశ్వసించబడింది"
            },
            "features": {
                "search": { "title": "పనివారిని వెతకండి", "desc": "మీ ప్రాంతంలో 15+ కేటగిరీల్లో ధృవీకరించబడిన నిపుణులను చూడండి." },
                "verify": { "title": "విశ్వసనీయమైనది", "desc": "పనివారందరూ బ్యాక్‌గ్రౌండ్ వెరిఫికేషన్ చేయబడ్డారు మరియు రేటింగ్‌లు కలిగి ఉన్నారు." },
                "quick": { "title": "వేగవంతమైన బుకింగ్", "desc": "గంటల తరబడి కాకుండా నిమిషాల్లోనే బుకింగ్ రిక్వెస్ట్‌లను పంపండి." },
                "quality": { "title": "క్వాలిటీ గ్యారెంటీ", "desc": "మా రేటింగ్ సిస్టమ్ ద్వారా నాణ్యమైన సేవకు హామీ మేము ఇస్తాము।" }
            },
            "cta": {
                "findWorkers": "పనివారిని వెతకండి",
                "joinAsWorker": "పనివారిగా చేరండి",
                "signUpFree": "ఉచితంగా సైన్ అప్ చేయండి",
                "browseWorkers": "పనివారిని చూడండి"
            },
            "popular": "ప్రముఖమైనవి:",
            "stats": {
                "skilledWorkers": "నైపుణ్యం కలిగిన పనివారు",
                "jobsCompleted": "పూర్తయిన పనులు",
                "averageRating": "సగటు రేటింగ్",
                "citiesCovered": "నగరాలు"
            },
            "whyChoose": {
                "title": "WorkHubను ఎందుకు ఎంచుకోవాలి?",
                "subtitle": "మీ అన్ని అవసరాల కోసం విశ్వసనీయ సేవా నిపుణులను కనుగొనడం మేము సులభతరం చేస్తాము"
            },
            "howItWorks": {
                "title": "ఇది ఎలా పని చేస్తుంది",
                "subtitle": "కేవలం కొన్ని సాధారణ దశల్లో సహాయం పొందండి",
                "step1": { "title": "వెతకండి & ఎంచుకోండి", "desc": "నైపుణ్యం, ప్రాంతం మరియు రేటింగ్ ఆధారంగా పనివారిని కనుగొనండి" },
                "step2": { "title": "అభ్యర్థన పంపండి", "desc": "పని వివరాలు మరియు మీ ప్రాంతాన్ని తెలియజేయండి" },
                "step3": { "title": "పని పూర్తి చేసుకోండి", "desc": "పనివాడు అంగీకరించి, కోట్ పంపి, పనిని పూర్తి చేస్తాడు" }
            },
            "ready": {
                "title": "ప్రారంభించడానికి సిద్ధంగా ఉన్నారా?",
                "subtitle": "ఈరోజే WorkHubలో వేలాది మంది హ్యాపీ కస్టమర్‌లు మరియు నైపుణ్యం కలిగిన పనివారితో చేరండి."
            },
            "auth": {
                "welcome": "స్వాగతం",
                "choosePortal": "మీ పోర్టల్‌ని ఎంచుకోండి",
                "customer": { "title": "కస్టమర్", "desc": "నేను పనుల కోసం సహాయం తీసుకోవాలి" },
                "worker": { "title": "పనివాడు", "desc": "నేను నా సేవలను అందించాలనుకుంటున్నాను" },
                "signIn": "లాగిన్",
                "register": "ఇప్పుడే నమోదు చేసుకోండి",
                "fullName": "పూర్తి పేరు",
                "phone": "ఫోన్ నంబర్",
                "email": "ఈమెయిల్",
                "password": "పాస్‌వర్డ్",
                "enterDashboard": "డ్యాష్‌బోర్డ్‌లోకి ప్రవేశించండి",
                "completeSetup": "సెటప్‌ని పూర్తి చేయండి",
                "back": "పోర్టల్‌కు తిరిగి వెళ్ళండి"
            },
            "workers": {
                "title": "నైపుణ్యం కలిగిన పనివారిని వెతకండి",
                "subtitle": "ధృవీకరించబడిన నిపుణులను చూడండి మరియు సేవలను తక్షణమే బుక్ చేసుకోండి",
                "aiMatching": "AI మ్యాచింగ్",
                "smartRecs": "స్మార్ట్ సిఫార్సులు",
                "searching": "వెతుకుతోంది...",
                "found": "{{count}} పనివాడు కనుగొనబడ్డాడు",
                "found_plural": "{{count}} మంది పనివారు కనుగొనబడ్డారు",
                "noWorkers": "పనివారెవరూ కనుగొనబడలేదు",
                "adjustFilters": "మీ ఫిల్టర్‌లు లేదా అన్వేషణను మార్చడానికి ప్రయత్నించండి",
                "loading": "పనివారిని లోడ్ చేస్తోంది..."
            },
            "workerCard": {
                "viewProfile": "ప్రొఫైల్ చూడండి",
                "perHour": "/గం",
                "from": "నుండి:",
                "requested": "అభ్యర్థించబడింది",
                "scheduled": "షెడ్యూల్ చేయబడింది",
                "quotedAmount": "కోట్ చేసిన మొత్తం",
                "fixedRate": "స్థిర ధర",
                "jobRequirements": "పని అవసరాలు",
                "noInstructions": "ఎటువంటి సూచనలు ఇవ్వబడలేదు.",
                "cancelReason": "రద్దు కారణం",
                "acceptTask": "పనిని అంగీకరించు",
                "decline": "తిరస్కరించు",
                "sendQuote": "ఫైనల్ కోట్ పంపండి",
                "map": "మ్యాప్",
                "jobCompleted": "పని పూర్తయింది",
                "needToCancel": "రద్దు చేయాలా?",
                "confirmBooking": "బుకింగ్‌ను ధృవీకరించండి",
                "declineQuote": "కోట్‌ను తిరస్కరించు",
                "withdrawRequest": "అభ్యర్థనను వెనక్కి తీసుకో",
                "cancelAppointment": "అపాయింట్‌మెంట్ రద్దు చేయి",
                "rateService": "సేవ నాణ్యతను రేట్ చేయండి",
                "shareExperience": "మీ అనుభవాన్ని పంచుకోండి (ఆప్షనల్)...",
                "posting": "పోస్ట్ అవుతోంది...",
                "submitFeedback": "అభిప్రాయాన్ని సమర్పించండి",
                "cancelBooking": "బుకింగ్ రద్దు చేయండి",
                "selectReason": "కారణాన్ని ఎంచుకోండి",
                "keepBooking": "బుకింగ్‌ను ఉంచుకో",
                "yesCancel": "అవును, రద్దు చేయి",
                "securityCode": "సెక్యూరిటీ కోడ్",
                "otpInstructions": "ధృవీకరణ కోసం కస్టమర్‌ను 6-అంకెల OTP అడగండి.",
                "verifyAndPay": "వెరిఫై చేసి పేమెంట్ పొందండి",
                "cancelWarning": "దయచేసి రద్దు చేయడానికి కారణాన్ని ఎంచుకోండి. గమనిక: ధృవీకరించబడిన బుకింగ్‌ల రద్దుకు ₹50 పెనాల్టీ వర్తిస్తుంది."
            },
            "dashboard": {
                "welcome": "స్వాగతం, {{name}}!",
                "manage": "మీ బుకింగ్‌లను నిర్వహించండి మరియు పనివారిని వెతకండి",
                "stats": {
                    "total": "మొత్తం బుకింగ్‌లు",
                    "pending": "పెండింగ్‌లో ఉన్నవి",
                    "completed": "పూర్తయినవి",
                    "penalty": "పెనాల్టీ బ్యాలెన్స్"
                },
                "quickActions": "త్వరిత చర్యలు",
                "myBookings": "నా బుకింగ్‌లు",
                "viewAll": "అన్నీ చూడండి",
                "noBookings": "ఇంకా ఏ బుకింగ్‌లు లేవు",
                "findWorkers": "మీ అవసరాల కోసం పనివారిని వెతికి బుక్ చేసుకోండి",
                "bookWorker": "ఒక పనివాడిని బుక్ చేయండి",
                "loading": "డ్యాష్‌బోర్డ్‌ను లోడ్ చేస్తోంది..."
            },
            "notFound": {
                "title": "అయ్యో! పేజీ కనుగొనబడలేదు",
                "returnHome": "హోమ్‌కి తిరిగి వెళ్ళండి"
            },
            "bookings": {
                "title": "నా బుకింగ్‌లు",
                "workerSubtitle": "మీ బుకింగ్ అభ్యర్థనలను నిర్వహించండి",
                "customerSubtitle": "మీ సేవా బుకింగ్‌లను ట్రాక్ చేయండి",
                "filterBy": "స్థితి ప్రకారం ఫిల్టర్ చేయండి",
                "noBookings": "బుకింగ్‌లు కనుగొనబడలేదు",
                "empty": "మీకు ఇంకా ఏ బుకింగ్‌లు లేవు",
                "noFilterMatch": "{{status}} బుకింగ్‌లు లేవు"
            },
            "statuses": {
                "all": "అన్నీ",
                "pending": "పెండింగ్‌లో ఉన్నాయి",
                "accepted": "అంగీకరించబడ్డాయి",
                "quoted": "కోట్ చేయబడ్డాయి",
                "confirmed": "ధృవీకరించబడ్డాయి",
                "completed": "పూర్తయ్యాయి",
                "cancelled": "రద్దు చేయబడ్డాయి"
            }
        }
    },
    hi: {
        translation: {
            "nav": {
                "findWorkers": "कामगार खोजें",
                "signIn": "लॉगिन करें",
                "getStarted": "शुरू करें",
                "dashboard": "डैशबोर्ड",
                "myBookings": "मेरी बुकिंग",
                "signOut": "साइन आउट"
            },
            "processing": "प्रोसेसिंग...",
            "hero": {
                "title": "कुशल कामगार",
                "nearYou": "खोजें",
                "subtitle": "सत्यापित सेवा प्रदाताओं से जुड़ें। तुरंत बुक करें, तेजी से कोटेशन प्राप्त करें और गुणवत्तापूर्ण सेवा का आनंद लें।",
                "trustedBy": "{{count}} शहरों के उपयोगकर्ताओं द्वारा भरोसेमंद"
            },
            "features": {
                "search": { "title": "कुशल कामगार खोजें", "desc": "अपने क्षेत्र में 15+ श्रेणियों में सत्यापित पेशेवरों को देखें।" },
                "verify": { "title": "भरोसेमंद और सत्यापित", "desc": "सभी कामगारों की पृष्ठभूमि सत्यापित है और वास्तविक ग्राहकों से रेटिंग प्राप्त है।" },
                "quick": { "title": "त्वरित बुकिंग", "desc": "घंटों नहीं, मिनटों में बुकिंग अनुरोध भेजें और कोटेशन प्राप्त करें।" },
                "quality": { "title": "गुणवत्ता की गारंटी", "desc": "हमारे रेटिंग सिस्टम और विवाद समाधान के साथ संतुष्टि की गारंटी।" }
            },
            "cta": {
                "findWorkers": "कामगार खोजें",
                "joinAsWorker": "कामगार के रूप में जुड़ें",
                "signUpFree": "मुफ्त में साइन अप करें",
                "browseWorkers": "कामगारों को ब्राउज़ करें"
            },
            "popular": "लोकप्रिय:",
            "stats": {
                "skilledWorkers": "कुशल कामगार",
                "jobsCompleted": "काम पूरे हुए",
                "averageRating": "औसत रेटिंग",
                "citiesCovered": "शहरों में उपलब्ध"
            },
            "whyChoose": {
                "title": "WorkHub क्यों चुनें?",
                "subtitle": "हम आपकी सभी जरूरतों के लिए विश्वसनीय सेवा पेशेवरों को ढूंढना आसान बनाते हैं"
            },
            "howItWorks": {
                "title": "यह कैसे काम करता है",
                "subtitle": "बस कुछ सरल चरणों में मदद प्राप्त करें",
                "step1": { "title": "खोजें और चुनें", "desc": "कौशल, स्थान और रेटिंग के आधार पर कामगार खोजें" },
                "step2": { "title": "अनुरोध भेजें", "desc": "काम के विवरण और अपना स्थान साझा करें" },
                "step3": { "title": "काम पूरा करवाएं", "desc": "कामगार स्वीकार करता है, कोटेशन भेजता है और काम पूरा करता है" }
            },
            "ready": {
                "title": "शुरू करने के लिए तैयार हैं?",
                "subtitle": "आज ही WorkHub पर हजारों खुश ग्राहकों और कुशल कामगारों से जुड़ें।"
            },
            "auth": {
                "welcome": "स्वागत है",
                "choosePortal": "अपना पोर्टल चुनें",
                "customer": { "title": "ग्राहक", "desc": "मुझे काम के लिए मदद चाहिए" },
                "worker": { "title": "कामगार", "desc": "मैं अपनी सेवाएं देना चाहता हूं" },
                "signIn": "लॉगिन करें",
                "register": "अभी पंजीकरण करें",
                "fullName": "पूरा नाम",
                "phone": "फ़ोन नंबर",
                "email": "ईमेल",
                "password": "पासवर्ड",
                "enterDashboard": "डैशबोर्ड में प्रवेश करें",
                "completeSetup": "सेटअप पूरा करें",
                "back": "पोर्टल पर वापस जाएं"
            },
            "workers": {
                "title": "कुशल कामगार खोजें",
                "subtitle": "सत्यापित पेशेवरों को ब्राउज़ करें और तुरंत सेवाएं बुक करें",
                "aiMatching": "एआई मैचिंग",
                "smartRecs": "स्मार्ट सिफारिशें",
                "searching": "खोज रहे हैं...",
                "found": "{{count}} कामगार मिला",
                "found_plural": "{{count}} कामगार मिले",
                "noWorkers": "कोई कामगार नहीं मिला",
                "adjustFilters": "अपने फिल्टर या खोज को बदलने का प्रयास करें",
                "loading": "कामगारों को लोड कर रहा है..."
            },
            "workerCard": {
                "viewProfile": "प्रोफ़ाइल देखें",
                "perHour": "/घंटा",
                "from": "से:",
                "requested": "अनुरोध किया गया",
                "scheduled": "निर्धारित",
                "quotedAmount": "कोट की गई राशि",
                "fixedRate": "निश्चित दर",
                "jobRequirements": "कार्य की आवश्यकताएं",
                "noInstructions": "कोई निर्देश नहीं दिया गया।",
                "cancelReason": "रद्द करने का कारण",
                "acceptTask": "कार्य स्वीकार करें",
                "decline": "अस्वीकार करें",
                "sendQuote": "अंतिम कोटेशन भेजें",
                "map": "मानचित्र",
                "jobCompleted": "कार्य पूरा हुआ",
                "needToCancel": "रद्द करना चाहते हैं?",
                "confirmBooking": "बुकिंग की पुष्टि करें",
                "declineQuote": "कोटेशन अस्वीकार करें",
                "withdrawRequest": "अनुरोध वापस लें",
                "cancelAppointment": "अपॉइंटमेंट रद्द करें",
                "rateService": "सेवा की गुणवत्ता रेट करें",
                "shareExperience": "अपना अनुभव साझा करें (वैकल्पिक)...",
                "posting": "पोस्ट हो रहा है...",
                "submitFeedback": "फीडबैक भेजें",
                "cancelBooking": "बुकिंग रद्द करें",
                "selectReason": "एक कारण चुनें",
                "keepBooking": "बुकिंग बनाए रखें",
                "yesCancel": "हां, रद्द करें",
                "securityCode": "सुरक्षा कोड",
                "otpInstructions": "सत्यापन के लिए ग्राहक से 6-अंकीय ओटीपी मांगें।",
                "verifyAndPay": "सत्यापित करें और भुगतान प्राप्त करें",
                "cancelWarning": "कृपया रद्दीकरण का कारण चुनें। नोट: पुष्ट बुकिंग के लिए ₹50 का जुर्माना लागू होता है।"
            },
            "dashboard": {
                "welcome": "स्वागत है, {{name}}!",
                "manage": "अपनी बुकिंग प्रबंधित करें और कामगार खोजें",
                "stats": {
                    "total": "कुल बुकिंग",
                    "pending": "लंबित",
                    "completed": "पूरा हुआ",
                    "penalty": "जुर्माना राशि"
                },
                "quickActions": "त्वरित कार्रवाई",
                "myBookings": "मेरी बुकिंग",
                "viewAll": "सभी देखें",
                "noBookings": "अभी तक कोई बुकिंग नहीं",
                "findWorkers": "अपनी जरूरतों के लिए कामगार खोजें और बुक करें",
                "bookWorker": "कामगार बुक करें",
                "loading": "डैशबोर्ड लोड हो रहा है..."
            },
            "notFound": {
                "title": "ओह! पेज नहीं मिला",
                "returnHome": "होम पर वापस जाएं"
            },
            "bookings": {
                "title": "मेरी बुकिंग",
                "workerSubtitle": "अपने बुकिंग अनुरोधों को प्रबंधित करें",
                "customerSubtitle": "अपनी सेवा बुकिंग को ट्रैक करें",
                "filterBy": "स्थिति के आधार पर फिल्टर करें",
                "noBookings": "कोई बुकिंग नहीं मिली",
                "empty": "आपकी अभी तक कोई बुकिंग नहीं है",
                "noFilterMatch": "कोई {{status}} बुकिंग नहीं"
            },
            "statuses": {
                "all": "सभी",
                "pending": "लंबित",
                "accepted": "स्वीकृत",
                "quoted": "कोट किया गया",
                "confirmed": "पुष्टि की गई",
                "completed": "पूरा हुआ",
                "cancelled": "रद्द किया गया"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
