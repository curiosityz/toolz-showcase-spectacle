import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AuthGuard } from "@/components/AuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LandingPageAnalyzer from "./pages/LandingPageAnalyzer";
import AutonomousResearch from "./pages/AutonomousResearch";
import ExperimentLab from "./pages/ExperimentLab";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <main className="flex-1">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Index />} />
        <Route
          path="/landing-page-analyzer"
          element={
            <AuthGuard>
              <LandingPageAnalyzer />
            </AuthGuard>
          }
        />
        <Route
          path="/autonomous-research"
          element={
            <AuthGuard>
              <AutonomousResearch />
            </AuthGuard>
          }
        />
        <Route
          path="/experiment-lab"
          element={
            <AuthGuard>
              <ExperimentLab />
            </AuthGuard>
          }
        />
      </Routes>
    </main>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Helmet>
            <meta name="robots" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
          </Helmet>
          
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;