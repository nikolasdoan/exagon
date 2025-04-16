import { useState } from "react";
import { useProjects, useFiles, createFile, useFolders, createFolder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function FilesApi() {
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState("model");
  const [newFileContent, setNewFileContent] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  // Fetch projects
  const { data: projects, isLoading: isLoadingProjects } = useProjects();

  // Fetch folders and files when a project is selected
  const { data: folders } = useFolders(selectedProjectId || 0);
  const { data: files } = useFiles(
    selectedProjectId || 0,
    selectedFolderId || undefined
  );

  // Create a new file
  const handleCreateFile = async () => {
    if (!selectedProjectId) {
      toast({
        title: "Error",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    if (!newFileName || !newFileType) {
      toast({
        title: "Error",
        description: "File name and type are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createFile(selectedProjectId, {
        name: newFileName,
        type: newFileType as any,
        content: newFileContent,
        size: newFileContent.length,
        folderId: selectedFolderId || null
      });

      toast({
        title: "Success",
        description: "File created successfully",
      });

      setNewFileName("");
      setNewFileContent("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create file",
        variant: "destructive",
      });
    }
  };

  // Create a new folder
  const handleCreateFolder = async () => {
    if (!selectedProjectId) {
      toast({
        title: "Error",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    if (!newFolderName) {
      toast({
        title: "Error",
        description: "Folder name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createFolder(selectedProjectId, {
        name: newFolderName,
        parentId: selectedFolderId || null
      });

      toast({
        title: "Success",
        description: "Folder created successfully",
      });

      setNewFolderName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder",
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
        <CardTitle>File Management API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Project</Label>
          <Select
            value={selectedProjectId?.toString() || ""}
            onValueChange={(value) => {
              setSelectedProjectId(Number(value));
              setSelectedFolderId(null);
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="font-medium border-b pb-2">Create Folder</div>
                <div className="space-y-2">
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parent Folder</Label>
                  <Select
                    value={selectedFolderId?.toString() || ""}
                    onValueChange={(value) => setSelectedFolderId(value ? Number(value) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Root (No parent)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Root (No parent)</SelectItem>
                      {folders?.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateFolder} className="w-full">
                  Create Folder
                </Button>
              </div>

              <div className="space-y-4">
                <div className="font-medium border-b pb-2">Create File</div>
                <div className="space-y-2">
                  <Label htmlFor="fileName">File Name</Label>
                  <Input
                    id="fileName"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="Enter file name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fileType">File Type</Label>
                  <Select
                    value={newFileType}
                    onValueChange={(value) => setNewFileType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select file type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="model">3D Model</SelectItem>
                      <SelectItem value="texture">Texture</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="animation">Animation</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fileContent">File Content (placeholder)</Label>
                  <Input
                    id="fileContent"
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                    placeholder="Enter file content"
                  />
                </div>
                <Button onClick={handleCreateFile} className="w-full">
                  Create File
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <div className="font-medium border-b pb-2">
                Files & Folders
              </div>
              
              <div className="my-2 flex items-center text-sm">
                <button 
                  onClick={() => setSelectedFolderId(null)}
                  className="text-blue-500 hover:underline"
                >
                  Root
                </button>
                {selectedFolderId && folders?.find(f => f.id === selectedFolderId) && (
                  <>
                    <span className="mx-2">/</span>
                    <span>{folders.find(f => f.id === selectedFolderId)?.name}</span>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {folders
                  ?.filter(folder => 
                    selectedFolderId 
                      ? folder.parentId === selectedFolderId 
                      : folder.parentId === null
                  )
                  .map((folder) => (
                    <div
                      key={folder.id}
                      className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedFolderId(folder.id)}
                    >
                      <div className="flex items-center">
                        <span className="material-icons text-yellow-500 mr-2">folder</span>
                        <div>
                          <div className="font-medium">{folder.name}</div>
                          <div className="text-xs text-gray-500">Folder</div>
                        </div>
                      </div>
                    </div>
                  ))}

                {files?.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 border rounded hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <span className="material-icons text-blue-500 mr-2">
                        {file.type === 'model' ? 'view_in_ar' :
                         file.type === 'texture' ? 'image' :
                         file.type === 'animation' ? 'animation' :
                         file.type === 'document' ? 'description' : 'insert_drive_file'}
                      </span>
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {file.type.charAt(0).toUpperCase() + file.type.slice(1)} • {file.size} bytes
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {folders?.filter(folder => 
                  selectedFolderId 
                    ? folder.parentId === selectedFolderId 
                    : folder.parentId === null
                ).length === 0 && files?.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    This folder is empty
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-sm text-gray-500">
          Files and folders are stored in PostgreSQL database
        </div>
      </CardFooter>
    </Card>
  );
}