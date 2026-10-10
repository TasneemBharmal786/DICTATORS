'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, DatasetType, UploadBatchHistory } from '@/types/student';
import { INITIAL_STUDENTS } from '@/data/mockStudents';
import { applyImportedRecords } from '@/lib/datasetValidator';

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
  uploadHistory: UploadBatchHistory[];
  addUploadBatch: (batch: UploadBatchHistory) => void;
  importDatasetRecords: (
    type: DatasetType,
    validRows: Record<string, any>[],
    fileName: string,
    duplicateCount?: number,
    unmatchedCount?: number
  ) => { importedCount: number; batchId: string };
}

const STORAGE_KEY = 'ai_student_success_platform_state_v1';
const HISTORY_STORAGE_KEY = 'ai_student_upload_history_v1';

const INITIAL_UPLOAD_HISTORY: UploadBatchHistory[] = [
  {
    batchId: 'BATCH-2026-10-09-001',
    datasetType: 'ACADEMIC',
    fileName: 'rvce_cse_sem6_academic_master.csv',
    uploadedAt: '09 Oct 2026, 09:30 AM',
    totalRows: 8,
    validRows: 8,
    invalidRows: 0,
    importedRows: 8,
    skippedRows: 0,
    duplicateRows: 0,
    unmatchedRows: 0,
    status: 'SUCCESS',
  },
  {
    batchId: 'BATCH-2026-10-09-002',
    datasetType: 'ATTENDANCE',
    fileName: 'biometric_attendance_sept2026.xlsx',
    uploadedAt: '09 Oct 2026, 11:15 AM',
    totalRows: 8,
    validRows: 8,
    invalidRows: 0,
    importedRows: 8,
    skippedRows: 0,
    duplicateRows: 0,
    unmatchedRows: 0,
    status: 'SUCCESS',
  },
  {
    batchId: 'BATCH-2026-10-09-003',
    datasetType: 'PLACEMENT',
    fileName: 'bytexl_coding_aptitude_mock_round1.csv',
    uploadedAt: '09 Oct 2026, 02:45 PM',
    totalRows: 8,
    validRows: 8,
    invalidRows: 0,
    importedRows: 8,
    skippedRows: 0,
    duplicateRows: 0,
    unmatchedRows: 0,
    status: 'SUCCESS',
  },
];

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
  const [uploadHistory, setUploadHistory] = useState<UploadBatchHistory[]>(INITIAL_UPLOAD_HISTORY);
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

      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setUploadHistory(parsedHistory);
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
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(uploadHistory));
      } catch (e) {
        console.error('Failed to persist student records to localStorage', e);
      }
    }
  }, [students, uploadHistory, isLoaded]);

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

  const addUploadBatch = (batch: UploadBatchHistory) => {
    setUploadHistory((prev) => [batch, ...prev]);
  };

  const importDatasetRecords = (
    type: DatasetType,
    validRows: Record<string, any>[],
    fileName: string,
    duplicateCount = 0,
    unmatchedCount = 0
  ) => {
    const { updatedStudents, importedCount } = applyImportedRecords(students, type, validRows);
    setStudents(updatedStudents);

    const batchId = `BATCH-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    const newBatch: UploadBatchHistory = {
      batchId,
      datasetType: type,
      fileName,
      uploadedAt:
        new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ', ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalRows: validRows.length + duplicateCount + unmatchedCount,
      validRows: validRows.length,
      invalidRows: duplicateCount + unmatchedCount,
      importedRows: importedCount,
      skippedRows: 0,
      duplicateRows: duplicateCount,
      unmatchedRows: unmatchedCount,
      status: 'SUCCESS',
    };

    setUploadHistory((prev) => [newBatch, ...prev]);
    return { importedCount, batchId };
  };

  const resetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setActiveStudentId('stu-001');
    setRole('ADMIN');
    setSelectedMicroStudent(null);
    setSearchQuery('');
    setSelectedCohortFilter('ALL');
    setSelectedRiskFilter('ALL');
    setUploadHistory(INITIAL_UPLOAD_HISTORY);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
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
        uploadHistory,
        addUploadBatch,
        importDatasetRecords,
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
