import {
  AcademicData,
  AttendanceData,
  LmsData,
  EngagementData,
  PlacementData,
  SkillsData,
  FeedbackData,
  SuccessScoreBreakdown,
  RiskAnalysis,
  RiskLevel,
  CohortType,
  XaiDriver,
  PrescriptiveAction,
  Student,
} from '@/types/student';

/**
 * Weights configuration for the Student Success Score Engine
 */
export const SCORING_WEIGHTS = {
  academic: 0.30,
  placement: 0.25,
  engagementLms: 0.20,
  skills: 0.15,
  campusLife: 0.10,
  backlogPenaltyPerCount: 8,
};

/**
 * Calculate the multi-pillar Student Success Score (0 - 100)
 */
export function calculateSuccessScore(params: {
  academic: AcademicData;
  attendance: AttendanceData;
  lms: LmsData;
  engagement: EngagementData;
  placement: PlacementData;
  skills: SkillsData;
  feedback: FeedbackData;
}): SuccessScoreBreakdown {
  const { academic, attendance, lms, engagement, placement, skills, feedback } = params;

  // 1. Academic Pillar (0 - 100)
  const academicPillar = Math.min(100, Math.max(0, (academic.cgpa / 10) * 100));

  // 2. Placement Readiness Pillar (0 - 100)
  const placementPillar = Math.min(
    100,
    Math.max(
      0,
      placement.codingScore * 0.40 +
      placement.aptitudeScore * 0.30 +
      placement.mockInterviewRating * 0.30
    )
  );

  // 3. Engagement & LMS Pillar (0 - 100)
  const engagementLmsPillar = Math.min(
    100,
    Math.max(
      0,
      attendance.overallPercentage * 0.50 +
      lms.assignmentCompletionRate * 0.50
    )
  );

  // 4. Skills Pillar (0 - 100)
  const skillsPillar = Math.min(
    100,
    Math.max(
      0,
      skills.technicalRating * 0.60 +
      skills.softSkillsRating * 0.40
    )
  );

  // 5. Campus Life & Sentiment Pillar (0 - 100)
  const rawCampus =
    engagement.eventsAttended * 6 +
    engagement.hackathonsCount * 10 +
    engagement.hackathonWins * 15 +
    feedback.studentSatisfactionScore * 10;
  const campusLifePillar = Math.min(100, Math.max(0, rawCampus));

  // Penalty
  const backlogPenalty = academic.activeBacklogs * SCORING_WEIGHTS.backlogPenaltyPerCount;

  // Weighted Sum
  const weightedTotal =
    academicPillar * SCORING_WEIGHTS.academic +
    placementPillar * SCORING_WEIGHTS.placement +
    engagementLmsPillar * SCORING_WEIGHTS.engagementLms +
    skillsPillar * SCORING_WEIGHTS.skills +
    campusLifePillar * SCORING_WEIGHTS.campusLife;

  const finalScore = Math.round(Math.min(100, Math.max(0, weightedTotal - backlogPenalty)));

  return {
    overall: finalScore,
    academicPillar: Math.round(academicPillar),
    placementPillar: Math.round(placementPillar),
    engagementLmsPillar: Math.round(engagementLmsPillar),
    skillsPillar: Math.round(skillsPillar),
    campusLifePillar: Math.round(campusLifePillar),
    backlogPenalty,
  };
}

/**
 * Determine Dual-Axis Risk Levels (Academic Risk & Placement Risk)
 */
