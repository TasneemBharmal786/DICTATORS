export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type CohortType =
  | 'TOP_PERFORMER'
  | 'HIGH_ACADEMIC_LOW_PLACEMENT'
  | 'PRACTICAL_INNOVATOR'
  | 'DROPOUT_RISK'
  | 'DISENGAGED_LMS'
  | 'CONSISTENT_AVERAGE';

export interface AcademicData {
  cgpa: number; // 0.0 - 10.0
  cgpaDelta?: string; // e.g. +0.28 vs Sem 5
  cgpaTrend?: 'UP' | 'DOWN' | 'STABLE';
  activeBacklogs: number;
  totalBacklogsCleared: number;
  semester: number;
  department: string;
  failedSubjects: string[];
  topSubjects: { name: string; score: number }[];
}

export interface AttendanceData {
  overallPercentage: number; // 0 - 100
  attendanceDelta?: string; // e.g. -3% vs last month
  subjectWise: { subject: string; percentage: number }[];
  medicalLeavesCount: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}

export interface LmsData {
  weeklyLogins: number;
  assignmentCompletionRate: number; // 0 - 100
  lmsDelta?: string; // e.g. +5% assignment velocity
  avgTimeSpentHoursWeekly: number;
  overdueAssignments: number;
  lastActiveDate: string;
}

export interface EngagementData {
  eventsAttended: number;
  activeClubs: string[];
  hackathonsCount: number;
  hackathonWins: number;
  certifications: string[];
  campusRole?: string;
}

export interface PlacementData {
  codingScore: number; // 0 - 100
  codingDelta?: string; // e.g. +8 pts post-bootcamp
  codingTrend?: 'UP' | 'DOWN' | 'STABLE';
  aptitudeScore: number; // 0 - 100
  mockInterviewRating: number; // 0 - 100
  solvedProblemsCount: number;
  placementDriveEligible: boolean;
}

export interface SkillsData {
  technicalRating: number; // 0 - 100
  technicalIndex?: number; // 0 - 100
  softSkillsRating: number; // 0 - 100 or 0 - 5.0
  primarySkillset: string[];
  skillGaps: string[];
}

export interface FeedbackData {
  studentSatisfactionScore: number; // 1 - 5
  facultyMentorFeedback: string;
  recentNote?: string;
  facultySentiment: 'POSITIVE' | 'NEUTRAL' | 'AT_RISK';
  lastMeetingDate: string;
}

export interface XaiDriver {
  id: string;
  feature: string;
  impact: number; // e.g. +14 or -18
  pillar: 'Academic' | 'Placement' | 'Attendance & LMS' | 'Skills' | 'Campus Life';
  type: 'POSITIVE' | 'NEGATIVE';
  description: string;
}

export interface PrescriptiveAction {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  expectedScoreImpact: number;
  category: 'ACADEMIC' | 'PLACEMENT' | 'ENGAGEMENT' | 'LMS';
}

export interface SuccessScoreBreakdown {
  overall: number; // 0 - 100
  academicPillar: number; // 0 - 100
  placementPillar: number; // 0 - 100
  engagementLmsPillar: number; // 0 - 100
  skillsPillar: number; // 0 - 100
  campusLifePillar: number; // 0 - 100
  backlogPenalty: number;
}

export interface RiskAnalysis {
  academicRisk: RiskLevel;
  placementRisk: RiskLevel;
  overallRisk: RiskLevel;
  primaryRiskReason: string;
}

export interface Student {
  id: string;
  usn: string; // University Seat Number e.g. 1RV21CS089
  name: string;
  email: string;
  avatarUrl: string;
  gender: 'Female' | 'Male' | 'Other';
  admissionYear: number;
  approvalStatus: ApprovalStatus;
  requestedAt: string;
  approvedAt?: string;
  reviewedBy?: string;

  // Unified Data Pillars
  academic: AcademicData;
  attendance: AttendanceData;
  lms: LmsData;
  engagement: EngagementData;
  placement: PlacementData;
  skills: SkillsData;
  feedback: FeedbackData;
  sports?: {
    primarySport: string;
    weeklyHours: number;
    fitnessLevel: string;
    staminaNeed: string;
    sportsDelta?: string;
  };

  // Calculated Engine Attributes
  successScore: SuccessScoreBreakdown;
  risk: RiskAnalysis;
  cohort: {
    type: CohortType;
    label: string;
    badgeColor: string;
    description: string;
  };
  xaiDrivers: XaiDriver[];
  actionableInsights: PrescriptiveAction[];
  actions?: { title: string; desc?: string; impact?: number }[];
  sourceCoverage?: Record<string, { available: boolean; lastUpdated: string }>;
  dataCompleteness?: 'Complete' | 'Partial' | 'Missing';
}

export type DatasetType =
  | 'ACADEMIC'
  | 'ATTENDANCE'
  | 'LMS'
  | 'PLACEMENT'
  | 'SKILLS'
  | 'ENGAGEMENT'
  | 'FEEDBACK';

export interface RowValidationError {
  rowNumber: number;
  studentId: string;
  field: string;
  suppliedValue: string;
  errorDescription: string;
  suggestedFix: string;
}

export interface UploadBatchHistory {
  batchId: string;
  datasetType: DatasetType;
  fileName: string;
  uploadedAt: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  importedRows: number;
  skippedRows: number;
  duplicateRows: number;
  unmatchedRows: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
}
