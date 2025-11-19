import { ReactNode } from "react";
import Navigation from "./Navigation";
import { SharedFooter } from "./SharedFooter";

interface PageContainerProps {
  children: ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <SharedFooter />
    </div>
  );
};