export function determineRiskAnalysis(params: {
  academic: AcademicData;
  attendance: AttendanceData;
  lms: LmsData;
  placement: PlacementData;
  successScore: number;
}): RiskAnalysis {
  const { academic, attendance, placement } = params;

  // Academic Risk
  let academicRisk: RiskLevel = 'LOW';
  if (academic.activeBacklogs >= 2 || attendance.overallPercentage < 65 || academic.cgpa < 6.0) {
    academicRisk = 'HIGH';
  } else if (academic.activeBacklogs === 1 || attendance.overallPercentage < 75 || academic.cgpa < 7.0) {
    academicRisk = 'MEDIUM';
  }

  // Placement Risk
  let placementRisk: RiskLevel = 'LOW';
  if (
    placement.codingScore < 50 ||
    placement.mockInterviewRating < 50 ||
    placement.aptitudeScore < 50
  ) {
    placementRisk = 'HIGH';
  } else if (
    placement.codingScore < 68 ||
    placement.mockInterviewRating < 68 ||
    placement.aptitudeScore < 68
  ) {
    placementRisk = 'MEDIUM';
  }

  // Overall combined risk
  let overallRisk: RiskLevel = 'LOW';
  if (academicRisk === 'HIGH' || placementRisk === 'HIGH') {
    overallRisk = 'HIGH';
  } else if (academicRisk === 'MEDIUM' || placementRisk === 'MEDIUM') {
    overallRisk = 'MEDIUM';
  }

  // Synthesize primary risk driver
  let primaryRiskReason = 'Student is on track across academic and career milestones.';
  if (academic.activeBacklogs > 0 && attendance.overallPercentage < 70) {
    primaryRiskReason = `Dual critical alert: ${academic.activeBacklogs} backlogs combined with low attendance (${attendance.overallPercentage}%).`;
  } else if (academic.activeBacklogs > 0) {
    primaryRiskReason = `Academic concern: ${academic.activeBacklogs} active backlogs require immediate clearing.`;
  } else if (attendance.overallPercentage < 75) {
    primaryRiskReason = `Attendance deficiency (${attendance.overallPercentage}%), risk of exam hall ticket withholding.`;
  } else if (placementRisk === 'HIGH') {
    primaryRiskReason = `Placement readiness deficit: Coding (${placement.codingScore}) or Mock Interviews (${placement.mockInterviewRating}) below benchmark.`;
  }

  return {
    academicRisk,
    placementRisk,
    overallRisk,
    primaryRiskReason,
  };
}

/**
 * Categorize student into an actionable segment cohort
 */
export function determineCohort(params: {
  academic: AcademicData;
  attendance: AttendanceData;
  lms: LmsData;
  placement: PlacementData;
  engagement: EngagementData;
  successScore: number;
  risk: RiskAnalysis;
}): {
  type: CohortType;
  label: string;
  badgeColor: string;
  description: string;
} {
  const { academic, attendance, lms, placement, engagement, successScore, risk } = params;

  if (successScore >= 85 && risk.overallRisk === 'LOW') {
    return {
      type: 'TOP_PERFORMER',
      label: 'Campus Star / Top Performer',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Excelling across academics, high-tier placements, and extracurricular leadership.',
    };
  }

  if (academic.cgpa >= 7.8 && placement.codingScore < 55) {
    return {
      type: 'HIGH_ACADEMIC_LOW_PLACEMENT',
      label: 'High Academic, Low Placement',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Strong theoretical grasp (CGPA 7.8+) but lacking hands-on coding and mock interview practice.',
    };
  }

  if (academic.cgpa < 7.2 && (placement.codingScore >= 80 || engagement.hackathonWins >= 1)) {
    return {
      type: 'PRACTICAL_INNOVATOR',
      label: 'Coding Wizard / Innovator',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      description: 'Exceptional hands-on builder and hackathon contestant; needs minimum attendance buffer to avoid detention.',
    };
  }

  if (attendance.overallPercentage < 65 || academic.activeBacklogs >= 2) {
    return {
      type: 'DROPOUT_RISK',
      label: 'High Risk of Dropout / Year-Back',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'Critical attendance deficiency (<65%) and multiple active arrears. Requires urgent mentor counseling.',
    };
  }

  if (lms.assignmentCompletionRate < 65 || lms.weeklyLogins <= 2) {
    return {
      type: 'DISENGAGED_LMS',
      label: 'Disengaged LMS / Passive Learner',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      description: 'Low portal login frequency and missed deadlines indicating declining course engagement.',
    };
  }

  return {
    type: 'CONSISTENT_AVERAGE',
    label: 'Consistent All-Rounder',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Steady academic and engagement record maintaining healthy eligibility thresholds.',
  };
}

/**
 * Generate Explainable AI (XAI) feature contribution breakdown
 * Simulates SHAP impact values for transparency
 */
