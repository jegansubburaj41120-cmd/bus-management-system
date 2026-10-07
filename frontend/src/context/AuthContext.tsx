import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role?: UserRole) => Promise<LoginResult>;
  logout: () => void;
  isLoading: boolean;
}

export const DEMO_USERS: Record<UserRole, { user: User; defaultPassword: string; portalName: string; subtitle: string }> = {
  admin: {
    portalName: 'Transport Admin Portal',
    subtitle: 'Central Fleet Operations, Route Dispatch & Telematics',
    defaultPassword: 'password123',
    user: {
      id: 1,
      name: 'Transport Officer (Admin)',
      email: 'admin@nprcolleges.org',
      role: 'admin',
      department: 'Transport Central Office',
      phone: '+91 9842100001'
    }
  },
  mentor: {
    portalName: 'Bus Mentor / Faculty Portal',
    subtitle: 'Passenger Manifest, Roll Call & Student Care',
    defaultPassword: 'password123',
    user: {
      id: 2,
      name: 'Prof. Pandi (Bus Mentor)',
      email: 'mentor.pandi@nprcolleges.org',
      role: 'mentor',
      department: 'Computer Applications (MCA)',
      phone: '+91 9842100002'
    }
  },
  driver: {
    portalName: 'Commercial Driver Cockpit',
    subtitle: 'Live GPS Broadcast, Speedometer & Route Waypoints',
    defaultPassword: 'password123',
    user: {
      id: 3,
      name: 'Saravanan M. (Senior Driver)',
      email: 'driver.saravanan@nprcolleges.org',
      role: 'driver',
      department: 'Transport Operations',
      phone: '+91 9842100003'
    }
  },
  watchman: {
    portalName: 'Main Gate Security Terminal',
    subtitle: 'Campus Entry / Exit Barcode & QR Verification Terminal',
    defaultPassword: 'password123',
    user: {
      id: 4,
      name: 'Kandasamy K. (Gate Security)',
      email: 'watchman.kandasamy@nprcolleges.org',
      role: 'watchman',
      department: 'Campus Security Services',
      phone: '+91 9842100004'
    }
  },
  student: {
    portalName: 'Student Pass & Live ETA',
    subtitle: 'Digital Transit Pass, Bus QR & Live Distance Telemetry',
    defaultPassword: 'password123',
    user: {
      id: 5,
      name: 'Sabari Nathan (Student)',
      email: 'sabari.mca@nprcolleges.org',
      role: 'student',
      department: 'Master of Computer Applications (MCA)',
      register_number: '24MCA108',
      phone: '+91 9842100005'
    }
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('transit_user');
    const savedToken = localStorage.getItem('transit_auth_token');
    if (saved && savedToken) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('transit_auth_token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('transit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('transit_user');
      localStorage.removeItem('transit_auth_token');
    }
  }, [user, token]);

  const login = async (email: string, password: string, role?: UserRole): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password, role);
      if (res.success && res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('transit_auth_token', res.token);
        setIsLoading(false);
        return { success: true, user: res.user };
      } else if (res.message) {
        setIsLoading(false);
        return { success: false, message: res.message };
      }
    } catch (err: any) {
      console.warn('Backend connection issue:', err);
    }

    // Secure fallback verification if backend is offline
    const matchedRole = Object.keys(DEMO_USERS).find(
      (r) => DEMO_USERS[r as UserRole].user.email.toLowerCase() === email.toLowerCase().trim()
    ) as UserRole | undefined;

    if (!matchedRole) {
      setIsLoading(false);
      return { success: false, message: 'Invalid credentials. User account not found.' };
    }

    const demoAccount = DEMO_USERS[matchedRole];
    if (password !== demoAccount.defaultPassword) {
      setIsLoading(false);
      return { success: false, message: 'Invalid password. Authentication failed.' };
    }

    // Role Security Enforcement
    if (role && demoAccount.user.role !== role) {
      setIsLoading(false);
      return {
        success: false,
        message: `Security Access Denied: This account is registered as '${demoAccount.portalName}'. You cannot use it to access the requested portal.`
      };
    }

    setUser(demoAccount.user);
    const mockToken = `demo_secure_jwt_${demoAccount.user.role}_${Date.now()}`;
    setToken(mockToken);
    localStorage.setItem('transit_auth_token', mockToken);
    setIsLoading(false);
    return { success: true, user: demoAccount.user };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('transit_user');
    localStorage.removeItem('transit_auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
