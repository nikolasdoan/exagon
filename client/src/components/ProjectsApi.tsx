import { useState } from "react";
import { useProjects, createProject, useProjectMembers, addProjectMember, useMilestones, createMilestone } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface DatePickerProps {
  date?: Date;
  setDate: (date?: Date) => void;
}

function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
import { useToast } from "@/hooks/use-toast";

export function ProjectsApi() {
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDeadline, setNewMilestoneDeadline] = useState<Date | undefined>(undefined);

  // Fetch projects
  const { data: projects, isLoading: isLoadingProjects, error: projectsError } = useProjects();

  // Conditionally fetch project members and milestones when a project is selected
  const { data: projectMembers } = useProjectMembers(selectedProjectId || 0);
  const { data: milestones } = useMilestones(selectedProjectId || 0);

  // Create a new project
  const handleCreateProject = async () => {
    if (!newProjectName) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createProject({
        name: newProjectName,
        description: newProjectDescription,
        status: "active",
        startDate: new Date(),
        endDate: null
      });

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      setNewProjectName("");
      setNewProjectDescription("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };

  // Add a team member to a project
  const handleAddTeamMember = async () => {
    if (!selectedProjectId) {
      toast({
        title: "Error",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    if (!newMemberName || !newMemberRole) {
      toast({
        title: "Error",
        description: "Member name and role are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // First create a user (in real app, you'd search for existing users)
      const user = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newMemberName.toLowerCase().replace(/\\s/g, ""),
          email: `${newMemberName.toLowerCase().replace(/\\s/g, "")}@example.com`,
          name: newMemberName,
        }),
      }).then(res => res.json());

      // Then add the user to the project
      await addProjectMember(selectedProjectId, user.id, newMemberRole);

      toast({
        title: "Success",
        description: "Team member added successfully",
      });

      setNewMemberName("");
      setNewMemberRole("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
    }
  };

  // Create a new milestone
  const handleCreateMilestone = async () => {
    if (!selectedProjectId) {
      toast({
        title: "Error",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    if (!newMilestoneName || !newMilestoneDeadline) {
      toast({
        title: "Error",
        description: "Milestone name and deadline are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMilestone(selectedProjectId, {
        name: newMilestoneName,
        dueDate: newMilestoneDeadline,
        description: "Created via API demo",
        completed: false
      });

      toast({
        title: "Success",
        description: "Milestone created successfully",
      });

      setNewMilestoneName("");
      setNewMilestoneDeadline(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create milestone",
        variant: "destructive",
      });
    }
  };

  if (isLoadingProjects) {
    return <div className="p-4">Loading projects...</div>;
  }

  if (projectsError) {
    return <div className="p-4 text-red-500">Error loading projects</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Management API</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="projects">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="teamMembers">Team Members</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input 
                id="projectName" 
                value={newProjectName} 
                onChange={(e) => setNewProjectName(e.target.value)} 
                placeholder="Enter project name" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Description</Label>
              <Input 
                id="projectDescription" 
                value={newProjectDescription} 
                onChange={(e) => setNewProjectDescription(e.target.value)} 
                placeholder="Enter project description" 
              />
            </div>
            
            <Button onClick={handleCreateProject} className="w-full">Create Project</Button>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Projects ({projects?.length || 0})</h3>
              <div className="space-y-2">
                {projects?.map((project) => (
                  <div 
                    key={project.id} 
                    className={`p-3 border rounded cursor-pointer ${selectedProjectId === project.id ? 'bg-blue-50 border-blue-500' : ''}`}
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-gray-600">{project.description}</div>
                    <div className="text-xs mt-1 text-gray-500">Status: {project.status}</div>
                  </div>
                ))}
                
                {projects?.length === 0 && (
                  <div className="text-center py-4 text-gray-500">No projects yet</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teamMembers" className="space-y-4 mt-4">
            {!selectedProjectId ? (
              <div className="text-center py-4 text-gray-500">Please select a project first</div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="memberName">Member Name</Label>
                  <Input 
                    id="memberName" 
                    value={newMemberName} 
                    onChange={(e) => setNewMemberName(e.target.value)} 
                    placeholder="Enter member name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="memberRole">Role</Label>
                  <Input 
                    id="memberRole" 
                    value={newMemberRole} 
                    onChange={(e) => setNewMemberRole(e.target.value)} 
                    placeholder="Enter member role" 
                  />
                </div>
                
                <Button onClick={handleAddTeamMember} className="w-full">Add Team Member</Button>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Team Members ({projectMembers?.length || 0})</h3>
                  <div className="space-y-2">
                    {projectMembers?.map((member) => (
                      <div 
                        key={member.id} 
                        className="p-3 border rounded"
                      >
                        <div className="font-medium">{member.user.name}</div>
                        <div className="text-sm text-gray-600">{member.role}</div>
                        <div className="text-xs mt-1 text-gray-500">{member.user.email}</div>
                      </div>
                    ))}
                    
                    {projectMembers?.length === 0 && (
                      <div className="text-center py-4 text-gray-500">No team members yet</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4 mt-4">
            {!selectedProjectId ? (
              <div className="text-center py-4 text-gray-500">Please select a project first</div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="milestoneName">Milestone Name</Label>
                  <Input 
                    id="milestoneName" 
                    value={newMilestoneName} 
                    onChange={(e) => setNewMilestoneName(e.target.value)} 
                    placeholder="Enter milestone name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <DatePicker
                    date={newMilestoneDeadline}
                    setDate={setNewMilestoneDeadline}
                  />
                </div>
                
                <Button onClick={handleCreateMilestone} className="w-full">Create Milestone</Button>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Milestones ({milestones?.length || 0})</h3>
                  <div className="space-y-2">
                    {milestones?.map((milestone) => (
                      <div 
                        key={milestone.id} 
                        className="p-3 border rounded"
                      >
                        <div className="font-medium">{milestone.name}</div>
                        <div className="text-sm text-gray-600">
                          Deadline: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'Not set'}
                        </div>
                        <div className="text-xs mt-1 text-gray-500">
                          Status: {milestone.completed ? 'Completed' : 'In progress'}
                        </div>
                      </div>
                    ))}
                    
                    {milestones?.length === 0 && (
                      <div className="text-center py-4 text-gray-500">No milestones yet</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          Data is stored in PostgreSQL database
        </div>
      </CardFooter>
    </Card>
  );
}