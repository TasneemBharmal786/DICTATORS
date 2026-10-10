import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DatasetType, RowValidationError, Student } from '@/types/student';
import { recalculateStudentScores } from './scoringEngine';

export interface DatasetFieldSpec {
  name: string;
  label: string;
  required: boolean;
  type: 'string' | 'integer' | 'decimal' | 'score' | 'percentage' | 'text';
  min?: number;
  max?: number;
  description: string;
}

export const DATASET_CONFIG: Record<
  DatasetType,
  {
    title: string;
    description: string;
    fields: Record<string, DatasetFieldSpec>;
    sampleCsv: string;
  }
> = {
  ACADEMIC: {
    title: 'Academic Records',
    description: 'Master student identities, GPA, semester performance, and backlogs',
    fields: {
      student_id: { name: 'student_id', label: 'Student ID / USN', required: true, type: 'string', description: 'Unique integration key (e.g. 1RV21CS089)' },
      student_name: { name: 'student_name', label: 'Student Name', required: true, type: 'string', description: 'Full official name' },
      department: { name: 'department', label: 'Department', required: true, type: 'string', description: 'Degree discipline (e.g. Computer Science & Eng)' },
      semester: { name: 'semester', label: 'Semester', required: true, type: 'integer', min: 1, max: 8, description: 'Current semester (1 to 8)' },
      cgpa: { name: 'cgpa', label: 'CGPA', required: false, type: 'decimal', min: 0, max: 10, description: 'Grade point average on 0-10 scale' },
      backlogs: { name: 'backlogs', label: 'Active Backlogs', required: false, type: 'integer', min: 0, description: 'Number of active course arrears' },
      subject_average: { name: 'subject_average', label: 'Subject Average (%)', required: false, type: 'score', min: 0, max: 100, description: 'Average percentage marks' },
      internal_marks: { name: 'internal_marks', label: 'Internal Marks', required: false, type: 'score', min: 0, max: 100, description: 'Internal assessment score (0-100)' },
    },
    sampleCsv: `student_id,student_name,department,semester,cgpa,backlogs,subject_average,internal_marks
1RV21CS089,Rahul Verma,Computer Science & Eng,6,7.82,0,84,86
1RV21CS042,Arjun Mehta,Information Science & Eng,6,8.86,0,91,93
1RV21IS015,Priya Nair,Computer Science & Eng,6,9.24,0,95,96`,
  },
  ATTENDANCE: {
    title: 'Attendance Records',
    description: 'Biometric and classroom attendance logs and absence trackers',
    fields: {
      student_id: { name: 'student_id', label: 'Student ID / USN', required: true, type: 'string', description: 'Student identifier' },
      attendance_percentage: { name: 'attendance_percentage', label: 'Attendance %', required: true, type: 'percentage', min: 0, max: 100, description: 'Overall attendance percentage (0-100)' },
      absent_days: { name: 'absent_days', label: 'Absent Days', required: false, type: 'integer', min: 0, description: 'Total recorded absent sessions' },
    },
    sampleCsv: `student_id,attendance_percentage,absent_days
1RV21CS089,84.5,7
1RV21CS042,91.0,4
1RV21IS015,95.2,2`,
  },
  LMS: {
    title: 'LMS Activity & Velocity',
    description: 'Portal logins, assignment velocity, and study hours',
    fields: {
      student_id: { name: 'student_id', label: 'Student ID / USN', required: true, type: 'string', description: 'Student identifier' },
      login_frequency: { name: 'login_frequency', label: 'Weekly Logins', required: false, type: 'integer', min: 0, description: 'Portal login count per week' },
      assignments_completed: { name: 'assignments_completed', label: 'Assignments Completed', required: false, type: 'integer', min: 0, description: 'Completed coursework tasks' },
      assignments_pending: { name: 'assignments_pending', label: 'Assignments Pending', required: false, type: 'integer', min: 0, description: 'Overdue/pending homework tasks' },
      average_session_duration: { name: 'average_session_duration', label: 'Avg Session (hrs/wk)', required: false, type: 'decimal', min: 0, description: 'Weekly LMS study duration' },
    },
    sampleCsv: `student_id,login_frequency,assignments_completed,assignments_pending,average_session_duration
1RV21CS089,14,22,2,4.5
1RV21CS042,18,25,0,6.2
1RV21IS015,22,28,0,8.1`,
  },
  PLACEMENT: {
    title: 'Placement & Career Readiness',
    description: 'LeetCode benchmarks, aptitude ratings, mock interview scores',
    fields: {
      student_id: { name: 'student_id', label: 'Student ID / USN', required: true, type: 'string', description: 'Student identifier' },
      coding_score: { name: 'coding_score', label: 'Coding Benchmark (0-100)', required: false, type: 'score', min: 0, max: 100, description: 'Technical coding test score' },
      aptitude_score: { name: 'aptitude_score', label: 'Aptitude Score (0-100)', required: false, type: 'score', min: 0, max: 100, description: 'Logical & quantitative rating' },
      mock_interview_score: { name: 'mock_interview_score', label: 'Mock Interview (0-100)', required: false, type: 'score', min: 0, max: 100, description: 'HR & tech mock interview score' },
      resume_score: { name: 'resume_score', label: 'Resume ATS Score (0-100)', required: false, type: 'score', min: 0, max: 100, description: 'ATS resume audit score' },
    },
    sampleCsv: `student_id,coding_score,aptitude_score,mock_interview_score,resume_score
1RV21CS089,78,82,75,85
1RV21CS042,42,88,40,70
1RV21IS015,92,90,94,95`,
  },
  SKILLS: {
    title: 'Verified Skills & Assessments',
    description: 'Direct technical, soft skill, and problem-solving evaluations',
    fields: {
      student_id: { name: 'student_id', label: 'Student ID / USN', required: true, type: 'string', description: 'Student identifier' },
      technical_skill_score: { name: 'technical_skill_score', label: 'Technical Rating (0-100)', required: false, type: 'score', min: 0, max: 100, description: 'Core discipline competence' },
      communication_score: { name: 'communication_score', label: 'Communication Score (0-100)', required: false, type: 'score', min: 0, max: 100, description: 'Verbal/written soft skills rating' },
      problem_solving_score: { name: 'problem_solving_score', label: 'Problem Solving (0-100)', required: false, type: 'score', min: 0, max: 100, description: 'Analytical reasoning rating' },
    },
    sampleCsv: `student_id,technical_skill_score,communication_score,problem_solving_score
1RV21CS089,82,78,85
1RV21CS042,65,72,80
1RV21IS015,94,91,95`,
  },
  ENGAGEMENT: {
    title: 'Extracurricular & Campus Life',
    description: 'Hackathons, collegiate club leadership, external certifications',
    fields: {
      student_id: { name: 'student_id', label: 'Student ID / USN', required: true, type: 'string', description: 'Student identifier' },
      hackathons: { name: 'hackathons', label: 'Hackathons Attended', required: false, type: 'integer', min: 0, description: 'Participations in competitive hackathons' },
      events: { name: 'events', label: 'Workshops/Events', required: false, type: 'integer', min: 0, description: 'Academic conferences & workshops' },
      certifications: { name: 'certifications', label: 'Certifications Count', required: false, type: 'integer', min: 0, description: 'Industry certifications (AWS, GCP, etc.)' },
      clubs: { name: 'clubs', label: 'Clubs Joined', required: false, type: 'integer', min: 0, description: 'Active student clubs' },
    },
    sampleCsv: `student_id,hackathons,events,certifications,clubs
1RV21CS089,3,5,2,2
1RV21CS042,1,2,1,1
1RV21IS015,5,8,4,3`,
  },
  FEEDBACK: {
    title: 'Faculty Mentorship & Sentiment',
    description: 'Faculty ratings, student survey feedback, and counselor notes',
    fields: {
      student_id: { name: 'student_id', label: 'Student ID / USN', required: true, type: 'string', description: 'Student identifier' },
      faculty_rating: { name: 'faculty_rating', label: 'Faculty Rating (0-100)', required: false, type: 'score', min: 0, max: 100, description: 'Mentor assessment rating' },
      student_satisfaction: { name: 'student_satisfaction', label: 'Student Satisfaction (0-100)', required: false, type: 'score', min: 0, max: 100, description: 'Survey sentiment index' },
      mentor_feedback: { name: 'mentor_feedback', label: 'Mentor Notes', required: false, type: 'text', description: 'Counselor qualitative remarks' },
    },
    sampleCsv: `student_id,faculty_rating,student_satisfaction,mentor_feedback
1RV21CS089,88,85,Consistently demonstrates good analytical curiosity; needs coding focus.
1RV21CS042,75,80,Strong academic scores but struggles with mock interview confidence.
1RV21IS015,96,92,Outstanding leadership in campus initiatives and top placement candidate.`,
  },
};

