import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { DemoSwitcher } from '@/components/DemoSwitcher';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'CAMPUS PULSE AI | pulse.rvce.edu.in | Institutional Intelligence Platform',
  description: 'AI-Powered Decision Intelligence for University Faculty, Administrators, and Students',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-200 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-rose-500 selection:text-white">
        <AppProvider>
          {/* Top Hackathon Live Demo Controller Bar */}
          <DemoSwitcher />

          {/* Institutional Navigation Header */}
          <Navbar />

          {/* Main App Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>

          {/* Institutional Enterprise Footer */}
          <footer className="border-t border-slate-300 bg-white/90 backdrop-blur-md py-4 text-center text-xs text-slate-600">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-slate-800">pulse.rvce.edu.in</span>
                <span className="text-slate-400">|</span>
                <span>RV College of Engineering Institutional Cloud</span>
                <span className="text-slate-400">|</span>
                <span className="text-emerald-700 font-bold">TLS 1.3 Certified</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-slate-600">
                <a href="/privacy" className="hover:text-rose-600 underline transition">Privacy Policy</a>
                <span>•</span>
                <a href="/terms" className="hover:text-rose-600 underline transition">Terms &amp; Conditions</a>
                <span>•</span>
                <span className="text-slate-500">DPDP Act 2023 / FERPA Compliant</span>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
