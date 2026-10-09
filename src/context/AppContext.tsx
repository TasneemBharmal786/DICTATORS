'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student } from '@/types/student';
import { INITIAL_STUDENTS } from '@/data/mockStudents';

export type UserRole = 'ADMIN' | 'STUDENT';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoggedOut: boolean;
  setIsLoggedOut: (b: boolean) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  currentStudent: Student | undefined;
  students: Student[];
  pendingStudents: Student[];
  approvedStudents: Student[];
  approveStudent: (studentId: string) => void;
  rejectStudent: (studentId: string) => void;
  selectedMicroStudent: Student | null;
  setSelectedMicroStudent: (student: Student | null) => void;
  resetDemoData: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCohortFilter: string;
  setSelectedCohortFilter: (cohort: string) => void;
  selectedRiskFilter: string;
  setSelectedRiskFilter: (risk: string) => void;
}

const STORAGE_KEY = 'ai_student_success_platform_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(true);
  const [activeStudentId, setActiveStudentId] = useState<string>('stu-001'); // Default to Rahul Verma
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedMicroStudent, setSelectedMicroStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCohortFilter, setSelectedCohortFilter] = useState<string>('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudents(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load cached platform state, using initial cohort.', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      } catch (e) {
        console.error('Failed to persist student records to localStorage', e);
      }
    }
  }, [students, isLoaded]);

  const pendingStudents = students.filter((s) => s.approvalStatus === 'PENDING');
  const approvedStudents = students.filter((s) => s.approvalStatus === 'APPROVED');
  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const approveStudent = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            approvalStatus: 'APPROVED',
            approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
            reviewedBy: 'Dr. Sharma (Dean of Academic Affairs)',
          };
        }
        return s;
      })
    );

    // If currently selected in micro view, update modal state too
    setSelectedMicroStudent((prev) => {
      if (prev && prev.id === studentId) {
        return {
          ...prev,
          approvalStatus: 'APPROVED',
          approvedAt: 'Just now',
          reviewedBy: 'Dr. Sharma (Dean of Academic Affairs)',
        };
      }
      return prev;
    });
  };

  const rejectStudent = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            approvalStatus: 'REJECTED',
            reviewedBy: 'Dr. Sharma (Dean of Academic Affairs)',
          };
        }
        return s;
      })
    );

    setSelectedMicroStudent((prev) => {
      if (prev && prev.id === studentId) {
        return {
          ...prev,
          approvalStatus: 'REJECTED',
          reviewedBy: 'Dr. Sharma (Dean of Academic Affairs)',
        };
      }
      return prev;
    });
  };

  const resetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setActiveStudentId('stu-001');
    setRole('ADMIN');
    setSelectedMicroStudent(null);
    setSearchQuery('');
    setSelectedCohortFilter('ALL');
    setSelectedRiskFilter('ALL');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isLoggedOut,
        setIsLoggedOut,
        activeStudentId,
        setActiveStudentId,
        currentStudent,
        students,
        pendingStudents,
        approvedStudents,
        approveStudent,
        rejectStudent,
        selectedMicroStudent,
        setSelectedMicroStudent,
        resetDemoData,
        searchQuery,
        setSearchQuery,
        selectedCohortFilter,
        setSelectedCohortFilter,
        selectedRiskFilter,
        setSelectedRiskFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
