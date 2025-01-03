import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LandingPageAnalyzer from "./pages/LandingPageAnalyzer";
import AutonomousResearch from "./pages/AutonomousResearch";
import ExperimentLab from "./pages/ExperimentLab";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landing-page-analyzer" element={<LandingPageAnalyzer />} />
          <Route path="/autonomous-research" element={<AutonomousResearch />} />
          <Route path="/experiment-lab" element={<ExperimentLab />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;