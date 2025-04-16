import { queryClient } from "@/lib/queryClient";
import { Project, Milestone, Task, User, ProjectMember, Folder, File, FileVersion, Comment } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

// Project APIs
export const useProjects = () => {
  return useQuery({ 
    queryKey: ["/api/projects"] 
  });
};

export const useProject = (id: number) => {
  return useQuery({ 
    queryKey: ["/api/projects", id]
  });
};

export const createProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
  const result = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  }).then(res => res.json());
  
  queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
  return result;
};

export const updateProject = async (id: number, project: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>) => {
  const result = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  }).then(res => res.json());
  
  queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
  queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
  return result;
};

export const deleteProject = async (id: number) => {
  await fetch(`/api/projects/${id}`, {
    method: "DELETE",
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
};

// User APIs
export const useUser = (id: number) => {
  return useQuery({ 
    queryKey: ["/api/users", id]
  });
};

export const createUser = async (user: Omit<User, "id">) => {
  const result = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then(res => res.json());
  
  return result;
};

// Project Members APIs
export const useProjectMembers = (projectId: number) => {
  return useQuery({ 
    queryKey: ["/api/projects", projectId, "members"],
    enabled: !!projectId
  });
};

export const addProjectMember = async (projectId: number, userId: number, role: string) => {
  const result = await fetch(`/api/projects/${projectId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, role }),
  }).then(res => res.json());
  
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "members"] });
  return result;
};

export const removeProjectMember = async (projectId: number, userId: number) => {
  await fetch(`/api/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "members"] });
};

// Milestone APIs
export const useMilestones = (projectId: number) => {
  return useQuery({ 
    queryKey: ["/api/projects", projectId, "milestones"],
    enabled: !!projectId
  });
};

export const createMilestone = async (projectId: number, milestone: Omit<Milestone, "id" | "projectId" | "createdAt" | "updatedAt">) => {
  const result = await fetch(`/api/projects/${projectId}/milestones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...milestone, projectId }),
  }).then(res => res.json());
  
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "milestones"] });
  return result;
};

export const updateMilestone = async (id: number, milestone: Partial<Omit<Milestone, "id" | "projectId" | "createdAt" | "updatedAt">>) => {
  const result = await fetch(`/api/milestones/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(milestone),
  }).then(res => res.json());
  
  queryClient.invalidateQueries({ queryKey: ["/api/milestones", id] });
  return result;
};

export const deleteMilestone = async (id: number, projectId: number) => {
  await fetch(`/api/milestones/${id}`, {
    method: "DELETE",
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "milestones"] });
};

// Task APIs
export const useTasks = (projectId: number, milestoneId?: number) => {
  const queryKey = milestoneId 
    ? ["/api/projects", projectId, "tasks", { milestoneId }] 
    : ["/api/projects", projectId, "tasks"];
    
  return useQuery({ 
    queryKey,
    enabled: !!projectId
  });
};

export const createTask = async (projectId: number, task: Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">) => {
  const result = await fetch(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...task, projectId }),
  }).then(res => res.json());
  
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks"] });
  if (task.milestoneId) {
    queryClient.invalidateQueries({ 
      queryKey: ["/api/projects", projectId, "tasks", { milestoneId: task.milestoneId }] 
    });
  }
  return result;
};

export const updateTask = async (id: number, task: Partial<Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">>, projectId: number) => {
  const result = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  }).then(res => res.json());
  
  queryClient.invalidateQueries({ queryKey: ["/api/tasks", id] });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks"] });
  if (task.milestoneId) {
    queryClient.invalidateQueries({ 
      queryKey: ["/api/projects", projectId, "tasks", { milestoneId: task.milestoneId }] 
    });
  }
  return result;
};

export const deleteTask = async (id: number, projectId: number, milestoneId?: number) => {
  await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks"] });
  if (milestoneId) {
    queryClient.invalidateQueries({ 
      queryKey: ["/api/projects", projectId, "tasks", { milestoneId }] 
    });
  }
};

