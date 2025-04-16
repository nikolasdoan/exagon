import { useState } from "react";
import { useProjects, useFiles, useFileVersions, createFile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function VersionsApi() {
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [newVersion, setNewVersion] = useState("");
  const [newVersionContent, setNewVersionContent] = useState("");
  const [newVersionChangelog, setNewVersionChangelog] = useState("");

  // Fetch projects
  const { data: projects, isLoading: isLoadingProjects } = useProjects();

  // Fetch files when a project is selected
  const { data: files } = useFiles(selectedProjectId || 0);

  // Fetch versions when a file is selected
  const { data: versions } = useFileVersions(selectedFileId || 0);

  // Create a new version
  const handleCreateVersion = async () => {
    if (!selectedFileId) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    if (!newVersion || !newVersionContent) {
      toast({
        title: "Error",
        description: "Version number and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a new file version using API
      await fetch("/api/files/" + selectedFileId + "/versions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: selectedFileId,
          versionNumber: newVersion,
          content: newVersionContent,
          changeDescription: newVersionChangelog,
        }),
      });

      // Also update the file content
      await fetch("/api/files/" + selectedFileId, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newVersionContent,
        }),
      });

      // Create a file activity for the version creation
      await fetch("/api/files/" + selectedFileId + "/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: selectedFileId,
          activityType: "version",
          description: `Created version ${newVersion}: ${newVersionChangelog}`,
        }),
      });

      toast({
        title: "Success",
        description: "New version created successfully",
      });

      setNewVersion("");
      setNewVersionContent("");
      setNewVersionChangelog("");

      // Invalidate queries to refresh data
      await fetch("/api/files/" + selectedFileId + "/versions");
      await fetch("/api/files/" + selectedFileId + "/activities");

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create version",
        variant: "destructive",
      });
    }
  };

  if (isLoadingProjects) {
    return <div className="p-4">Loading projects...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Version Control API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Project</Label>
          <Select
            value={selectedProjectId?.toString() || ""}
            onValueChange={(value) => {
              setSelectedProjectId(Number(value));
              setSelectedFileId(null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProjectId && (
          <div className="space-y-2">
            <Label>Select File</Label>
            <Select
              value={selectedFileId?.toString() || ""}
              onValueChange={(value) => setSelectedFileId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a file" />
              </SelectTrigger>
              <SelectContent>
                {files?.map((file) => (
                  <SelectItem key={file.id} value={file.id.toString()}>
                    {file.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedFileId && (
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-4">
              <div className="font-medium border-b pb-2">Create New Version</div>
              <div className="space-y-2">
                <Label htmlFor="versionNumber">Version Number</Label>
                <Input
                  id="versionNumber"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  placeholder="e.g. 1.0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newVersionContent}
                  onChange={(e) => setNewVersionContent(e.target.value)}
                  placeholder="Enter file content"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="changelog">Change Description</Label>
                <Input
                  id="changelog"
                  value={newVersionChangelog}
                  onChange={(e) => setNewVersionChangelog(e.target.value)}
                  placeholder="What changed in this version?"
                />
              </div>
              <Button onClick={handleCreateVersion} className="w-full">
                Create Version
              </Button>
            </div>
          </div>
        )}

        {selectedFileId && versions && (
          <div className="mt-6">
            <div className="font-medium border-b pb-2">
              Version History ({versions.length})
            </div>
            
            <div className="mt-4 space-y-4">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="p-3 border rounded"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Version {version.versionNumber}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(version.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm mt-1">{version.changeDescription}</div>
                  <div className="mt-2 p-2 bg-gray-50 text-xs rounded font-mono overflow-x-auto">
                    {version.content}
                  </div>
                </div>
              ))}
              
              {versions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No versions yet
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-sm text-gray-500">
          Version history is stored in PostgreSQL database
        </div>
      </CardFooter>
    </Card>
  );
}