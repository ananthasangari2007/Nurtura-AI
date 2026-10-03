import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { AppHeader } from "./AppHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { PrivacyNoticeBar } from "./PrivacyNoticeBar";
import { ConsentProvider } from "@/lib/privacy/ConsentProvider";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ConsentProvider>
      <div className="min-h-screen bg-[#fffdfc]">
        <div className="mx-auto flex min-h-screen w-full max-w-[1280px]">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <AppHeader />
            <PrivacyNoticeBar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 sm:px-6 lg:pb-12">
              {children}
            </main>
            <footer className="hidden px-6 pb-6 text-xs text-navy-600/70 lg:block">
              Nurtura AI · Assistive care companion · Not a medical device · Demo
              prototype — mock data, no external services required.
            </footer>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    </ConsentProvider>
  );
}
