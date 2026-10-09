'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bot,
  Sparkles,
  Calendar,
  X,
  Send,
  Dumbbell,
  TrendingUp,
  School,
  BookOpen,
  Briefcase,
  Target,
} from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export const AiMentorChatbot: React.FC = () => {
  const { currentStudent } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: `Hello **${currentStudent?.name || 'there'}**! I am **Aditi**, your **Campus Pulse AI Academic Advisor**.\n\n**Notice:** Sorry ${currentStudent?.gender === 'Female' ? 'Miss.' : (currentStudent?.gender === 'Male' ? 'Mr.' : 'miss/mr.')} ${currentStudent?.name || ''}, I am not obligated to answer any question which does not concern the university or ur studies.\n\nYou can consult me on:\n• **University Regulations:** 75% attendance policy, medical condonation, exam hall tickets & grading.\n• **Academic Mentorship:** Subject doubts (DSA, OS, DBMS), exam strategy & backlog clearance.\n• **Campus Placements:** Tier-1 eligibility cutoffs, coding test preparation & mock interviews.\n• **Campus Facilities & Timetable:** Library timings, lab hours, Dean's office & study schedules.\n\nWhat university or academic question would you like assistance with today?`,
    },
  ]);

  if (!currentStudent) return null;

  const handleSendPreset = (type: 'rules' | 'study' | 'timetable' | 'placement' | 'weakness') => {
    let userText = '';
    let botReply = '';

    if (type === 'rules') {
      userText = 'Can you explain the official university attendance rules and examination policies?';
      botReply = `### University Academic Guidelines & Regulations (AY 2026-27)\n\n` +
        `1. **Mandatory 75% Attendance Threshold:**\n` +
        `   • You must maintain $\\ge 75\\%$ attendance in every course to receive your exam hall ticket.\n` +
        `   • **Your Status:** **${currentStudent.attendance.overallPercentage}%** ${currentStudent.attendance.overallPercentage >= 75 ? '(Fully Eligible)' : '(Critical Attendance Alert)'}\n` +
        `   • **Medical Condonation (65%–74%):** Requires submittal of registered doctor certificates to Dean Dr. Sharma within 3 days.\n\n` +
        `2. **Continuous Internal Evaluation (CIE):** Minimum 40% score required to qualify for Semester End Exams (SEE).\n\n` +
        `3. **Backlogs & Arrears:** Supplementary exams are scheduled after even semester results. Department remedial tutorials take place on Saturdays.`;
    } else if (type === 'study') {
      userText = 'How should I study effectively for difficult engineering subjects and clear arrears?';
      botReply = `### Engineering Study Framework for ${currentStudent.name}\n\n` +
        `1. **Active Recall & Spaced Repetition:** Instead of passive re-reading, test yourself by sketching system architectures and algorithm traces on paper without looking at course notes.\n\n` +
        `2. **Prioritize 80/20 High-Yield Modules:** Core derivations, state machine diagrams, and recursion problems appear across 65% of semester-end papers.\n\n` +
        `3. **Arrears Recovery Window:** Dedicate a non-negotiable **90-minute daily focus sprint** to uncleared courses before beginning evening placement practice.`;
    } else if (type === 'placement') {
      userText = 'What are the campus placement eligibility criteria and company cutoffs?';
      botReply = `### Campus Placement Eligibility Benchmark\n\n` +
        `1. **Academic Criteria:**\n` +
        `   • **Tier-1 Tech Companies (18+ LPA):** 7.5+ CGPA, Zero active arrears.\n` +
        `   • **Tier-2 & Core Engineering:** 6.5+ CGPA, Max 1 backlog permitted in initial rounds.\n` +
        `   • **Your Standing:** CGPA **${currentStudent.academic.cgpa}** (${currentStudent.placement.placementDriveEligible ? 'Eligible' : 'Requires Coding/Interview Boost'}).\n\n` +
        `2. **Algorithmic Threshold:** Target **70/100+** on the college LeetCode portal (Focus: Arrays, HashMaps, Trees, Dynamic Programming).`;
    } else if (type === 'timetable') {
      userText = 'Can you generate my balanced weekly study, placement & sports timetable?';
      botReply = `### Balanced Study, Placement & Sports Schedule for ${currentStudent.name}\n\n` +
        `| Time Slot | Activity | Focus Objective |\n` +
        `| :--- | :--- | :--- |\n` +
        `| **06:30 AM – 07:45 AM** | **Sports & Cardio Conditioning** | Badminton / Running / Football (Enhances cognitive endurance) |\n` +
        `| **08:00 AM – 08:45 AM** | High-Protein Breakfast | Nutrition & cognitive reset |\n` +
        `| **09:00 AM – 04:30 PM** | **College Lectures & Labs** | Protects your **${currentStudent.attendance.overallPercentage}%** attendance safety threshold |\n` +
        `| **05:00 PM – 06:15 PM** | **Evening Sports Play** | Outdoor recreation to reset mental fatigue |\n` +
        `| **06:30 PM – 08:00 PM** | **Targeted Technical Sprint** | ${currentStudent.placement.codingScore < 70 ? 'Data Structures & Algorithms (Trees/Graphs)' : 'System Design & High-Concurrency Lab'} |\n` +
        `| **08:30 PM – 09:30 PM** | **Coursework & LMS Revision** | Submit pending coursework modules on time |\n` +
        `| **10:00 PM – 10:30 PM** | Wind-Down & Sleep Prep | Rest is vital for memory consolidation |\n\n` +
        `> **Holistic Sports Integration:** 75 minutes of daily physical sports elevates brain plasticity, reducing exam stress and building stamina for 4-hour placement marathons!`;
    } else if (type === 'weakness') {
      userText = 'Where am I lacking in my studies and what points should I follow to improve myself?';
      botReply = generateStudentImprovementAnalysis(currentStudent);
    }

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'bot', text: botReply },
    ]);
  };

  const generateStudentImprovementAnalysis = (student: typeof currentStudent) => {
    if (!student) return '';
    const salutation = (student.gender === 'Female') ? 'Miss.' : (student.gender === 'Male' ? 'Mr.' : 'miss/mr.');
    
    const weaknesses: string[] = [];
    const actionPoints: string[] = [];

    // 1. Backlogs
    if (student.academic.activeBacklogs > 0) {
      weaknesses.push(`[Risk Factor] **Active Backlogs (${student.academic.activeBacklogs} Standing Arrears):** Uncleared subjects drag down your Academic Pillar and will block eligibility for Tier-1 campus placement drives.`);
      actionPoints.push(`[Action Plan] **Dedicated Backlog Remedial Sprint:** Allocate a non-negotiable **90-minute daily revision block** exclusively to clearing these arrear subjects. Attend the Saturday remedial tutorials in the department library block.`);
    }

    // 2. CGPA
    if (student.academic.cgpa < 7.5) {
      weaknesses.push(`[Risk Factor] **CGPA Deficit (${student.academic.cgpa} / 10.0):** Your cumulative GPA is currently below the 7.50 benchmark required for top tech placements (Amazon, Microsoft, Cisco).`);
      actionPoints.push(`[Action Plan] **Target 42+/50 in Continuous Internal Evaluations (CIE):** Focus on past 5 years of university exam question papers to guarantee high internal marks and elevate your overall CGPA above 7.5.`);
    }

    // 3. Attendance
    if (student.attendance.overallPercentage < 75) {
      weaknesses.push(`[Critical Alert] **Attendance Deficit (${student.attendance.overallPercentage}%):** You are breaching the mandatory university 75% attendance threshold and at risk of examination debarment and hall ticket withholding.`);
      actionPoints.push(`[Action Plan] **Mandatory Class Attendance Recovery:** You must attend the next **15 consecutive lectures without absence** to recover above 75%. If your absences were medical, submit doctor slips to Dean Dr. Sharma within 3 days for condonation approval.`);
    } else if (student.attendance.overallPercentage < 80) {
      weaknesses.push(`[Warning] **Borderline Classroom Attendance (${student.attendance.overallPercentage}%):** Hovering just barely above the 75% cutoff with zero buffer for contingencies.`);
      actionPoints.push(`[Action Plan] **Stabilize Class Attendance:** Maintain at least 85% attendance across all subjects over the next 3 weeks to create a safe cushion before semester end exams.`);
    }

    // 4. LMS & Digital Learning Engagement
    if (student.lms.assignmentCompletionRate < 80 || student.lms.weeklyLogins < 5) {
      weaknesses.push(`[Risk Factor] **LMS & Lab Assignment Deficit (${student.lms.assignmentCompletionRate}% completion, ${student.lms.weeklyLogins} logins/week):** Late lab reports and irregular LMS portal activity are lowering your Continuous Assessment score.`);
      actionPoints.push(`[Action Plan] **Clear Overdue LMS Submissions:** Complete and upload all pending assignments before Friday midnight. Log in at least 5 times a week to review uploaded lecture slides.`);
    }

    // 5. Placement & Algorithmic Coding
    if (student.placement.codingScore < 70) {
      weaknesses.push(`[Risk Factor] **Algorithmic Coding Gap (${student.placement.codingScore}/100):** Falls short of the 70-point benchmark needed to pass initial technical screening tests for software engineering roles.`);
      actionPoints.push(`[Action Plan] **Daily Coding Sprint:** Practice 2 Data Structures problems daily (Focus on Arrays, HashMaps, Binary Trees, and Two Pointers) to raise your coding score past 75.`);
    }

    // 6. Mock Interviews & Communication
    if (student.placement.mockInterviewRating < 70) {
      weaknesses.push(`[Risk Factor] **Mock Interview Performance (${student.placement.mockInterviewRating}/100):** Communication clarity, system breakdown, and behavioral answers need improvement.`);
      actionPoints.push(`[Action Plan] **Alumni Mock Interview Preparation:** Practice the STAR method (Situation, Task, Action, Result) for behavioral questions and practice dry-running algorithms on paper.`);
    }

    // Negative XAI Drivers
    const negDrivers = student.xaiDrivers ? student.xaiDrivers.filter((d: any) => d.type === 'NEGATIVE') : [];
    negDrivers.forEach((d: any) => {
      if (!weaknesses.some((w) => w.includes(d.feature))) {
        weaknesses.push(`[Risk Factor] **${d.feature} (${d.impact} pts):** ${d.desc}`);
      }
    });

    // Prescriptive Actions
    const presActions = student.actions || (student.actionableInsights as any) || [];
    if (presActions.length > 0) {
      presActions.forEach((a: any) => {
        const title = a.title;
        const impact = a.impact || a.expectedScoreImpact || 5;
        const desc = a.desc || a.description || '';
        if (!actionPoints.some((ap) => ap.includes(title))) {
          actionPoints.push(`[Action Plan] **${title} (+${impact} pts):** ${desc}`);
        }
      });
    }

    // Top Performer fallback
    if (weaknesses.length === 0) {
      weaknesses.push(`[Excellence] **Outstanding Academic Foundation:** You have strong performance across all 7 pillars (CGPA: ${student.academic.cgpa}, Attendance: ${student.attendance.overallPercentage}%, Coding: ${student.placement.codingScore}/100, Success Score: ${student.successScore.overall}/100).`);
      actionPoints.push(`[Advanced Action] **Prepare for Super Dream Tech Roles (24+ LPA):** Build advanced distributed systems, contribute to open source repositories, and mentor peers in university coding clubs.`);
    }

    // Physical / Sports balance
    if (student.sports) {
      actionPoints.push(`[Athletic Health] **Maintain Sports & Physical Conditioning:** Continue your **${student.sports.weeklyHours}h/week** in **${student.sports.primarySport}** to reduce mental burnout and sustain stamina for 4-hour placement marathons.`);
    }

    let reply = `### Academic Diagnostic & Self-Improvement Plan for ${salutation} ${student.name}\n\n`;
    reply += `I have evaluated your live records across all 7 institutional pillars (Success Score: **${student.successScore.overall}/100**, Risk Level: **${student.risk.academicRisk} Academic / ${student.risk.placementRisk} Placement**). Here is exactly where you are lacking and the specific points you should execute to improve:\n\n`;
    
    reply += `#### Priority Gaps Identified in Academic Audit:\n`;
    weaknesses.forEach((w, idx) => {
      reply += `${idx + 1}. ${w}\n`;
    });

    reply += `\n---\n\n#### Prescribed Action Plan for Student Advancement:\n`;
    actionPoints.forEach((a, idx) => {
      reply += `${idx + 1}. ${a}\n`;
    });

    return reply;
  };

  const isUniversityQuery = (query: string): boolean => {
    const q = query.toLowerCase();
    const universityKeywords = [
      'univ', 'college', 'campus', 'institution', 'rvce', 'semester', 'sem', 'dept', 'department',
      'academic', 'academics', 'faculty', 'professor', 'prof', 'dean', 'hod', 'mentor', 'teacher',
      'instructor', 'syllabus', 'course', 'curriculum', 'lecture', 'class', 'classroom', 'credit',
      'cgpa', 'sgpa', 'gpa', 'grade', 'marks', 'score', 'pointer', 'result', 'percentage', 'rank',
      'evaluat', 'feedback', 'satisfaction',
      'lack', 'lacking', 'weak', 'weakness', 'weaknesses', 'improve', 'improving', 'improvement',
      'lag', 'lagging', 'behind', 'struggle', 'struggling', 'point', 'points', 'action', 'actions',
      'flaw', 'shortcoming', 'performance', 'better', 'help', 'studies', 'study',
      'exam', 'examination', 'cie', 'see', 'internal',
      'midterm', 'mid term', 'endsem', 'end sem', 'test', 'quiz', 'hall ticket', 'admit card',
      'question paper', 'reval', 'revaluation', 'viva', 'practical', 'attendance', 'condonation',
      'condon', 'medical', 'debar', 'rule', 'rules', 'regulation', 'policy', 'leave', 'permission',
      'gate pass', 'fee', 'fees', 'scholarship', 'due', 'dues', 'backlog', 'backlogs', 'arrear',
      'arrears', 'fail', 'failed', 'supplementary', 'remedial', 'clearance', 'placement', 'placements',
      'interview', 'interviews', 'job', 'offer', 'package', 'ctc', 'lpa', 'company', 'companies',
      'recruitment', 'recruiter', 'hire', 'hiring', 'aptitude', 'resume', 'intern', 'internship',
      'dsa', 'data structure', 'algorithm', 'coding', 'code', 'leetcode', 'hackerrank', 'python',
      'java', 'c++', 'sql', 'database', 'dbms', 'operating system', 'os', 'deadlock', 'process',
      'thread', 'memory', 'network', 'networks', 'tcp', 'udp', 'ip', 'software', 'sdlc', 'oop',
      'web', 'cloud', 'ai', 'ml', 'machine learning', 'math', 'maths', 'lab', 'laboratory',
      'assignment', 'homework', 'project', 'submission', 'library', 'hostel', 'canteen', 'mess',
      'cafeteria', 'auditorium', 'club', 'clubs', 'hackathon', 'fest', 'event', 'events', 'sports',
      'sport', 'cricket', 'football', 'badminton', 'athletics', 'gym', 'fitness', 'study', 'studying',
      'prepare', 'preparation', 'revision', 'revising', 'schedule', 'timetable', 'time table',
      'routine', 'tips', 'advice', 'success score', 'risk'
    ];
    return universityKeywords.some((kw) => q.includes(kw));
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    const userMsg: Message = { sender: 'user', text: query };
    setInputValue('');

    const q = query.toLowerCase();
    let reply = '';

    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what can you do'];
    const isGreeting = greetings.some((g) => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!'));

    const salutation = (currentStudent.gender === 'Female') ? 'Miss.' : (currentStudent.gender === 'Male' ? 'Mr.' : 'miss/mr.');

    if (isGreeting) {
      reply = `Hello **${currentStudent.name}**! I am **Aditi**, your **University AI Academic Advisor**.\n\n**Notice:** Sorry ${salutation} ${currentStudent.name}, I am not obligated to answer any question which does not concern the university or ur studies.\n\nYou can consult me on:\n• **University Rules:** 75% attendance policy, medical condonations, CIE/SEE exams\n• **Academic & Subject Doubts:** DSA, OS, DBMS, arrears & study plans\n• **Campus Placements:** Tier-1 eligibility criteria, coding benchmarks\n• **Campus Facilities & Timetable:** Library timings, lab hours & study schedules\n\nWhat university or academic question can I help you resolve?`;
    } else if (!isUniversityQuery(query)) {
      reply = `Sorry ${salutation} ${currentStudent.name}, I am not obligated to answer any question which does not concern the university or ur studies.`;
    } else {
      const isImprovementQuery = 
        q.includes('lack') || q.includes('lacking') ||
        q.includes('weak') || q.includes('weakness') || q.includes('weaknesses') ||
        q.includes('improve') || q.includes('improvement') || q.includes('improving') ||
        q.includes('lag') || q.includes('lagging') ||
        q.includes('behind') || q.includes('struggle') || q.includes('struggling') ||
        q.includes('shortcoming') || q.includes('flaw') ||
        q.includes('what should i do') || q.includes('what to do') ||
        q.includes('action plan') || q.includes('action point') || q.includes('action item') ||
        (q.includes('point') && (q.includes('improve') || q.includes('study') || q.includes('studies'))) ||
        (q.includes('where') && (q.includes('study') || q.includes('studies') || q.includes('student') || q.includes('i ')));

      if (isImprovementQuery) {
        reply = generateStudentImprovementAnalysis(currentStudent);
      } else if (q.includes('attendance') || q.includes('medical') || q.includes('debar') || q.includes('condonation')) {
        reply = `Regarding **University Attendance Policies**:\n• You must maintain at least **75% physical attendance**.\n• Your current attendance is **${currentStudent.attendance.overallPercentage}%**.\n• For medical absences, submit registered doctor slips to Dean Dr. Sharma within 3 days for condonation approval.`;
      } else if (q.includes('backlog') || q.includes('arrear') || q.includes('fail') || q.includes('supplementary')) {
        reply = `Regarding **Backlogs & Arrears**:\n• Active backlogs: **${currentStudent.academic.activeBacklogs}**.\n• Supplementary exams occur immediately after semester results.\n• Fast-track remedial study sessions are held in the department seminar hall on Saturdays.`;
      } else if (q.includes('cgpa') || q.includes('grade') || q.includes('marks')) {
        reply = `Your current CGPA is **${currentStudent.academic.cgpa} / 10.0**.\n• Maintaining $\\ge 7.5$ CGPA is required to be eligible for all visiting Tier-1 tech placement drives.`;
      } else if (q.includes('placement') || q.includes('interview') || q.includes('company') || q.includes('package')) {
        reply = `For **Campus Placements**:\n• Coding benchmark: **${currentStudent.placement.codingScore}/100**\n• Mock Interview score: **${currentStudent.placement.mockInterviewRating}/100**\n• To unlock Tier-1 company shortlists (18+ LPA), solve at least 200 LeetCode problems and practice behavioral STAR interview techniques.`;
      } else if (q.includes('sport') || q.includes('cricket') || q.includes('football') || q.includes('badminton') || q.includes('gym')) {
        reply = `Balancing sports with academics:\n• Incorporate 60–75 minutes of sports daily.\n• Sports increases cerebral blood flow, boosting problem-solving performance during 4-hour coding tests!\n• Participation in university tournaments earns bonus credits toward your **Campus Life Pillar**!`;
      } else {
        reply = `Regarding your university query, **${currentStudent.name}**:\n• As your university mentor, I recommend reviewing the latest department circular on the college LMS portal and consulting with your designated faculty advisor.\n• Feel free to ask more specific questions about course doubts, university policies, or placements!`;
      }
    }

    setMessages((prev) => [...prev, userMsg, { sender: 'bot', text: reply }]);
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-xl shadow-2xl shadow-rose-500/40 border border-white/80 transition-all transform hover:scale-102 group"
          >
            <div className="relative flex items-center justify-center">
              <img
                src="/aditi-avatar.jpg"
                alt="Aditi AI Mentor"
                className="w-10 h-10 rounded-xl object-cover border-2 border-white/90 shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black leading-tight flex items-center gap-1.5">
                <span>Aditi • Campus Pulse AI</span>
                <span className="text-[9px] bg-white/20 text-white border border-white/40 px-1.5 py-0.2 rounded-md font-bold">Online</span>
              </div>
              <div className="text-[10px] text-pink-100">Study Doubts • University Rules • Timetable</div>
            </div>
            <span className="bg-white/20 px-2.5 py-1 rounded-md text-[10px] font-black border border-white/40 text-white">
              Ask Aditi
            </span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md sm:max-w-xl glass-panel bg-white/95 border border-rose-300 rounded-3xl shadow-2xl shadow-rose-950/20 flex flex-col h-[600px] overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-red-700 via-rose-600 to-pink-600 text-white border-b border-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/aditi-avatar.jpg"
                  alt="Aditi AI Mentor"
                  className="w-11 h-11 rounded-xl object-cover border-2 border-white/90 shadow-lg"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-black text-white text-sm flex items-center gap-2">
                  Aditi: Campus Pulse AI Academic Advisor
                  <span className="text-[10px] bg-white/20 text-white border border-white/40 px-2 py-0.2 rounded-md font-bold">
                    Active
                  </span>
                </h3>
                <p className="text-[11px] text-rose-100">
                  Academic, Placement &amp; Athletic Copilot for <strong className="text-white">{currentStudent.name}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-rose-100 hover:text-white rounded-xl hover:bg-white/10 transition text-sm font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <img
                    src="/aditi-avatar.jpg"
                    alt="Aditi"
                    className="w-7 h-7 rounded-lg object-cover border border-rose-300 flex-shrink-0 shadow-xs"
                  />
                )}
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 text-white rounded-br-none shadow-md'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Action Chips */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex flex-wrap gap-1.5 text-[11px]">
            <button
              onClick={() => handleSendPreset('weakness')}
              className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 rounded-lg font-bold transition flex items-center gap-1 shadow-2xs"
            >
              <Target className="w-3 h-3 text-rose-600" />
              <span>Where am I lacking &amp; how to improve?</span>
            </button>
            <button
              onClick={() => handleSendPreset('rules')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-semibold transition flex items-center gap-1"
            >
              <School className="w-3 h-3 text-slate-600" />
              <span>University 75% Attendance &amp; Exam Rules</span>
            </button>
            <button
              onClick={() => handleSendPreset('study')}
              className="px-2.5 py-1 bg-pink-100 hover:bg-pink-200 text-pink-800 border border-pink-300 rounded-lg font-semibold transition flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-pink-600" />
              <span>Subject Study &amp; Backlog Clearance Tips</span>
            </button>
            <button
              onClick={() => handleSendPreset('timetable')}
              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold transition flex items-center gap-1"
            >
              <Calendar className="w-3 h-3 text-rose-600" />
              <span>Balanced Study &amp; Sports Timetable</span>
            </button>
            <button
              onClick={() => handleSendPreset('placement')}
              className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 rounded-lg font-semibold transition flex items-center gap-1"
            >
              <Briefcase className="w-3 h-3 text-emerald-600" />
              <span>Placement Cutoffs &amp; Tier-1 Eligibility</span>
            </button>
          </div>

          {/* Free-form Input */}
          <form onSubmit={handleCustomSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about subject doubts, college rules, study plans, or sports..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-xl font-bold text-xs transition shadow-md flex items-center gap-1"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
