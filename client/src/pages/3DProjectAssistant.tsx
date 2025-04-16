import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ProjectDashboard from "@/components/ProjectDashboard";

const ProjectAssistant = () => {
  // State to track which UI elements should be displayed
  const [visibleUI, setVisibleUI] = useState<{
    projectSetup: boolean;
    teamSetup: boolean;
    toolsComparison: boolean;
  }>({
    projectSetup: false,
    teamSetup: false,
    toolsComparison: false
  });

  // Function to update UI based on user input triggers
  const updateUI = (uiType: string | null) => {
    if (uiType === 'projectSetup') {
      setVisibleUI({ ...visibleUI, projectSetup: true });
    } else if (uiType === 'teamSetup') {
      setVisibleUI({ ...visibleUI, projectSetup: true, teamSetup: true });
    } else if (uiType === 'toolsComparison') {
      setVisibleUI({ ...visibleUI, projectSetup: true, toolsComparison: true });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 md:px-8 bg-gray-100">
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center">
          <span className="material-icons text-primary mr-2">view_in_ar</span>
          <h1 className="text-xl font-semibold text-gray-800">3D Project Assistant</h1>
        </div>
        <p className="text-sm text-gray-600 mt-1">Your AI-powered companion for 3D project planning and management</p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <ChatInterface updateUI={updateUI} />
          <ProjectDashboard visibleUI={visibleUI} />
        </div>
      </main>
    </div>
  );
};

export default ProjectAssistant;