export function generateXaiDrivers(params: {
  academic: AcademicData;
  attendance: AttendanceData;
  lms: LmsData;
  placement: PlacementData;
  engagement: EngagementData;
  skills: SkillsData;
}): XaiDriver[] {
  const { academic, attendance, lms, placement, engagement, skills } = params;
  const drivers: XaiDriver[] = [];

  // Positive Drivers
  if (academic.cgpa >= 8.5) {
    drivers.push({
      id: 'xai-cgpa-high',
      feature: `Outstanding CGPA (${academic.cgpa.toFixed(2)})`,
      impact: Math.round((academic.cgpa - 7.0) * 8),
      pillar: 'Academic',
      type: 'POSITIVE',
      description: 'Maintains top tier academic ranking boosting foundational success weight.',
    });
  }

  if (placement.codingScore >= 80) {
    drivers.push({
      id: 'xai-coding-high',
      feature: `Exceptional Coding Proficiency (${placement.codingScore}/100)`,
      impact: Math.round((placement.codingScore - 60) * 0.4),
      pillar: 'Placement',
      type: 'POSITIVE',
      description: 'Strong algorithmic problem-solving record with competitive programming benchmarks.',
    });
  }

  if (engagement.hackathonWins > 0) {
    drivers.push({
      id: 'xai-hack-win',
      feature: `${engagement.hackathonWins} Hackathon Victory(s)`,
      impact: engagement.hackathonWins * 8,
      pillar: 'Campus Life',
      type: 'POSITIVE',
      description: 'Demonstrated product delivery, teamwork, and external campus prestige.',
    });
  }

  if (attendance.overallPercentage >= 85) {
    drivers.push({
      id: 'xai-att-high',
      feature: `Reliable Attendance (${attendance.overallPercentage}%)`,
      impact: Math.round((attendance.overallPercentage - 75) * 0.6),
      pillar: 'Attendance & LMS',
      type: 'POSITIVE',
      description: 'High classroom physical attendance provides maximum internal evaluation safety.',
    });
  }

  if (skills.technicalRating >= 85) {
    drivers.push({
      id: 'xai-skills-tech',
      feature: `Top Technical Skill Rating (${skills.technicalRating}/100)`,
      impact: 7,
      pillar: 'Skills',
      type: 'POSITIVE',
      description: 'High ratings in core stack competencies (Full-stack, Cloud, ML).',
    });
  }

  // Negative / Drag Factors
  if (attendance.overallPercentage < 75) {
    drivers.push({
      id: 'xai-att-low',
      feature: `Attendance Shortfall (${attendance.overallPercentage}%)`,
      impact: -Math.round((75 - attendance.overallPercentage) * 1.1 + 4),
      pillar: 'Attendance & LMS',
      type: 'NEGATIVE',
      description: 'Falling below the mandatory 75% threshold incurs university administrative penalty.',
    });
  }

  if (academic.activeBacklogs > 0) {
    drivers.push({
      id: 'xai-backlog-penalty',
      feature: `${academic.activeBacklogs} Active Backlog(s)`,
      impact: -(academic.activeBacklogs * SCORING_WEIGHTS.backlogPenaltyPerCount),
      pillar: 'Academic',
      type: 'NEGATIVE',
      description: 'Active arrears severely hinder placement drive eligibility and academic standings.',
    });
  }

  if (placement.codingScore < 50) {
    drivers.push({
      id: 'xai-coding-low',
      feature: `Low Coding Assessment (${placement.codingScore}/100)`,
      impact: -Math.round((60 - placement.codingScore) * 0.35),
      pillar: 'Placement',
      type: 'NEGATIVE',
      description: 'Failed technical coding benchmark filters required for Tier-1 recruitment drives.',
    });
  }

  if (placement.mockInterviewRating < 50) {
    drivers.push({
      id: 'xai-mock-low',
      feature: `Sub-par Mock Interview (${placement.mockInterviewRating}/100)`,
      impact: -8,
      pillar: 'Placement',
      type: 'NEGATIVE',
      description: 'Demonstrated difficulty in technical communication and HR behavioral rounds.',
    });
  }

  if (lms.assignmentCompletionRate < 70) {
    drivers.push({
      id: 'xai-lms-low',
      feature: `LMS Assignment Deficit (${lms.assignmentCompletionRate}%)`,
      impact: -Math.round((80 - lms.assignmentCompletionRate) * 0.25),
      pillar: 'Attendance & LMS',
      type: 'NEGATIVE',
      description: 'Multiple late or incomplete submissions recorded on the university portal.',
    });
  }

  return drivers;
}

