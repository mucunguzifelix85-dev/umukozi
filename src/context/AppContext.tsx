import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  WorkerProfile, 
  EmployerProfile, 
  JobPost, 
  Transaction, 
  UserReport, 
  NotificationItem, 
  Review,
  ExperienceLevel,
  Location,
  WorkDuration
} from '../types';
import { INITIAL_WORKERS, INITIAL_JOBS } from '../data/mockData';

interface AppContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: WorkerProfile | EmployerProfile | null;
  currentUserType: 'worker' | 'employer' | 'admin' | null;
  setCurrentUser: (user: WorkerProfile | EmployerProfile | null) => void;
  setCurrentUserType: (type: 'worker' | 'employer' | 'admin' | null) => void;
  
  workers: WorkerProfile[];
  setWorkers: React.Dispatch<React.SetStateAction<WorkerProfile[]>>;
  jobs: JobPost[];
  setJobs: React.Dispatch<React.SetStateAction<JobPost[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  reports: UserReport[];
  setReports: React.Dispatch<React.SetStateAction<UserReport[]>>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  
  blockedUserIds: string[];
  blockUser: (userId: string) => void;
  
  // Custom action functions
  registerWorker: (data: Omit<WorkerProfile, 'id' | 'rating' | 'reviews' | 'isPremium' | 'isSuspended' | 'isVerified' | 'viewsCount' | 'showContactInfo'>) => void;
  registerEmployer: (data: Omit<EmployerProfile, 'id' | 'hasPaidRegistrationFee' | 'unlockedWorkers' | 'isSuspended'>) => void;
  addReviewToWorker: (workerId: string, rating: number, comment: string) => void;
  submitReport: (reportedId: string, reason: string) => void;
  processPayment: (amount: number, provider: 'MTN' | 'Airtel', phone: string, description: string, workerIdToUnlock?: string) => Promise<boolean>;
  
  // Admin functions
  toggleVerifyWorker: (workerId: string) => void;
  toggleSuspendWorker: (workerId: string) => void;
  toggleSuspendEmployer: (employerId: string) => void;
  resolveReport: (reportId: string, status: 'RESOLVED' | 'DISMISSED') => void;
  toggleBoostWorker: (workerId: string) => void;
  
  // Navigation
  activeScreen: 'welcome' | 'register-worker' | 'register-employer' | 'app' | 'admin';
  setActiveScreen: (screen: 'welcome' | 'register-worker' | 'register-employer' | 'app' | 'admin') => void;
  currentTab: 'home' | 'search' | 'messages' | 'profile' | 'notifications';
  setCurrentTab: (tab: 'home' | 'search' | 'messages' | 'profile' | 'notifications') => void;
  
  // Selected Profile detail
  selectedWorkerId: string | null;
  setSelectedWorkerId: (id: string | null) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize states with local storage if available, else standard mocks
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('umukozi_language') as Language) || 'rw';
  });

  const [currentUser, setCurrentUser] = useState<WorkerProfile | EmployerProfile | null>(() => {
    const saved = localStorage.getItem('umukozi_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentUserType, setCurrentUserType] = useState<'worker' | 'employer' | 'admin' | null>(() => {
    return (localStorage.getItem('umukozi_current_user_type') as 'worker' | 'employer' | 'admin') || null;
  });

  const [workers, setWorkers] = useState<WorkerProfile[]>(() => {
    const saved = localStorage.getItem('umukozi_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [jobs, setJobs] = useState<JobPost[]>(() => {
    const saved = localStorage.getItem('umukozi_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('umukozi_transactions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'TX1',
        userId: 'E2',
        userName: 'Olivier Shami',
        amount: 500,
        provider: 'MTN',
        phoneNumber: '+250 788 888 888',
        timestamp: '2026-06-11 14:30',
        status: 'SUCCESS',
        description: 'Unlocked Jean Bosco Nsengiyumva'
      },
      {
        id: 'TX2',
        userId: 'W1',
        userName: 'Jean Bosco Nsengiyumva',
        amount: 2000,
        provider: 'MTN',
        phoneNumber: '+250 788 123 456',
        timestamp: '2026-06-10 09:12',
        status: 'SUCCESS',
        description: 'Worker Premium Boosting Fee (1 month)'
      }
    ];
  });

  const [reports, setReports] = useState<UserReport[]>(() => {
    const saved = localStorage.getItem('umukozi_reports');
    return saved ? JSON.parse(saved) : [
      {
        id: 'REP1',
        reportedId: 'W5',
        reportedName: 'Eric Mugisha',
        reporterId: 'E10',
        reporterName: 'Alphonse Mutabazi',
        reason: 'The worker did not show up on the agreed date for the electrical job.',
        date: '2026-06-11 16:45',
        status: 'PENDING'
      }
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('umukozi_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'N1',
        userId: 'W1',
        title: '🌟 Profile View Alert',
        body: 'Your profile is getting views! 14 new employers viewed your contact info today.',
        timestamp: '2026-06-12 10:00',
        read: false,
        type: 'profile_view'
      },
      {
        id: 'N2',
        userId: 'W1',
        title: '✅ Premium Boost Activated',
        body: 'Your profile has been boosted to the top of results. Expect more client requests!',
        timestamp: '2026-06-10 09:15',
        read: true,
        type: 'payment'
      }
    ];
  });

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('umukozi_blocked_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeScreen, setActiveScreen] = useState<'welcome' | 'register-worker' | 'register-employer' | 'app' | 'admin'>(() => {
    const saved = localStorage.getItem('umukozi_active_screen');
    return (saved as 'welcome' | 'register-worker' | 'register-employer' | 'app' | 'admin') || 'welcome';
  });

  const [currentTab, setCurrentTab] = useState<'home' | 'search' | 'messages' | 'profile' | 'notifications'>('home');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('umukozi_language', language);
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('umukozi_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('umukozi_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUserType) {
      localStorage.setItem('umukozi_current_user_type', currentUserType);
    } else {
      localStorage.removeItem('umukozi_current_user_type');
    }
  }, [currentUserType]);

  useEffect(() => {
    localStorage.setItem('umukozi_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('umukozi_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('umukozi_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('umukozi_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('umukozi_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('umukozi_blocked_users', JSON.stringify(blockedUserIds));
  }, [blockedUserIds]);

  useEffect(() => {
    localStorage.setItem('umukozi_active_screen', activeScreen);
  }, [activeScreen]);

  // Block a user ID
  const blockUser = (userId: string) => {
    if (!blockedUserIds.includes(userId)) {
      setBlockedUserIds([...blockedUserIds, userId]);
      addNotificationLocal(
        currentUser?.id || 'guest',
        '🛡️ User Blocked Successfully',
        `You have blocked user ${userId}. They will no longer appear in search inputs.`,
        'system'
      );
    }
  };

  // Internal helper to trigger notifications
  const addNotificationLocal = (userId: string, title: string, body: string, type: NotificationItem['type']) => {
    const newNote: NotificationItem = {
      id: 'NOT' + Date.now(),
      userId,
      title,
      body,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      read: false,
      type
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  // Register Worker
  const registerWorker = (data: Omit<WorkerProfile, 'id' | 'rating' | 'reviews' | 'isPremium' | 'isSuspended' | 'isVerified' | 'viewsCount' | 'showContactInfo'>) => {
    const newId = 'W_REG_' + Date.now();
    const newWorker: WorkerProfile = {
      ...data,
      id: newId,
      rating: 5.0,
      reviews: [],
      isPremium: false,
      isSuspended: false,
      isVerified: true, // Auto verify simulated
      viewsCount: 0,
      showContactInfo: { phone: true, whatsapp: true }
    };
    setWorkers(prev => [newWorker, ...prev]);
    setCurrentUser(newWorker);
    setCurrentUserType('worker');
    setActiveScreen('app');
    
    addNotificationLocal(newId, '✨ Welcome App Registration', `Murakaza neza, ${data.fullName}! Your worker profile has been published under ${data.category}.`, 'system');
  };

  // Register Employer
  const registerEmployer = (data: Omit<EmployerProfile, 'id' | 'hasPaidRegistrationFee' | 'unlockedWorkers' | 'isSuspended'>) => {
    const newId = 'E_REG_' + Date.now();
    const newEmployer: EmployerProfile = {
      ...data,
      id: newId,
      hasPaidRegistrationFee: false, // Must pay registration fee to view details!
      unlockedWorkers: [],
      isSuspended: false
    };
    
    // Add job post matching their requirements!
    const newJob: JobPost = {
      id: 'JOB_' + Date.now(),
      employerId: newId,
      employerName: data.fullName,
      title: `Looking for skilled ${data.categoryNeeded}`,
      category: data.categoryNeeded,
      location: data.location,
      duration: data.workDuration,
      description: `Urgent demand in ${data.location.sector}. Looking for highly motivated candidates.`,
      budget: 'Agreement (Ubwumvikane)',
      datePosted: new Date().toISOString().slice(0, 10)
    };
    setJobs(prev => [newJob, ...prev]);
    setCurrentUser(newEmployer);
    setCurrentUserType('employer');
    
    // Auto launch to app view
    setActiveScreen('app');
    
    addNotificationLocal(newId, '💼 Employer Profile Active', `Welcome ${data.fullName}! Complete your 500 RWF mobile payment to unlock professional search maps.`, 'system');
  };

  // Add review
  const addReviewToWorker = (workerId: string, rating: number, comment: string) => {
    const reviewerName = currentUser ? currentUser.fullName : 'Anonymous Employer';
    const reviewerId = currentUser ? currentUser.id : 'guest';
    const newReview: Review = {
      id: 'REV_' + Date.now(),
      reviewerId,
      reviewerName,
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10)
    };

    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        const updatedReviews = [...w.reviews, newReview];
        const avg = parseFloat((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
        return {
          ...w,
          reviews: updatedReviews,
          rating: avg
        };
      }
      return w;
    }));

    addNotificationLocal(workerId, '⭐️ New Rating Received', `${reviewerName} left you a ${rating}-star review: "${comment.substring(0, 30)}..."`, 'rating');
  };

  // Submit report to Admin moderation
  const submitReport = (reportedId: string, reason: string) => {
    const rName = workers.find(w => w.id === reportedId)?.fullName || reportedId;
    const newReport: UserReport = {
      id: 'REP_' + Date.now(),
      reportedId,
      reportedName: rName,
      reporterId: currentUser?.id || 'anonymous',
      reporterName: currentUser?.fullName || 'Anonymous guest',
      reason,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'PENDING'
    };
    setReports(prev => [newReport, ...prev]);
  };

  // Process payment portal (MoMo / Airtel)
  const processPayment = async (
    amount: number, 
    provider: 'MTN' | 'Airtel', 
    phone: string, 
    description: string,
    workerIdToUnlock?: string
  ): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const transId = 'TX_GEN_' + Date.now().toString().slice(-6);
        const newTrans: Transaction = {
          id: transId,
          userId: currentUser?.id || 'guest',
          userName: currentUser?.fullName || 'Anonymous guest',
          amount,
          provider,
          phoneNumber: phone,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: 'SUCCESS',
          description
        };

        setTransactions(prev => [newTrans, ...prev]);

        // If unlock was selected, append to unlocked list
        if (workerIdToUnlock && currentUser && currentUserType === 'employer') {
          const emp = currentUser as EmployerProfile;
          const updatedUnlocked = [...(emp.unlockedWorkers || [])];
          if (!updatedUnlocked.includes(workerIdToUnlock)) {
            updatedUnlocked.push(workerIdToUnlock);
          }
          const updatedUser = {
            ...emp,
            unlockedWorkers: updatedUnlocked
          };
          setCurrentUser(updatedUser);
          localStorage.setItem('umukozi_current_user', JSON.stringify(updatedUser));
        }

        // Handle structural registration fee trigger
        if (amount === 500 && !workerIdToUnlock && currentUser && currentUserType === 'employer') {
          const emp = currentUser as EmployerProfile;
          const updatedUser = {
            ...emp,
            hasPaidRegistrationFee: true
          };
          setCurrentUser(updatedUser);
          localStorage.setItem('umukozi_current_user', JSON.stringify(updatedUser));
        }

        addNotificationLocal(
          currentUser?.id || 'guest',
          '💳 Mobile Payment Confirmed',
          `Payment of ${amount} RWF successfully received via ${provider} Money. ID: ${transId}`,
          'payment'
        );

        resolve(true);
      }, 1500); // Simulated delay for payment loading visual
    });
  };

  // Admin and Moderator: Verify
  const toggleVerifyWorker = (workerId: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        const st = !w.isVerified;
        addNotificationLocal(workerId, st ? '🛡️ ID Verified' : '⚠️ Profile Unverified', st ? 'Admin has approved your national ID credentials.' : 'Your ID verification was revoked.', 'system');
        return { ...w, isVerified: st };
      }
      return w;
    }));
  };

  // Admin: Suspend
  const toggleSuspendWorker = (workerId: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        const st = !w.isSuspended;
        addNotificationLocal(workerId, st ? '🚨 Account Suspended' : '✅ Account Reactivated', st ? 'Your account was suspended due to policy violations.' : 'Your account was reactivated by the administration.', 'system');
        return { ...w, isSuspended: st };
      }
      return w;
    }));
  };

  const toggleSuspendEmployer = (employerId: string) => {
    if (currentUser && currentUser.id === employerId) {
      const emp = currentUser as EmployerProfile;
      const updated = { ...emp, isSuspended: !emp.isSuspended };
      setCurrentUser(updated);
    }
  };

  // Resolve Reports
  const resolveReport = (reportId: string, status: 'RESOLVED' | 'DISMISSED') => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
  };

  // Boost workers
  const toggleBoostWorker = (workerId: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        const st = !w.isPremium;
        addNotificationLocal(workerId, st ? '🚀 Profile Boost Active' : 'ℹ️ Boost Period Expired', st ? 'Your search ranking boost is active now!' : 'Your profile boost has expired.', 'system');
        return { ...w, isPremium: st };
      }
      return w;
    }));
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      currentUser,
      currentUserType,
      setCurrentUser,
      setCurrentUserType,
      workers,
      setWorkers,
      jobs,
      setJobs,
      transactions,
      setTransactions,
      reports,
      setReports,
      notifications,
      setNotifications,
      blockedUserIds,
      blockUser,
      registerWorker,
      registerEmployer,
      addReviewToWorker,
      submitReport,
      processPayment,
      toggleVerifyWorker,
      toggleSuspendWorker,
      toggleSuspendEmployer,
      resolveReport,
      toggleBoostWorker,
      activeScreen,
      setActiveScreen,
      currentTab,
      setCurrentTab,
      selectedWorkerId,
      setSelectedWorkerId
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
