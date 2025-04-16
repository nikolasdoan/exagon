import { Card } from "@/components/ui/card";
import GanttChart from "@/components/ui/gantt-chart";

interface ProjectDashboardProps {
  visibleUI: {
    projectSetup: boolean;
    teamSetup: boolean;
    toolsComparison: boolean;
  };
}

const ProjectDashboard = ({ visibleUI }: ProjectDashboardProps) => {
  const { projectSetup, teamSetup, toolsComparison } = visibleUI;
  const showEmptyState = !projectSetup && !teamSetup && !toolsComparison;

  return (
    <div className="lg:w-2/5 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="material-icons text-primary mr-2">dashboard</span>
            <h2 className="font-medium text-gray-800">Project Dashboard</h2>
          </div>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live Preview</span>
        </div>
      </div>
      
      <div className="p-4 space-y-6 h-[530px] overflow-y-auto">
        {/* Empty State */}
        {showEmptyState && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <span className="material-icons text-4xl mb-4">explore</span>
            <p>Project details will appear here as you chat</p>
            <p className="text-sm mt-2">Try discussing project timeline, team members, or tools</p>
          </div>
        )}
        
        {/* Project Setup Card */}
        {projectSetup && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Project: Sci-Fi Robot</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Video Game Asset</span>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Project Timeline</h4>
              <GanttChart />
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Milestones</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="material-icons text-green-500 mr-2 text-sm">check_circle</span>
                  <span className="text-sm">Basic modeling (Week 2)</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-yellow-500 mr-2 text-sm">pending</span>
                  <span className="text-sm">Texture completion (Week 5)</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-gray-300 mr-2 text-sm">circle</span>
                  <span className="text-sm">Animation rigging (Week 7)</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Team Members Card */}
        {teamSetup && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Team Members</h3>
            <div className="space-y-3">
              <div className="flex items-center p-2 bg-gray-50 rounded-md">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">JD</div>
                <div className="ml-3">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">3D Modeler</p>
                </div>
                <div className="ml-auto bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">Lead</div>
              </div>
              
              <div className="flex items-center p-2 bg-gray-50 rounded-md">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">AS</div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Alice Smith</p>
                  <p className="text-xs text-gray-500">Texture Artist</p>
                </div>
                <div className="ml-auto bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">Member</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tools Comparison Card */}
        {toolsComparison && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Tools Comparison</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strengths</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Blender</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">Free</td>
                    <td className="px-3 py-2 text-sm text-gray-500">All-in-one solution</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Maya</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">$1,785/year</td>
                    <td className="px-3 py-2 text-sm text-gray-500">Industry standard</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">ZBrush</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">$895</td>
                    <td className="px-3 py-2 text-sm text-gray-500">Sculpting focused</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;
