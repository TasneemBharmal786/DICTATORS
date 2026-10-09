# Edusphera AI — Student Analytics & Success Platform

> **AI-Powered Decision Intelligence for University Faculty, Administrators, and Students**

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌟 Hackathon Live Presentation Flow

The prototype features a **Top Live Demo Switcher** designed specifically for presenting to judges:

1. **Test Gated Onboarding:**
   - Click **"Rahul Verma (Pending)"** in the top switcher bar.
   - Notice the **Gated Verification Lock Screen** indicating that Rahul cannot access his analytics yet.
   - Switch to **"Faculty Admin (Dr. Sharma)"**.
   - Notice the **Pending Approvals Widget** at the top of the Admin dashboard with Rahul's pending request.
   - Click **"Approve Access"**.
   - Switch back to **"Rahul Verma"** — his full Student Dashboard and AI insights are now immediately unlocked!

2. **Explore Macro Decision Intelligence:**
   - On the Admin portal, examine campus KPIs: Average Success Score, High Academic Risk Count, Placement Risk Count.
   - Click on cohort filter pills (e.g., *"High Academic, Low Placement"*, *"Coding Wizards"*, *"Dropout Risk"*).
   - Use the live search bar to search by name or USN.

3. **Inspect the 360° Micro Profile:**
   - Click on **"Arjun Mehta"** (or click *"Inspect"* in the table).
   - Notice that Arjun has a stellar **8.86 CGPA** but a high **Placement Risk** due to a **42/100 coding score** and **0 mock interviews**.
   - Show judges the **Explainable AI (XAI)** tab displaying SHAP-style positive and negative feature attribution bars.

4. **Demonstrate Student Actionable Recommendations:**
   - Switch to **"Priya Nair"** or any approved student.
   - Showcase their personalized **Success Score ring**, **Attendance Safety Guardrails** (classes they can safely miss), and **Prescriptive Action Items** (e.g., *"+9 pts: Complete 30-Day DSA Bootcamp"*).

---

## 🧠 Proprietary Student Success Score Formulation

$$\text{Success Score} = \sum_{k=1}^{5} (w_k \times P_k) - \text{Backlog Penalty}$$

| Pillar | Indicator Sources | Weight ($w_k$) |
| :--- | :--- | :--- |
| **Academic Performance ($P_1$)** | Cumulative GPA ($\text{CGPA} \times 10$) | **30%** |
| **Placement Readiness ($P_2$)** | $0.4 \times \text{Coding} + 0.3 \times \text{Aptitude} + 0.3 \times \text{Mock Interviews}$ | **25%** |
| **Attendance & LMS Velocity ($P_3$)** | $0.5 \times \text{Attendance \%} + 0.5 \times \text{LMS Assignment Completion \%}$ | **20%** |
| **Verified Skills ($P_4$)** | $0.6 \times \text{Technical Skill Rating} + 0.4 \times \text{Soft Skills Rating}$ | **15%** |
| **Campus Life & Sentiment ($P_5$)** | Hackathon participations, wins, clubs, survey sentiment | **10%** |
| **Backlog Penalty** | Deduction of **8 points per active backlog** | — |

---

## 🛡️ Dual-Axis At-Risk Identification

Rather than a single flat risk label, students are evaluated along two separate operational vectors:

* **Academic Risk**:
  - 🔴 **HIGH**: Backlogs $\ge 2$ OR Attendance $< 65\%$ OR CGPA $< 6.0$
  - 🟡 **MEDIUM**: Backlogs $= 1$ OR Attendance $< 75\%$ OR CGPA $< 7.0$
  - 🟢 **LOW**: Zero backlogs, Attendance $\ge 75\%$, CGPA $\ge 7.0$

* **Placement Risk**:
  - 🔴 **HIGH**: Coding Benchmark $< 50$ OR Mock Interview Rating $< 50$ OR Aptitude $< 50$
  - 🟡 **MEDIUM**: Any placement score between $50$ and $68$
  - 🟢 **LOW**: All placement components $\ge 70$

---

## 🎯 Actionable Student Segmentation Cohorts

1. **Top Performers / Campus Stars**: High Academic + High Placement Readiness ($\ge 85$ score).
2. **High Academic, Low Placement Readiness**: High CGPA ($>7.8$), but deficient in competitive coding or interviews (Needs targeted placement bootcamps).
3. **Coding Wizards / Practical Innovators**: Modest CGPA ($6.0 - 7.0$), but high LeetCode benchmark ($85+$) and hackathon victories (Needs academic attendance safety buffer).
4. **High Risk of Dropout / Year-Back**: Low attendance ($<65\%$) and multiple active arrears (Needs immediate faculty dean intervention).
5. **Disengaged LMS / Passive Learners**: Low portal login frequency and overdue assignments.
6. **Consistent All-Rounder**: Steady academic and extracurricular trajectory.

---

## 📁 Project Architecture

```
├── package.json                   # Next.js 14, Tailwind, Lucide React
├── tsconfig.json                  # Strict TypeScript configuration
├── tailwind.config.js             # Brand & risk color definitions
├── src/
│   ├── types/
│   │   └── student.ts             # Unified 7-pillar data model & interfaces
│   ├── lib/
│   │   └── scoringEngine.ts       # Mathematical scoring, XAI & risk algorithms
│   ├── data/
│   │   └── mockStudents.ts        # 8 curated archetypes (Rahul, Priya, Arjun, Sneha, etc.)
│   ├── context/
│   │   └── AppContext.tsx         # Real-time state, localStorage persistence, gated approvals
│   ├── components/
│   │   ├── DemoSwitcher.tsx       # Live presentation top controller
│   │   ├── Navbar.tsx             # Main branding and profile context
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── PendingApprovalsWidget.tsx   # Gated onboarding widget
│   │   │   ├── MacroAnalytics.tsx           # Campus KPIs & cohort filters
│   │   │   ├── StudentTable.tsx             # Interactive student roster
│   │   │   └── StudentDetailModal.tsx       # 360° micro view & XAI breakdown
│   │   └── student/
│   │       ├── StudentDashboard.tsx         # Post-approval student portal
│   │       └── PendingStudentView.tsx       # Gated verification lock screen
│   └── app/
│       ├── layout.tsx             # App layout
│       ├── page.tsx               # Entry router
│       └── globals.css            # Styles & glassmorphism
```
