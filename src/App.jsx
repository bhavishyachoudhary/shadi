import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import ProfileDetailModal from './components/ProfileDetailModal';
import LifestyleReelsModal from './components/LifestyleReelsModal';
import ParivarMeetModal from './components/ParivarMeetModal';
import GunaMilanCalculator from './components/GunaMilanCalculator';
import DashboardInbox from './components/DashboardInbox';
import NotificationsModal from './components/NotificationsModal';
import RecentVisitorsView from './components/RecentVisitorsView';
import RegistrationWizard from './components/RegistrationWizard';
import DeleteAccountModal from './components/DeleteAccountModal';
import MembershipPlans from './components/MembershipPlans';
import FloatingChatWidget from './components/FloatingChatWidget';
import Footer from './components/Footer';
import MandatoryOnboardingModal from './components/MandatoryOnboardingModal';
import { useAuth } from './context/AuthContext';

import { mockProfiles } from './data/mockProfiles';
import { getMinDistanceToCenters } from './utils/distance';
import { CheckCircle2, MessageCircle } from 'lucide-react';

export default function App() {
  const { authUser, isLoggedIn, feedGender, login, logout, updateAuthUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('search');
  // Map-only mode — no card view
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Derive currentUser from authUser (falls back to demo account)
  const currentUser = authUser ? {
    id: authUser.id || authUser.userUniqueId,
    name: authUser.name || authUser.fullName || 'Guest User',
    gender: authUser.gender || 'Groom',
    photo: authUser.photo || null,
    profileCreatedBy: 'Self',
    isLocked: authUser.isLocked ?? false,
    lockedFields: authUser.lockedFields || ['name', 'gender']
  } : {
    name: 'Rohan Verma',
    gender: 'Groom',
    profileCreatedBy: 'Self'
  };

  // Search Filter State — auto-uses feedGender from auth context (opposite of user's gender)
  const [filters, setFilters] = useState({
    gender: feedGender || 'Bride',
    religion: 'All',
    motherTongue: 'All',
    city: 'All',
    selectedCityKeys: ['Bengaluru', 'Mumbai'],
    radiusKm: 100,
    showOutOfRadius: true,
    maxAge: 35,
    minIncome: 'All',
    manglik: 'All',
    diet: 'All',
    verifiedOnly: false
  });

  // Keep filters.gender in sync whenever authUser's gender changes
  const correctFeedGender = (authUser?.gender === 'Groom') ? 'Bride' : 'Groom';

  const handleAuthSuccess = (userData) => {
    // Generate unique account ID & set profileComplete: false to trigger mandatory onboarding
    const uniqueUserId = `USER_${Math.floor(100000 + Math.random() * 900000)}`;
    const loggedInUser = login({
      ...userData,
      id: uniqueUserId,
      profileComplete: false, // Triggers mandatory onboarding gate before landing page!
    });
    setIsAuthOpen(false);
    showToast(`🔒 Account ${uniqueUserId} Created! Please complete mandatory profile setup.`);
  };

  const handleCompleteOnboarding = (onboardingData) => {
    updateAuthUser({
      ...onboardingData,
      name: onboardingData.fullName,
      profileComplete: true,
      isLocked: true,
      lockedFields: ['name', 'gender'],
    });

    const targetFeedGender = onboardingData.gender === 'Groom' ? 'Bride' : 'Groom';
    setFilters(prev => ({ ...prev, gender: targetFeedGender }));
    showToast(`🎉 Mandatory Setup Complete! Feed set to verified ${targetFeedGender} profiles.`);
  };

  const handleLogout = () => {
    logout();
    setFilters(prev => ({ ...prev, gender: 'Bride' }));
    showToast('👋 Logged out successfully.');
  };

  const [profiles, setProfiles] = useState(mockProfiles);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedReelsProfile, setSelectedReelsProfile] = useState(null);
  const [selectedParivarProfile, setSelectedParivarProfile] = useState(null);
  const [activeFloatingChat, setActiveFloatingChat] = useState(null); // profile object or null
  
  // User interactions with multi-state interest: 'sent' | 'accepted' | 'declined' | undefined
  const [interestMap, setInterestMap] = useState({
    101: 'accepted', // Ananya: Accepted (Green)
    103: 'declined', // Dr. Priya: Declined (Red)
    102: 'sent'      // Rohan: Sent (Teal)
  });
  const sentInterests = Object.keys(interestMap).filter(id => interestMap[id]).map(Number);
  const [shortlistedIds, setShortlistedIds] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([
    {
      id: 501,
      senderId: 102,
      message: 'Namaste! I went through your profile and found our educational backgrounds very compatible.'
    }
  ]);

  // Live Recent Visitors State (Unique per profileId)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const [recentVisitors, setRecentVisitors] = useState([
    { id: 101, profileId: 101, firstVisitDate: todayDateStr, firstVisitTimeToday: '08:30 AM', visitedTime: 'First: 08:30 AM', visitTimeDetails: 'First Visit Today at 08:30 AM', visitCountToday: 3 }, // Ananya (Bride)
    { id: 103, profileId: 103, firstVisitDate: todayDateStr, firstVisitTimeToday: '09:15 AM', visitedTime: 'First: 09:15 AM', visitTimeDetails: 'First Visit Today at 09:15 AM', visitCountToday: 2 }, // Dr. Priya (Bride)
    { id: 105, profileId: 105, firstVisitDate: todayDateStr, firstVisitTimeToday: '10:00 AM', visitedTime: 'First: 10:00 AM', visitTimeDetails: 'First Visit Today at 10:00 AM', visitCountToday: 1 }, // Saniya (Bride)
    { id: 102, profileId: 102, firstVisitDate: todayDateStr, firstVisitTimeToday: '08:45 AM', visitedTime: 'First: 08:45 AM', visitTimeDetails: 'First Visit Today at 08:45 AM', visitCountToday: 4 }, // Rohan (Groom)
    { id: 104, profileId: 104, firstVisitDate: todayDateStr, firstVisitTimeToday: '11:20 AM', visitedTime: 'First: 11:20 AM', visitTimeDetails: 'First Visit Today at 11:20 AM', visitCountToday: 1 }, // Aditya (Groom)
    { id: 106, profileId: 106, firstVisitDate: todayDateStr, firstVisitTimeToday: '07:50 AM', visitedTime: 'First: 07:50 AM', visitTimeDetails: 'First Visit Today at 07:50 AM', visitCountToday: 2 }  // Gurpreet (Groom)
  ]);

  // Record profile visit with strict same-day vs next-day time logic & deduplication
  const recordProfileVisit = (profileId) => {
    if (!profileId) return;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setRecentVisitors(prev => {
      const existingIndex = prev.findIndex(v => v.profileId === profileId);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const updatedList = [...prev];

        if (existing.firstVisitDate === todayStr) {
          // Visitor viewing again SAME DAY -> DO NOT change first visit time, only increment count
          const newCount = (existing.visitCountToday || 1) + 1;
          updatedList[existingIndex] = {
            ...existing,
            visitCountToday: newCount,
            visitTimeDetails: `First Visit Today at ${existing.firstVisitTimeToday}`,
            visitedTime: `First: ${existing.firstVisitTimeToday}`
          };
        } else {
          // Visitor returning NEXT DAY -> Update visit date and time to the new day's visit time
          updatedList[existingIndex] = {
            ...existing,
            firstVisitDate: todayStr,
            firstVisitTimeToday: timeStr,
            visitCountToday: 1,
            visitedTime: `First: ${timeStr}`,
            visitTimeDetails: `First Visit Today at ${timeStr}`
          };
        }
        return updatedList;
      } else {
        // New unique visitor entry
        return [
          {
            id: profileId,
            profileId: profileId,
            firstVisitDate: todayStr,
            firstVisitTimeToday: timeStr,
            visitedTime: `First: ${timeStr}`,
            visitTimeDetails: `First Visit Today at ${timeStr}`,
            visitCountToday: 1
          },
          ...prev
        ];
      }
    });
  };

  const handleSelectProfile = (prof) => {
    setSelectedProfile(prof);
    if (prof && prof.id) {
      recordProfileVisit(prof.id);
    }
  };

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'accept', title: 'Interest Accepted!', subtitle: 'Ananya Sharma accepted your express interest request.', time: '10m ago', read: false, profileId: 101 },
    { id: 2, type: 'visitor', title: 'New Profile Visitor', subtitle: 'Dr. Priya Kapoor (Pediatric Specialist) viewed your profile.', time: '25m ago', read: false, profileId: 103 },
    { id: 3, type: 'interest', title: 'Express Interest Received', subtitle: 'Rohan Verma (VP HDFC Bank) sent you an express interest.', time: '1h ago', read: false, profileId: 102 },
    { id: 4, type: 'parivar', title: 'Parivar Meet Scheduled', subtitle: 'Parivar Meet video call confirmed for Sunday at 5:00 PM.', time: '3h ago', read: true, profileId: 101 }
  ]);

  // Modals State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isVIPOpen, setIsVIPOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleConfirmDeleteAccount = () => {
    setIsDeleteAccountOpen(false);
    setInterestMap({});
    setShortlistedIds([]);
    showToast("🗑️ Account permanently deleted. Please register your new account.");
    setIsRegisterOpen(true);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Express Interest Handler cycling through states: none -> sent -> accepted -> declined -> none
  const handleExpressInterest = (profileId, explicitStatus) => {
    setInterestMap(prev => {
      const current = prev[profileId];
      let nextState = explicitStatus;
      
      if (!nextState) {
        if (!current) nextState = 'sent';
        else if (current === 'sent') nextState = 'accepted';
        else if (current === 'accepted') nextState = 'declined';
        else nextState = undefined;
      }

      const updated = { ...prev };
      if (!nextState) {
        delete updated[profileId];
        showToast("🔄 Status reset to Express Interest");
      } else {
        updated[profileId] = nextState;
        if (nextState === 'sent') showToast("❤️ Express Interest sent successfully!");
        if (nextState === 'accepted') showToast("✅ Interest ACCEPTED! (Vibrant Green Status)");
        if (nextState === 'declined') showToast("❌ Interest DECLINED (Red Status)");
      }
      return updated;
    });
  };

  // Shortlist Toggle Handler
  const handleToggleShortlist = (profileId) => {
    setShortlistedIds(prev =>
      prev.includes(profileId) ? prev.filter(id => id !== profileId) : [...prev, profileId]
    );
    showToast(shortlistedIds.includes(profileId) ? "Removed from Shortlist" : "⭐ Profile Bookmarked in Shortlist");
  };

  // Reset Filters (respects auth-based feed gender)
  const handleResetFilters = () => {
    const resetGender = authUser ? correctFeedGender : 'Bride';
    setFilters({
      gender: resetGender,
      religion: 'All',
      motherTongue: 'All',
      city: 'All',
      maxAge: 35,
      minIncome: 'All',
      manglik: 'All',
      diet: 'All',
      verifiedOnly: false
    });
  };


  // Filtered Profiles Logic (With Multi-Location Proximity & Radius Plan Division)
  const filteredProfiles = useMemo(() => {
    return profiles.map(p => {
      const { minDistance, nearestCenterName } = getMinDistanceToCenters(p.lat, p.lng, filters.selectedCityKeys || ['Bengaluru', 'Mumbai']);
      const isInRadius = (filters.selectedCityKeys || []).includes('All') || (filters.radiusKm || 100) >= 3000 || minDistance <= (filters.radiusKm || 100);
      return { ...p, minDistance, nearestCenterName, isInRadius };
    }).filter(p => {
      if (filters.gender !== 'All' && p.gender !== filters.gender) return false;
      if (p.age > filters.maxAge) return false;
      if (filters.religion !== 'All' && p.religion !== filters.religion) return false;
      if (filters.motherTongue !== 'All' && p.motherTongue !== filters.motherTongue) return false;
      if (filters.caste && filters.caste !== 'All' && p.caste && !p.caste.toLowerCase().includes(filters.caste.toLowerCase().split(' ')[0])) return false;
      if (filters.gotra && filters.gotra !== 'All' && p.gotra && p.gotra !== filters.gotra) return false;

      // Filter by radius if showOutOfRadius toggle is disabled
      if (filters.showOutOfRadius === false && !p.isInRadius) return false;

      if (filters.minIncome !== 'All') {
        const minInc = parseInt(filters.minIncome);
        if (p.incomeValue < minInc) return false;
      }
      if (filters.manglik !== 'All' && p.manglik !== filters.manglik) return false;
      if (filters.diet !== 'All' && p.diet !== filters.diet) return false;
      if (filters.verifiedOnly && !p.isVerified) return false;

      return true;
    });
  }, [profiles, filters]);

  // Handle Register Success
  const handleRegisterSuccess = (newProfData) => {
    const userGender = newProfData.gender || 'Groom';
    const targetFeedGender = userGender === 'Groom' ? 'Bride' : 'Groom';

    setCurrentUser({
      name: newProfData.fullName || `${userGender} Account`,
      gender: userGender,
      profileCreatedBy: newProfData.profileCreatedBy || 'Self'
    });

    setFilters(prev => ({
      ...prev,
      gender: targetFeedGender
    }));

    const newProfile = {
      id: Date.now(),
      name: newProfData.fullName || 'New Profile',
      gender: userGender,
      age: 26,
      height: "5' 6\" (168 cm)",
      religion: newProfData.religion,
      caste: newProfData.caste,
      motherTongue: newProfData.motherTongue,
      education: newProfData.education,
      occupation: newProfData.occupation,
      income: newProfData.annualIncome,
      incomeValue: 25,
      city: newProfData.city,
      state: "Delhi",
      country: "India",
      isNri: false,
      visaStatus: "🇮🇳 India Resident",
      relocationFlexibility: "Flexible / Remote Work",
      diet: "Vegetarian",
      manglik: newProfData.manglik,
      rashi: newProfData.rashi,
      nakshatra: "Chitra",
      gotra: "Bharadwaj",
      isVerified: true,
      photoPrivacy: "Public",
      matchScore: 94,
      lat: 28.6139,
      lng: 77.2090,
      mapArea: "New Delhi",
      photo: newProfData.gender === 'Bride'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      about: newProfData.about || 'Newly created matrimony profile.',
      preferencesMatch: [
        { criteria: "Religion", value: newProfData.religion, isMatched: true },
        { criteria: "Education", value: newProfData.education, isMatched: true }
      ]
    };

    setProfiles(prev => [newProfile, ...prev]);
    setIsRegisterOpen(false);
    showToast(`🎉 ${userGender} Account Created! Now displaying verified ${targetFeedGender} profiles.`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FAF7F2' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '90px', right: '20px', zIndex: 999, backgroundColor: '#7A0026', color: '#FFFFFF', padding: '12px 20px', borderRadius: '16px', border: '2px solid #D4AF37', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800 }}>
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
          {toastMessage}
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCount={receivedInterests.length}
        visitorCount={recentVisitors.length}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        onOpenMyProfile={() => {
          const myProf = profiles.find(p => p.id === currentUser.id) || profiles.find(p => p.gender === currentUser.gender) || profiles[1];
          if (myProf) handleSelectProfile(myProf);
        }}
        onOpenDeleteAccount={() => setIsDeleteAccountOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenVIP={() => setIsVIPOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Body View */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* ══ FIND MATCHES TAB → MAP ONLY (Full-screen) ══ */}
        {activeTab === 'search' && (
          <div style={{ flex: 1, padding: '0', margin: '0' }}>
            <MapView
              profiles={filteredProfiles}
              onExpressInterest={handleExpressInterest}
              sentInterests={sentInterests}
              interestMap={interestMap}
              shortlistedIds={shortlistedIds}
              onToggleShortlist={handleToggleShortlist}
              onSelectProfile={handleSelectProfile}
              onOpenLifestyleReels={(p) => setSelectedReelsProfile(p)}
              onOpenParivarMeet={(p) => setSelectedParivarProfile(p)}
              currentUser={currentUser}
            />
          </div>
        )}

        {/* RECENT PROFILE VISITORS TAB */}
        {activeTab === 'visitors' && (
          <RecentVisitorsView
            recentVisitors={recentVisitors}
            profiles={profiles}
            interestMap={interestMap}
            targetGender={filters.gender}
            onExpressInterest={handleExpressInterest}
            onSelectProfile={handleSelectProfile}
            onOpenLifestyleReels={(p) => setSelectedReelsProfile(p)}
            onOpenParivarMeet={(p) => setSelectedParivarProfile(p)}
          />
        )}

        {/* 36 GUNAS KUNDALI MILAN TAB */}
        {activeTab === 'guna-milan' && (
          <div style={{ maxWidth: '1240px', margin: '40px auto', padding: '0 20px' }}>
            <GunaMilanCalculator />
          </div>
        )}

        {/* INBOX & CHAT TAB */}
        {activeTab === 'inbox' && (
          <div style={{ maxWidth: '1240px', margin: '40px auto', padding: '0 20px' }}>
            <DashboardInbox
              receivedInterests={receivedInterests}
              sentInterests={sentInterests}
              interestMap={interestMap}
              profiles={profiles}
              onAcceptInterest={(id) => {
                setReceivedInterests(prev => prev.filter(i => i.id !== id));
                showToast("Accepted Interest! Live Chat Unlocked.");
              }}
              onDeclineInterest={(id) => {
                setReceivedInterests(prev => prev.filter(i => i.id !== id));
                showToast("Declined interest request.");
              }}
              onExpressInterest={handleExpressInterest}
              onOpenParivarMeet={(p) => setSelectedParivarProfile(p)}
              onSelectProfile={handleSelectProfile}
              onOpenLiveChat={(p) => setActiveFloatingChat(p)}
            />
          </div>
        )}

      </main>

      {/* Notifications Drawer Modal */}
      {isNotificationsOpen && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllRead={() => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            showToast("Marked all notifications as read");
          }}
          onSelectNotification={(n) => {
            setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
            setIsNotificationsOpen(false);
            const prof = profiles.find(p => p.id === n.profileId);
            if (prof) handleSelectProfile(prof);
          }}
          onClearNotification={(id) => {
            setNotifications(prev => prev.filter(n => n.id !== id));
            showToast("Removed notification alert");
          }}
        />
      )}

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onExpressInterest={handleExpressInterest}
          isInterested={sentInterests.includes(selectedProfile.id)}
          interestStatus={interestMap[selectedProfile.id]}
          onOpenLifestyleReels={(p) => setSelectedReelsProfile(p)}
          onOpenParivarMeet={(p) => setSelectedParivarProfile(p)}
        />
      )}

      {/* Lifestyle Reels Modal */}
      {selectedReelsProfile && (
        <LifestyleReelsModal
          profile={selectedReelsProfile}
          onClose={() => setSelectedReelsProfile(null)}
          onExpressInterest={handleExpressInterest}
          isInterested={sentInterests.includes(selectedReelsProfile.id)}
          interestStatus={interestMap[selectedReelsProfile.id]}
          onOpenParivarMeet={(p) => setSelectedParivarProfile(p)}
        />
      )}

      {/* Parivar Meet Modal */}
      {selectedParivarProfile && (
        <ParivarMeetModal
          profile={selectedParivarProfile}
          onClose={() => setSelectedParivarProfile(null)}
          onScheduleConfirm={(msg) => showToast(msg)}
        />
      )}

      {/* Auth Page Modal (Login / Signup / OTP) */}
      {isAuthOpen && (
        <AuthPage
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Mandatory Profile Onboarding Gate Modal (Un-skippable before landing page) */}
      {isLoggedIn && (!authUser?.profileComplete || !authUser?.gender) && (
        <MandatoryOnboardingModal
          currentUser={currentUser}
          onCompleteOnboarding={handleCompleteOnboarding}
        />
      )}

      {/* Registration Wizard Modal */}
      {isRegisterOpen && (
        <RegistrationWizard
          onClose={() => setIsRegisterOpen(false)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {/* Delete Account Permanently Modal */}
      {isDeleteAccountOpen && (
        <DeleteAccountModal
          currentUser={currentUser}
          onClose={() => setIsDeleteAccountOpen(false)}
          onConfirmDelete={handleConfirmDeleteAccount}
        />
      )}

      {/* Membership Plans Modal */}
      {isVIPOpen && (
        <MembershipPlans
          onClose={() => setIsVIPOpen(false)}
          onSelectPlan={(plan) => {
            setIsVIPOpen(false);
            showToast(`⭐ Upgraded to ${plan}!`);
          }}
        />
      )}

      {/* Persistent Floating Chat Trigger Launcher Button (Always Pinned to Bottom-Right) */}
      {!activeFloatingChat && (
        <button
          onClick={() => setActiveFloatingChat(profiles[0])}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9998,
            backgroundColor: '#7A0026',
            color: '#FFFFFF',
            border: '2px solid #D4AF37',
            padding: '12px 20px',
            borderRadius: '50px',
            boxShadow: '0 12px 30px rgba(122,0,38,0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 800,
            transition: 'all 0.3s ease'
          }}
          className="hover:scale-105"
        >
          <div style={{ position: 'relative' }}>
            <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#10B981', width: '9px', height: '9px', borderRadius: '50%', border: '1.5px solid #7A0026' }} />
          </div>
          <span>Bandhan Live Chat</span>
          <span style={{ backgroundColor: '#D4AF37', color: '#000000', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 900 }}>
            Online ●
          </span>
        </button>
      )}

      {/* Floating Chat Widget Drawer (Bottom-Right Docked) */}
      {activeFloatingChat && (
        <FloatingChatWidget
          activeProfile={activeFloatingChat}
          profiles={profiles}
          interestMap={interestMap}
          onClose={() => setActiveFloatingChat(null)}
          onOpenParivarMeet={(p) => setSelectedParivarProfile(p)}
        />
      )}

      {/* Footer */}
      <Footer onOpenVIP={() => setIsVIPOpen(true)} />

    </div>
  );
}