export function normalizeHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .replace(/[\s\-\.\/\(\)\[\]]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export interface ValidationSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  unmatchedRows: number;
  errors: RowValidationError[];
  parsedData: Record<string, any>[];
  validData: Record<string, any>[];
}

export function parseFileContent(
  file: File,
  datasetType: DatasetType
): Promise<{ headers: string[]; rows: Record<string, any>[] }> {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: (h) => normalizeHeader(h),
        complete: (results) => {
          if (results.errors.length > 0 && results.data.length === 0) {
            reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
            return;
          }
          const headers = results.meta.fields || [];
          resolve({ headers, rows: results.data as Record<string, any>[] });
        },
        error: (err) => reject(new Error(`Failed to parse CSV: ${err.message}`)),
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          if (!sheetName) {
            reject(new Error('Excel workbook contains no sheets.'));
            return;
          }
          const worksheet = workbook.Sheets[sheetName];
          const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
            defval: '',
            blankrows: false,
          });

          const normalizedRows = rawRows.map((row) => {
            const out: Record<string, any> = {};
            for (const [key, val] of Object.entries(row)) {
              out[normalizeHeader(key)] = val;
            }
            return out;
          });

          const headers = normalizedRows.length > 0 ? Object.keys(normalizedRows[0]) : [];
          resolve({ headers, rows: normalizedRows });
        } catch (err: any) {
          reject(new Error(`Failed to parse Excel file: ${err.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file from disk.'));
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Unsupported file extension. Only .csv and .xlsx files are supported.'));
    }
  });
}

export function validateDatasetRows(
  rows: Record<string, any>[],
  datasetType: DatasetType,
  existingStudents: Student[]
): ValidationSummary {
  const config = DATASET_CONFIG[datasetType];
  const fieldSpecs = config.fields;

  const errors: RowValidationError[] = [];
  const seenStudentIds = new Set<string>();
  const duplicateRowsSet = new Set<number>();
  const unmatchedRowsSet = new Set<number>();
  const validData: Record<string, any>[] = [];

  const existingIdSet = new Set(
    existingStudents.map((s) => s.usn.trim().toUpperCase())
  );

  rows.forEach((row, idx) => {
    const rowNum = idx + 2; // 1-indexed, header is line 1
    let rowHasError = false;

    // Check Student ID
    const rawStudentId = (row['student_id'] || row['usn'] || '').toString().trim();
    if (!rawStudentId) {
      errors.push({
        rowNumber: rowNum,
        studentId: 'MISSING',
        field: 'student_id',
        suppliedValue: '',
        errorDescription: 'Student ID is required for all dataset integrations.',
        suggestedFix: 'Provide a valid USN / Student ID (e.g. 1RV21CS089).',
      });
      rowHasError = true;
    } else {
      const normalizedId = rawStudentId.toUpperCase();

      // Check Duplicates within upload batch
      if (seenStudentIds.has(normalizedId)) {
        errors.push({
          rowNumber: rowNum,
          studentId: rawStudentId,
          field: 'student_id',
          suppliedValue: rawStudentId,
          errorDescription: `Duplicate Student ID '${rawStudentId}' found within this upload batch.`,
          suggestedFix: 'Ensure each student has only one entry per dataset upload.',
        });
        duplicateRowsSet.add(rowNum);
        rowHasError = true;
      } else {
        seenStudentIds.add(normalizedId);
      }

      // Check Unmatched ID (if not ACADEMIC, student MUST already exist in master repository)
      if (datasetType !== 'ACADEMIC' && !existingIdSet.has(normalizedId)) {
        errors.push({
          rowNumber: rowNum,
          studentId: rawStudentId,
          field: 'student_id',
          suppliedValue: rawStudentId,
          errorDescription: `Student ID '${rawStudentId}' is not found in the master Student repository.`,
          suggestedFix: 'Upload Academic master records first, or verify the student USN.',
        });
        unmatchedRowsSet.add(rowNum);
        rowHasError = true;
      }
    }

    // Validate fields according to spec
    for (const [key, spec] of Object.entries(fieldSpecs)) {
      if (key === 'student_id') continue;

      const rawVal = row[key];
      const hasVal = rawVal !== undefined && rawVal !== null && rawVal !== '';

      if (spec.required && !hasVal) {
        errors.push({
          rowNumber: rowNum,
          studentId: rawStudentId || 'N/A',
          field: key,
          suppliedValue: '(empty)',
          errorDescription: `Field '${spec.label}' is required.`,
          suggestedFix: `Supply a valid value for ${spec.label}.`,
        });
        rowHasError = true;
        continue;
      }

      if (hasVal) {
        if (spec.type === 'integer' || spec.type === 'decimal' || spec.type === 'score' || spec.type === 'percentage') {
          const num = Number(rawVal);
          if (isNaN(num)) {
            errors.push({
              rowNumber: rowNum,
              studentId: rawStudentId || 'N/A',
              field: key,
              suppliedValue: String(rawVal),
              errorDescription: `Field '${spec.label}' must be a numeric value.`,
              suggestedFix: 'Provide a valid number without text or symbols.',
            });
            rowHasError = true;
          } else {
            if (spec.type === 'integer' && !Number.isInteger(num)) {
              errors.push({
                rowNumber: rowNum,
                studentId: rawStudentId || 'N/A',
                field: key,
                suppliedValue: String(rawVal),
                errorDescription: `Field '${spec.label}' must be an integer.`,
                suggestedFix: 'Provide a whole number.',
              });
              rowHasError = true;
            }
            if (spec.min !== undefined && num < spec.min) {
              errors.push({
                rowNumber: rowNum,
                studentId: rawStudentId || 'N/A',
                field: key,
                suppliedValue: String(rawVal),
                errorDescription: `Field '${spec.label}' cannot be less than ${spec.min}.`,
                suggestedFix: `Value must be >= ${spec.min}.`,
              });
              rowHasError = true;
            }
            if (spec.max !== undefined && num > spec.max) {
              errors.push({
                rowNumber: rowNum,
                studentId: rawStudentId || 'N/A',
                field: key,
                suppliedValue: String(rawVal),
                errorDescription: `Field '${spec.label}' cannot exceed ${spec.max}.`,
                suggestedFix: `Value must be <= ${spec.max}.`,
              });
              rowHasError = true;
            }
          }
        }
      }
    }

    if (!rowHasError) {
      validData.push(row);
    }
  });

  const validRows = validData.length;
  const invalidRows = rows.length - validRows;

  return {
    totalRows: rows.length,
    validRows,
    invalidRows,
    duplicateRows: duplicateRowsSet.size,
    unmatchedRows: unmatchedRowsSet.size,
    errors,
    parsedData: rows,
    validData,
  };
}

export function exportErrorsToCsv(errors: RowValidationError[], datasetType: string): void {
  const csvContent = Papa.unparse(
    errors.map((e) => ({
      'Row Number': e.rowNumber,
      'Student ID': e.studentId,
      'Field': e.field,
      'Supplied Value': e.suppliedValue,
      'Error Description': e.errorDescription,
      'Suggested Fix': e.suggestedFix,
    }))
  );

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Validation_Errors_${datasetType}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function applyImportedRecords(
  currentStudents: Student[],
  datasetType: DatasetType,
  validData: Record<string, any>[]
): { updatedStudents: Student[]; importedCount: number } {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';
  const studentMap = new Map<string, Student>();

  currentStudents.forEach((stu) => {
    studentMap.set(stu.usn.trim().toUpperCase(), { ...stu });
  });

  let importedCount = 0;

  validData.forEach((row) => {
    const rawId = (row['student_id'] || row['usn'] || '').toString().trim();
    const idKey = rawId.toUpperCase();

    let student = studentMap.get(idKey);

    if (datasetType === 'ACADEMIC') {
      if (!student) {
        // Create new master student record
        const newStudent: Student = {
          id: `stu-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          usn: rawId,
          name: row['student_name'] || 'Unknown Student',
          email: `${rawId.toLowerCase()}@rvce.edu.in`,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          gender: 'Female',
          admissionYear: 2023,
          approvalStatus: 'APPROVED',
          requestedAt: 'Imported Record',
          approvedAt: timestamp,
          reviewedBy: 'Data Integration Engine',
          academic: {
            cgpa: row['cgpa'] ? Number(row['cgpa']) : 7.0,
            activeBacklogs: row['backlogs'] ? Number(row['backlogs']) : 0,
            totalBacklogsCleared: 0,
            semester: row['semester'] ? Number(row['semester']) : 6,
            department: row['department'] || 'Computer Science & Eng',
            failedSubjects: [],
            topSubjects: [],
          },
          attendance: {
            overallPercentage: 80,
            subjectWise: [],
            medicalLeavesCount: 0,
            trend: 'STABLE',
          },
          lms: {
            weeklyLogins: 10,
            assignmentCompletionRate: 80,
            avgTimeSpentHoursWeekly: 5,
            overdueAssignments: 0,
            lastActiveDate: 'Today',
          },
          engagement: {
            eventsAttended: 2,
            activeClubs: ['Coding Club'],
            hackathonsCount: 1,
            hackathonWins: 0,
            certifications: [],
          },
          placement: {
            codingScore: 70,
            aptitudeScore: 75,
            mockInterviewRating: 70,
            solvedProblemsCount: 50,
            placementDriveEligible: true,
          },
          skills: {
            technicalRating: 75,
            softSkillsRating: 80,
            primarySkillset: ['Python', 'SQL'],
            skillGaps: [],
          },
          feedback: {
            studentSatisfactionScore: 4,
            facultyMentorFeedback: 'Regular student, satisfactory academic commitment.',
            facultySentiment: 'POSITIVE',
            lastMeetingDate: 'Recent',
          },
          sourceCoverage: {
            academic: { available: true, lastUpdated: timestamp },
          },
          dataCompleteness: 'Partial',
          successScore: {
            overall: 70,
            academicPillar: 70,
            placementPillar: 70,
            engagementLmsPillar: 70,
            skillsPillar: 75,
            campusLifePillar: 60,
            backlogPenalty: 0,
          },
          risk: {
            academicRisk: 'LOW',
            placementRisk: 'LOW',
            overallRisk: 'LOW',
            primaryRiskReason: 'Recently imported student profile',
          },
          cohort: {
            type: 'CONSISTENT_AVERAGE',
            label: 'Consistent Performer',
            badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
            description: 'Newly integrated academic profile',
          },
          xaiDrivers: [],
          actionableInsights: [],
        };
        student = recalculateStudentScores(newStudent);
        studentMap.set(idKey, student);
        importedCount++;
        return;
      } else {
        // Update existing student's academic data
        if (row['cgpa'] !== undefined && row['cgpa'] !== '') student.academic.cgpa = Number(row['cgpa']);
        if (row['backlogs'] !== undefined && row['backlogs'] !== '') student.academic.activeBacklogs = Number(row['backlogs']);
        if (row['semester'] !== undefined && row['semester'] !== '') student.academic.semester = Number(row['semester']);
        if (row['department']) student.academic.department = row['department'];
      }
    } else if (student) {
      switch (datasetType) {
        case 'ATTENDANCE':
          if (row['attendance_percentage'] !== undefined && row['attendance_percentage'] !== '') {
            student.attendance.overallPercentage = Number(row['attendance_percentage']);
          }
          if (row['absent_days'] !== undefined && row['absent_days'] !== '') {
            student.attendance.medicalLeavesCount = Number(row['absent_days']);
          }
          break;
        case 'LMS':
          if (row['login_frequency'] !== undefined && row['login_frequency'] !== '') {
            student.lms.weeklyLogins = Number(row['login_frequency']);
          }
          if (row['assignments_completed'] !== undefined && row['assignments_completed'] !== '') {
            student.lms.assignmentCompletionRate = Math.min(100, Math.round((Number(row['assignments_completed']) / (Number(row['assignments_completed']) + (Number(row['assignments_pending']) || 1))) * 100));
          }
          if (row['assignments_pending'] !== undefined && row['assignments_pending'] !== '') {
            student.lms.overdueAssignments = Number(row['assignments_pending']);
          }
          if (row['average_session_duration'] !== undefined && row['average_session_duration'] !== '') {
            student.lms.avgTimeSpentHoursWeekly = Number(row['average_session_duration']);
          }
          break;
        case 'PLACEMENT':
          if (row['coding_score'] !== undefined && row['coding_score'] !== '') {
            student.placement.codingScore = Number(row['coding_score']);
          }
          if (row['aptitude_score'] !== undefined && row['aptitude_score'] !== '') {
            student.placement.aptitudeScore = Number(row['aptitude_score']);
          }
          if (row['mock_interview_score'] !== undefined && row['mock_interview_score'] !== '') {
            student.placement.mockInterviewRating = Number(row['mock_interview_score']);
          }
          break;
        case 'SKILLS':
          if (row['technical_skill_score'] !== undefined && row['technical_skill_score'] !== '') {
            student.skills.technicalRating = Number(row['technical_skill_score']);
          }
          if (row['communication_score'] !== undefined && row['communication_score'] !== '') {
            student.skills.softSkillsRating = Number(row['communication_score']);
          }
          break;
        case 'ENGAGEMENT':
          if (row['hackathons'] !== undefined && row['hackathons'] !== '') {
            student.engagement.hackathonsCount = Number(row['hackathons']);
          }
          if (row['events'] !== undefined && row['events'] !== '') {
            student.engagement.eventsAttended = Number(row['events']);
          }
          break;
        case 'FEEDBACK':
          if (row['faculty_rating'] !== undefined && row['faculty_rating'] !== '') {
            student.feedback.studentSatisfactionScore = Math.min(5, Math.max(1, Math.round(Number(row['faculty_rating']) / 20)));
          }
          if (row['mentor_feedback']) {
            student.feedback.facultyMentorFeedback = String(row['mentor_feedback']);
          }
          break;
      }
    }

    if (student) {
      if (!student.sourceCoverage) student.sourceCoverage = {};
      student.sourceCoverage[datasetType.toLowerCase()] = {
        available: true,
        lastUpdated: timestamp,
      };

      // Determine Completeness
      const sourcesCount = Object.values(student.sourceCoverage).filter((s) => s.available).length;
      student.dataCompleteness = sourcesCount >= 6 ? 'Complete' : sourcesCount >= 3 ? 'Partial' : 'Missing';

      // Re-run the scoring engine
      student = recalculateStudentScores(student);
      studentMap.set(idKey, student);
      importedCount++;
    }
  });

  return {
    updatedStudents: Array.from(studentMap.values()),
    importedCount,
  };
}