// Folder APIs
export const useFolders = (projectId: number, parentId?: number) => {
  const queryKey = parentId 
    ? ["/api/projects", projectId, "folders", { parentId }] 
    : ["/api/projects", projectId, "folders"];
    
  return useQuery({ 
    queryKey,
    enabled: !!projectId
  });
};

export const createFolder = async (projectId: number, folder: Omit<Folder, "id" | "projectId" | "createdAt" | "updatedAt">) => {
  const result = await fetch(`/api/projects/${projectId}/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...folder, projectId }),
  }).then(res => res.json());
  
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "folders"] });
  if (folder.parentId) {
    queryClient.invalidateQueries({ 
      queryKey: ["/api/projects", projectId, "folders", { parentId: folder.parentId }] 
    });
  }
  return result;
};

export const updateFolder = async (id: number, folder: Partial<Omit<Folder, "id" | "projectId" | "createdAt" | "updatedAt">>, projectId: number) => {
  const result = await fetch(`/api/folders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(folder),
  }).then(res => res.json());
  
  queryClient.invalidateQueries({ queryKey: ["/api/folders", id] });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "folders"] });
  return result;
};

export const deleteFolder = async (id: number, projectId: number) => {
  await fetch(`/api/folders/${id}`, {
    method: "DELETE",
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "folders"] });
};

// File APIs
export const useFiles = (projectId: number, folderId?: number) => {
  const queryKey = folderId 
    ? ["/api/projects", projectId, "files", { folderId }] 
    : ["/api/projects", projectId, "files"];
    
  return useQuery({ 
    queryKey,
    enabled: !!projectId
  });
};

export const createFile = async (projectId: number, file: Omit<File, "id" | "projectId" | "createdAt" | "updatedAt">) => {
  const result = await fetch(`/api/projects/${projectId}/files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...file, projectId }),
  }).then(res => res.json());
  
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "files"] });
  if (file.folderId) {
    queryClient.invalidateQueries({ 
      queryKey: ["/api/projects", projectId, "files", { folderId: file.folderId }] 
    });
  }
  return result;
};

export const updateFile = async (id: number, file: Partial<Omit<File, "id" | "projectId" | "createdAt" | "updatedAt">>, projectId: number) => {
  const result = await fetch(`/api/files/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(file),
  }).then(res => res.json());
  
  queryClient.invalidateQueries({ queryKey: ["/api/files", id] });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "files"] });
  return result;
};

export const deleteFile = async (id: number, projectId: number) => {
  await fetch(`/api/files/${id}`, {
    method: "DELETE",
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "files"] });
};

// File Versions APIs
export const useFileVersions = (fileId: number) => {
  return useQuery({ 
    queryKey: ["/api/files", fileId, "versions"],
    enabled: !!fileId
  });
};

// Comments APIs
export const useTaskComments = (taskId: number) => {
  return useQuery({ 
    queryKey: ["/api/tasks", taskId, "comments"],
    enabled: !!taskId
  });
};

export const useFileComments = (fileId: number) => {
  return useQuery({ 
    queryKey: ["/api/files", fileId, "comments"],
    enabled: !!fileId
  });
};

export const createComment = async (comment: Omit<Comment, "id" | "createdAt" | "updatedAt">) => {
  const result = await fetch("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  }).then(res => res.json());
  
  if (comment.taskId) {
    queryClient.invalidateQueries({ queryKey: ["/api/tasks", comment.taskId, "comments"] });
  }
  
  if (comment.fileId) {
    queryClient.invalidateQueries({ queryKey: ["/api/files", comment.fileId, "comments"] });
  }
  
  return result;
};

export const deleteComment = async (id: number, taskId?: number, fileId?: number) => {
  await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  });
  
  if (taskId) {
    queryClient.invalidateQueries({ queryKey: ["/api/tasks", taskId, "comments"] });
  }
  
  if (fileId) {
    queryClient.invalidateQueries({ queryKey: ["/api/files", fileId, "comments"] });
  }
};