import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen gradient-hero">
      <Navigation />
      <main className="pt-20 pb-12">
        {children}
      </main>
    </div>
  );
}
