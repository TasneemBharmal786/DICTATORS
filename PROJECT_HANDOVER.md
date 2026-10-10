# CAMPUS PULSE AI — Project Handover & Development State

> **Institutional Intelligence & Student Success Platform**  
> **Team DICTATORS** | Marwadi University | ByteXL HacXLerate 2026 — Round 1

---

## 📌 Executive Summary

This document serves as the project handover and architectural status documentation for **Campus Pulse AI** (`pulse.rvce.edu.in`).

All existing features from **Phase 1 (Access Control, Decision Intelligence, XAI, and Student Portal)** have been **100% preserved without rewriting or regression**. Development has seamlessly continued into **Phase 2 (Data Integration & Unified Student Repository)** in strict adherence to the *Smart Campus Analytics Phase 2 Specification*.

---

## 🏗️ Project Architecture & State Overview

```
src/
├── app/
│   ├── layout.tsx                   # Master shell with DemoSwitcher, Navbar, Footer
│   ├── page.tsx                     # Entry portal: Admin Console & Student Portal (Phase 1)
│   ├── admin/
│   │   └── data-upload/
│   │       └── page.tsx             # [PHASE 2] Ingestion, Validation, Error Export, Batch History
│   ├── students/
│   │   ├── page.tsx                 # [PHASE 2] Unified Student Repository & Multi-Filter Directory
│   │   └── [student_id]/
│   │       └── page.tsx             # [PHASE 2] Consolidated 360° Profile with Source Freshness
│   ├── privacy/page.tsx             # DPDP Act 2023 / FERPA compliance page
│   └── terms/page.tsx               # Institutional terms & conditions
├── components/
│   ├── DemoSwitcher.tsx             # Live judge persona switcher (Dr. Sharma, Rahul, Priya)
│   ├── Navbar.tsx                   # Top navigation across Dashboard, Repository, and Upload
│   ├── admin/
│   │   ├── AdminDashboard.tsx       # Decision Intelligence, KPIs, Cohorts, Approvals
│   │   ├── PendingApprovalsWidget.tsx
│   │   ├── MacroAnalytics.tsx
│   │   ├── StudentTable.tsx
│   │   └── StudentDetailModal.tsx
│   ├── student/
│   │   ├── StudentDashboard.tsx     # Student personal view, Success Score ring, guardrails
│   │   ├── PendingStudentView.tsx   # Gated access screen
│   │   └── AiMentorChatbot.tsx      # Aditi AI mentor
│   └── auth/
│       ├── LoginPage.tsx
│       └── AdminLoginPage.tsx
├── context/
│   └── AppContext.tsx               # Global state, localStorage persistence, upload batch log
├── lib/
│   ├── scoringEngine.ts             # 7-pillar mathematical formula, XAI, Dual-axis risk
│   └── datasetValidator.ts          # [PHASE 2] CSV/XLSX parser, schema validator, error exporter
├── types/
│   └── student.ts                   # Unified student model, upload batches, validation errors
└── data/
    └── mockStudents.ts              # Seeded archetypes (Rahul, Priya, Arjun, Sneha, etc.)
```

---

## 🚀 Implemented Capabilities

### Phase 1: Core Foundation & Decision Intelligence (Preserved)
1. **Gated Onboarding & Approvals**:
   - Students register and enter `PENDING` state with a gated lock screen.
   - Dean / Faculty Affairs Administrator reviews and approves requests with instant unlock.
2. **Dual-Axis At-Risk Identification**:
   - Separates **Academic Risk** (Backlogs, CGPA, Attendance) from **Placement Risk** (Coding score, Aptitude, Mock interviews).
3. **Proprietary Success Score Formula**:
   - $$\text{Success Score} = 0.30 \times P_{\text{acad}} + 0.25 \times P_{\text{place}} + 0.20 \times P_{\text{lms}} + 0.15 \times P_{\text{skills}} + 0.10 \times P_{\text{campus}} - 8 \times \text{Backlogs}$$
4. **Explainable AI (XAI)**:
   - SHAP-style positive and negative feature attribution drivers explaining student outcomes.
5. **Actionable Prescriptive Interventions**:
   - Remedial enrollments, compensatory attendance buffers, and 30-day DSA tracks with estimated score improvements.
6. **Aditi AI Academic Assistant**:
   - Contextual chat assistant analyzing student weak points.

---

### Phase 2: Data Integration & Unified Student Repository (Newly Completed)

