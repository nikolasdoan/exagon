import { Card } from "@/components/ui/card";
import GanttChart from "@/components/ui/gantt-chart";

interface ProjectDashboardProps {
  visibleUI: {
    projectSetup: boolean;
    teamSetup: boolean;
    toolsComparison: boolean;
    fileManagement: boolean;
    versionControl: boolean;
    progressGraphs: boolean;
    importExport: boolean;
  };
  activeTab?: 'project' | 'team' | 'tools' | 'files' | 'versions' | 'graphs' | 'importExport' | '3dView';
}

const ProjectDashboard = ({ visibleUI, activeTab = 'project' }: ProjectDashboardProps) => {
  const { 
    projectSetup, 
    teamSetup, 
    toolsComparison, 
    fileManagement, 
    versionControl, 
    progressGraphs, 
    importExport 
  } = visibleUI;
  
  // Determine what to show based on the active tab
  const showProjectSetup = activeTab === 'project' && projectSetup;
  const showTeamSetup = activeTab === 'team' && teamSetup;
  const showToolsComparison = activeTab === 'tools' && toolsComparison;
  const showFileManagement = activeTab === 'files' && fileManagement;
  const showVersionControl = activeTab === 'versions' && versionControl;
  const showProgressGraphs = activeTab === 'graphs' && progressGraphs;
  const showImportExport = activeTab === 'importExport' && importExport;
  
  const showEmptyState = !showProjectSetup && !showTeamSetup && !showToolsComparison && 
    !showFileManagement && !showVersionControl && !showProgressGraphs && !showImportExport;

  // Get the title for the panel based on active tab
  const getPanelTitle = () => {
    switch(activeTab) {
      case 'project': return 'Project Dashboard';
      case 'team': return 'Team Management';
      case 'tools': return 'Tools Comparison';
      case 'files': return 'File Management';
      case 'versions': return 'Version Control';
      case 'graphs': return 'Project Analytics';
      case 'importExport': return 'Import & Export';
      default: return 'Project Dashboard';
    }
  };

  return (
    <div className="h-full bg-white overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="material-icons text-primary mr-2">dashboard</span>
            <h2 className="font-medium text-gray-800">{getPanelTitle()}</h2>
          </div>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live Preview</span>
        </div>
      </div>
      
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Empty State */}
        {showEmptyState && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <span className="material-icons text-4xl mb-4">explore</span>
            <p>Project details will appear here as you chat</p>
            <p className="text-sm mt-2">Try discussing project timeline, team members, or tools</p>
          </div>
        )}
        
        {/* Project Setup Card */}
        {showProjectSetup && (
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
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
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
        
        {/* File Management Card */}
        {fileManagement && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">File Management</h3>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">5 Files</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                <span className="material-icons text-blue-500 mr-3">description</span>
                <div>
                  <p className="text-sm font-medium">Robot_Base_v2.blend</p>
                  <p className="text-xs text-gray-500">Modified 2 days ago • 15.4 MB</p>
                </div>
                <div className="ml-auto flex space-x-2">
                  <span className="material-icons text-gray-500 cursor-pointer hover:text-primary text-sm">download</span>
                  <span className="material-icons text-gray-500 cursor-pointer hover:text-primary text-sm">share</span>
                  <span className="material-icons text-gray-500 cursor-pointer hover:text-primary text-sm">more_vert</span>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                <span className="material-icons text-green-500 mr-3">image</span>
                <div>
                  <p className="text-sm font-medium">Robot_Texture_Map.png</p>
                  <p className="text-xs text-gray-500">Modified 3 days ago • 8.2 MB</p>
                </div>
                <div className="ml-auto flex space-x-2">
                  <span className="material-icons text-gray-500 cursor-pointer hover:text-primary text-sm">download</span>
                  <span className="material-icons text-gray-500 cursor-pointer hover:text-primary text-sm">share</span>
                  <span className="material-icons text-gray-500 cursor-pointer hover:text-primary text-sm">more_vert</span>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                <span className="material-icons text-purple-500 mr-3">description</span>
                <div>
                  <p className="text-sm font-medium">Robot_Animation_Rig.fbx</p>
                  <p className="text-xs text-gray-500">Modified 5 days ago • 2.1 MB</p>
                </div>
                <div className="ml-auto flex space-x-2">
                  <span className="material-icons text-gray-500 cursor-pointer hover:text-primary text-sm">download</span>
                  <span className="material-icons text-gray-500 cursor-pointer hover:text-primary text-sm">share</span>
                  <span className="material-icons text-gray-500 cursor-pointer hover:text-primary text-sm">more_vert</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button className="flex items-center text-xs text-primary bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">
                <span className="material-icons text-xs mr-1">add</span> Upload File
              </button>
              <button className="flex items-center text-xs text-primary bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">
                <span className="material-icons text-xs mr-1">folder</span> New Folder
              </button>
            </div>
          </div>
        )}
        
        {/* Version Control Card */}
        {versionControl && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Version Control</h3>
            
            <div className="space-y-4">
              <div className="flex items-start border-l-2 border-blue-500 pl-3 py-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium shrink-0">JD</div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">John Doe</p>
                    <span className="text-xs text-gray-500 ml-2">2 days ago</span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1">Added new arm joint mechanics</p>
                  <p className="text-xs text-gray-500 mt-0.5">Version 2.3.0</p>
                  <div className="flex mt-2 space-x-2">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Robot_Base_v2.blend</span>
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">+325 lines</span>
                  </div>
                </div>
                <div className="ml-auto flex space-x-1">
                  <button className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Revert</button>
                  <button className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">View</button>
                </div>
              </div>
              
              <div className="flex items-start border-l-2 border-purple-500 pl-3 py-1">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium shrink-0">AS</div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">Alice Smith</p>
                    <span className="text-xs text-gray-500 ml-2">3 days ago</span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1">Updated metallic texture maps</p>
                  <p className="text-xs text-gray-500 mt-0.5">Version 2.2.0</p>
                  <div className="flex mt-2 space-x-2">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Robot_Texture_Map.png</span>
                  </div>
                </div>
                <div className="ml-auto flex space-x-1">
                  <button className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Revert</button>
                  <button className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">View</button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="flex items-center text-xs text-primary bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">
                <span className="material-icons text-xs mr-1">history</span> Full History
              </button>
              <button className="flex items-center text-xs text-primary bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">
                <span className="material-icons text-xs mr-1">compare_arrows</span> Compare Versions
              </button>
            </div>
          </div>
        )}
        
        {/* Progress Graphs Card */}
        {progressGraphs && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Project Analytics</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Completion Progress</h4>
              <div className="h-7 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center pl-2" style={{width: '65%'}}>
                  <span className="text-xs font-medium text-white">65% complete</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Started: April 2, 2023</span>
                <span>Deadline: June 30, 2023</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Resource Allocation</h4>
              <div className="flex h-16 rounded-md overflow-hidden">
                <div className="bg-blue-500 h-full w-2/5 flex items-center justify-center">
                  <span className="text-xs text-white">Modeling<br />40%</span>
                </div>
                <div className="bg-purple-500 h-full w-1/4 flex items-center justify-center">
                  <span className="text-xs text-white">Texturing<br />25%</span>
                </div>
                <div className="bg-indigo-500 h-full w-1/5 flex items-center justify-center">
                  <span className="text-xs text-white">Rigging<br />20%</span>
                </div>
                <div className="bg-green-500 h-full w-3/20 flex items-center justify-center">
                  <span className="text-xs text-white">Testing<br />15%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Team Activity</h4>
              <div className="h-24 flex items-end space-x-1">
                {[40, 65, 35, 50, 90, 75, 45].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-400 hover:bg-blue-500 transition-colors rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-[10px] text-gray-500 mt-1">{`W${i+1}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Import/Export Card */}
        {importExport && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Import & Export Options</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Import File</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <span className="material-icons text-gray-400 text-3xl">cloud_upload</span>
                <p className="text-sm text-gray-500 mt-2">Drag files here or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">Supports .FBX, .OBJ, .BLEND, .STL, and more</p>
                <button className="mt-3 text-xs bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600">
                  Select Files
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Export Options</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-md p-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-500 mr-2">description</span>
                    <span className="text-sm font-medium">.FBX</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Universal 3D exchange format</p>
                </div>
                
                <div className="border border-gray-200 rounded-md p-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-500 mr-2">description</span>
                    <span className="text-sm font-medium">.OBJ</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Simple geometry export</p>
                </div>
                
                <div className="border border-gray-200 rounded-md p-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-500 mr-2">description</span>
                    <span className="text-sm font-medium">.STL</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For 3D printing</p>
                </div>
                
                <div className="border border-gray-200 rounded-md p-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-500 mr-2">description</span>
                    <span className="text-sm font-medium">.GLTF</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For web & real-time apps</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="flex items-center text-xs text-white bg-primary px-3 py-1.5 rounded hover:bg-blue-600">
                  <span className="material-icons text-xs mr-1">download</span> Export Project
                </button>
                <button className="flex items-center text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200">
                  <span className="material-icons text-xs mr-1">settings</span> Advanced Options
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;