/**
 * Generate actionable, AI-driven prescriptive interventions
 */
export function generatePrescriptiveActions(params: {
  academic: AcademicData;
  attendance: AttendanceData;
  lms: LmsData;
  placement: PlacementData;
  risk: RiskAnalysis;
}): PrescriptiveAction[] {
  const { academic, attendance, lms, placement, risk } = params;
  const actions: PrescriptiveAction[] = [];

  if (academic.activeBacklogs > 0) {
    actions.push({
      id: 'act-remedial',
      priority: 'HIGH',
      title: 'Enroll in Fast-Track Remedial Cell',
      description: `Targeting clearance for ${academic.failedSubjects.join(', ')} before the next supplementary exam window.`,
      expectedScoreImpact: 8 * academic.activeBacklogs,
      category: 'ACADEMIC',
    });
  }

  if (attendance.overallPercentage < 75) {
    const requiredClasses = Math.ceil((0.75 * 60 - (attendance.overallPercentage / 100) * 60) / 0.25);
    actions.push({
      id: 'act-attendance',
      priority: 'HIGH',
      title: 'Compensatory Attendance Target',
      description: `Attend the next ${Math.max(4, requiredClasses)} consecutive laboratory and theory lectures without unexcused absences.`,
      expectedScoreImpact: 7,
      category: 'ENGAGEMENT',
    });
  }

  if (placement.codingScore < 60) {
    actions.push({
      id: 'act-dsa-bootcamp',
      priority: 'HIGH',
      title: 'Complete 30-Day Data Structures Track',
      description: 'Solve 20 medium-level LeetCode problems in Trees, Graphs, and Dynamic Programming on the college LMS.',
      expectedScoreImpact: 9,
      category: 'PLACEMENT',
    });
  }

  if (placement.mockInterviewRating < 65) {
    actions.push({
      id: 'act-mock-hr',
      priority: 'MEDIUM',
      title: 'Schedule Alumni Peer Mock Interview',
      description: 'Book a 45-minute technical system design & behavioral rehearsal with the placement department mentor.',
      expectedScoreImpact: 6,
      category: 'PLACEMENT',
    });
  }

  if (lms.assignmentCompletionRate < 80) {
    actions.push({
      id: 'act-lms-catchup',
      priority: 'MEDIUM',
      title: 'Submit Overdue Coursework Modules',
      description: `Clear ${lms.overdueAssignments} pending assignments before Friday 11:59 PM to restore LMS velocity.`,
      expectedScoreImpact: 5,
      category: 'LMS',
    });
  }

  // Fallback for top performers
  if (actions.length === 0) {
    actions.push({
      id: 'act-mentorship',
      priority: 'LOW',
      title: 'Lead Peer Mentorship Study Group',
      description: 'Earn honors credits by facilitating tutorial workshops for junior students in your department.',
      expectedScoreImpact: 3,
      category: 'ENGAGEMENT',
    });
  }

  return actions;
}

/**
 * Re-evaluate all engine outputs for a student record after data updates/imports
 */
export function recalculateStudentScores(student: Student): Student {
  const successScore = calculateSuccessScore({
    academic: student.academic,
    attendance: student.attendance,
    lms: student.lms,
    engagement: student.engagement,
    placement: student.placement,
    skills: student.skills,
    feedback: student.feedback,
  });

  const risk = determineRiskAnalysis({
    academic: student.academic,
    attendance: student.attendance,
    lms: student.lms,
    placement: student.placement,
    successScore: successScore.overall,
  });

  const cohort = determineCohort({
    academic: student.academic,
    attendance: student.attendance,
    lms: student.lms,
    placement: student.placement,
    engagement: student.engagement,
    successScore: successScore.overall,
    risk,
  });

  const xaiDrivers = generateXaiDrivers({
    academic: student.academic,
    attendance: student.attendance,
    placement: student.placement,
    lms: student.lms,
    engagement: student.engagement,
    skills: student.skills,
  });

  const actionableInsights = generatePrescriptiveActions({
    academic: student.academic,
    attendance: student.attendance,
    lms: student.lms,
    placement: student.placement,
    risk,
  });

  return {
    ...student,
    successScore,
    risk,
    cohort,
    xaiDrivers,
    actionableInsights,
  };
}