#### 1. Centralized Data Ingestion Engine (`/admin/data-upload`)
* **Seven Target Dataset Categories**:
  * `ACADEMIC`: `student_id, student_name, department, semester, cgpa, backlogs, subject_average, internal_marks`
  * `ATTENDANCE`: `student_id, attendance_percentage, absent_days`
  * `LMS`: `student_id, login_frequency, assignments_completed, assignments_pending, average_session_duration`
  * `PLACEMENT`: `student_id, coding_score, aptitude_score, mock_interview_score, resume_score`
  * `SKILLS`: `student_id, technical_skill_score, communication_score, problem_solving_score`
  * `ENGAGEMENT`: `student_id, hackathons, events, certifications, clubs`
  * `FEEDBACK`: `student_id, faculty_rating, student_satisfaction, mentor_feedback`
* **File Processing**:
  * Real drag-and-drop dropzone supporting `.csv` (via `papaparse`) and `.xlsx` (via `xlsx`).
  * Automatic case-insensitive header normalization (spaces/punctuation converted to underscores).
  * Sample downloadable template CSV for all 7 dataset categories.
* **Rigorous Schema Validation**:
  * Range constraints (Semester: 1–8, Attendance: 0–100%, CGPA: 0–10.0, Scores: 0–100).
  * Duplicate Student ID detection within the upload file.
  * Cross-source consistency: Flags unmatched Student IDs not present in the master repository.
* **Preview & Error UX**:
  * Top preview cards: Total rows, Valid rows, Invalid rows, Duplicate rows, and Unmatched IDs.
  * Searchable row-level error log specifying row number, student ID, field, supplied value, error reason, and suggested fix.
  * One-click **Export CSV Report** button to download validation error logs.
* **Explicit Import Confirmation & Audit Trail**:
  * Confirmation modal detailing valid rows to be merged.
  * Safe upsert into student repository keyed by Student ID.
  * Traceable **Upload Batch History** table with unique batch IDs (`BATCH-YYYY-XXXXX`), filenames, timestamps, counts, and status.

---

#### 2. Unified Student Repository Directory (`/students`)
* **Repository-Level Metric Cards**:
  * Total Students (master entity count)
  * Department coverage count
  * Mean CGPA with coverage calculation
  * Mean Attendance percentage
  * Total datasets uploaded count with direct navigation to batch audit logs
* **Search & Multi-Axis Filtering**:
  * Live text search by Name, Student ID / USN, Department, or Semester.
  * Department dropdown filter.
  * Semester dropdown filter (1 to 8).
  * Attendance band pills: `< 75%` (Critical), `75%–85%`, `> 85%` (Optimal).
  * CGPA band pills: `< 6.0`, `6.0–8.0`, `> 8.0` (Honor).
  * Active filter chips with one-click clear all.
  * Column sorting by Name, Student ID, CGPA, Attendance %, Coding Score.
* **Data Completeness Indicators**:
  * Highlights `Complete` (6+ sources), `Partial` (3-5 sources), or `Missing` without prematurely showing predictive risk.

---

#### 3. Consolidated 360° Student Profile (`/students/{student_id}`)
* **Header & Source Freshness Strip**:
  * Student photo, name, USN, department, semester, and email.
  * 7-pillar source availability status indicators (Academic, Attendance, LMS, Placement, Skills, Engagement, Feedback) displaying per-source last updated timestamps.
* **Detailed Tabs with Explicit Missing-Data States**:
  * Displays sourced metrics or clear *"No data imported for this source"* states rather than misleading zeros.
  * Expandable panels for subject-wise attendance and qualitative mentor feedback remarks.
  * Safe navigation preserving repository context.

---

## 🛠️ Verification & Testing Results

1. **Production Build (`npm run build`)**:
   ```text
   Route (app)                              Size     First Load JS
   ┌ ○ /                                    23.8 kB         250 kB
   ├ ○ /_not-found                          873 B          88.1 kB
   ├ ○ /admin/data-upload                   6.92 kB         233 kB
   ├ ○ /privacy                             3.02 kB        99.5 kB
   ├ ○ /students                            5.05 kB         231 kB
   ├ ƒ /students/[student_id]               12.6 kB         232 kB
   └ ○ /terms                               2.46 kB        98.9 kB
   ✓ Compiled successfully with zero type or build errors.
   ```
2. **Local HTTP Endpoints**:
   * `GET http://localhost:3000/` → **200 OK**
   * `GET http://localhost:3000/students` → **200 OK**
   * `GET http://localhost:3000/admin/data-upload` → **200 OK**
   * `GET http://localhost:3000/students/stu-001` → **200 OK**

---

## 👨‍💻 Quick Run Instructions

```bash
# Start development server
npm run dev

# Or build for production
npm run build
npm run start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
