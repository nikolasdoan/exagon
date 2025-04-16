import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { Project, Milestone, Task, User, ProjectMember, Folder, File, FileVersion, Comment } from "@shared/schema";

// Project APIs
export const useProjects = () => {
  return getQueryFn<Project[]>({ 
    queryKey: ["/api/projects"],
    on401: "returnNull" 
  });
};

export const useProject = (id: number) => {
  return getQueryFn<Project>({ 
    queryKey: ["/api/projects", id],
    on401: "returnNull" 
  });
};

export const createProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
  const result = await apiRequest("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
  return result;
};

export const updateProject = async (id: number, project: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>) => {
  const result = await apiRequest(`/api/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(project),
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
  queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
  return result;
};

export const deleteProject = async (id: number) => {
  await apiRequest(`/api/projects/${id}`, {
    method: "DELETE",
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
};

// User APIs
export const useUser = (id: number) => {
  return getQueryFn<User>({ 
    queryKey: ["/api/users", id],
    on401: "returnNull" 
  });
};

export const createUser = async (user: Omit<User, "id">) => {
  const result = await apiRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
  return result;
};

// Project Members APIs
export const useProjectMembers = (projectId: number) => {
  return getQueryFn<(ProjectMember & { user: User })[]>({ 
    queryKey: ["/api/projects", projectId, "members"],
    on401: "returnNull" 
  });
};

export const addProjectMember = async (projectId: number, userId: number, role: string) => {
  const result = await apiRequest(`/api/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify({ userId, role }),
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "members"] });
  return result;
};

export const removeProjectMember = async (projectId: number, userId: number) => {
  await apiRequest(`/api/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "members"] });
};

// Milestone APIs
export const useMilestones = (projectId: number) => {
  return getQueryFn<Milestone[]>({ 
    queryKey: ["/api/projects", projectId, "milestones"],
    on401: "returnNull" 
  });
};

export const createMilestone = async (projectId: number, milestone: Omit<Milestone, "id" | "projectId" | "createdAt" | "updatedAt">) => {
  const result = await apiRequest(`/api/projects/${projectId}/milestones`, {
    method: "POST",
    body: JSON.stringify({ ...milestone, projectId }),
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "milestones"] });
  return result;
};

export const updateMilestone = async (id: number, milestone: Partial<Omit<Milestone, "id" | "projectId" | "createdAt" | "updatedAt">>) => {
  const result = await apiRequest(`/api/milestones/${id}`, {
    method: "PATCH",
    body: JSON.stringify(milestone),
  });
  queryClient.invalidateQueries({ queryKey: ["/api/milestones", id] });
  return result;
};

export const deleteMilestone = async (id: number, projectId: number) => {
  await apiRequest(`/api/milestones/${id}`, {
    method: "DELETE",
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "milestones"] });
};

// Task APIs
export const useTasks = (projectId: number, milestoneId?: number) => {
  const queryKey = milestoneId 
    ? ["/api/projects", projectId, "tasks", { milestoneId }] 
    : ["/api/projects", projectId, "tasks"];
    
  return getQueryFn<Task[]>({ 
    queryKey,
    on401: "returnNull" 
  });
};

export const createTask = async (projectId: number, task: Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">) => {
  const result = await apiRequest(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify({ ...task, projectId }),
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks"] });
  if (task.milestoneId) {
    queryClient.invalidateQueries({ 
      queryKey: ["/api/projects", projectId, "tasks", { milestoneId: task.milestoneId }] 
    });
  }
  return result;
};

export const updateTask = async (id: number, task: Partial<Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">>, projectId: number) => {
  const result = await apiRequest(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(task),
  });
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
  await apiRequest(`/api/tasks/${id}`, {
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
    
  return getQueryFn<Folder[]>({ 
    queryKey,
    on401: "returnNull" 
  });
};

export const createFolder = async (projectId: number, folder: Omit<Folder, "id" | "projectId" | "createdAt" | "updatedAt">) => {
  const result = await apiRequest(`/api/projects/${projectId}/folders`, {
    method: "POST",
    body: JSON.stringify({ ...folder, projectId }),
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "folders"] });
  if (folder.parentId) {
    queryClient.invalidateQueries({ 
      queryKey: ["/api/projects", projectId, "folders", { parentId: folder.parentId }] 
    });
  }
  return result;
};

export const updateFolder = async (id: number, folder: Partial<Omit<Folder, "id" | "projectId" | "createdAt" | "updatedAt">>, projectId: number) => {
  const result = await apiRequest(`/api/folders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(folder),
  });
  queryClient.invalidateQueries({ queryKey: ["/api/folders", id] });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "folders"] });
  return result;
};

export const deleteFolder = async (id: number, projectId: number) => {
  await apiRequest(`/api/folders/${id}`, {
    method: "DELETE",
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "folders"] });
};

// File APIs
export const useFiles = (projectId: number, folderId?: number) => {
  const queryKey = folderId 
    ? ["/api/projects", projectId, "files", { folderId }] 
    : ["/api/projects", projectId, "files"];
    
  return getQueryFn<File[]>({ 
    queryKey,
    on401: "returnNull" 
  });
};

export const createFile = async (projectId: number, file: Omit<File, "id" | "projectId" | "createdAt" | "updatedAt">) => {
  const result = await apiRequest(`/api/projects/${projectId}/files`, {
    method: "POST",
    body: JSON.stringify({ ...file, projectId }),
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "files"] });
  if (file.folderId) {
    queryClient.invalidateQueries({ 
      queryKey: ["/api/projects", projectId, "files", { folderId: file.folderId }] 
    });
  }
  return result;
};

export const updateFile = async (id: number, file: Partial<Omit<File, "id" | "projectId" | "createdAt" | "updatedAt">>, projectId: number) => {
  const result = await apiRequest(`/api/files/${id}`, {
    method: "PATCH",
    body: JSON.stringify(file),
  });
  queryClient.invalidateQueries({ queryKey: ["/api/files", id] });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "files"] });
  return result;
};

export const deleteFile = async (id: number, projectId: number) => {
  await apiRequest(`/api/files/${id}`, {
    method: "DELETE",
  });
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "files"] });
};

// File Versions APIs
export const useFileVersions = (fileId: number) => {
  return getQueryFn<FileVersion[]>({ 
    queryKey: ["/api/files", fileId, "versions"],
    on401: "returnNull" 
  });
};

// Comments APIs
export const useTaskComments = (taskId: number) => {
  return getQueryFn<Comment[]>({ 
    queryKey: ["/api/tasks", taskId, "comments"],
    on401: "returnNull" 
  });
};

export const useFileComments = (fileId: number) => {
  return getQueryFn<Comment[]>({ 
    queryKey: ["/api/files", fileId, "comments"],
    on401: "returnNull" 
  });
};

export const createComment = async (comment: Omit<Comment, "id" | "createdAt" | "updatedAt">) => {
  const result = await apiRequest("/api/comments", {
    method: "POST",
    body: JSON.stringify(comment),
  });
  
  if (comment.taskId) {
    queryClient.invalidateQueries({ queryKey: ["/api/tasks", comment.taskId, "comments"] });
  }
  
  if (comment.fileId) {
    queryClient.invalidateQueries({ queryKey: ["/api/files", comment.fileId, "comments"] });
  }
  
  return result;
};

export const deleteComment = async (id: number, taskId?: number, fileId?: number) => {
  await apiRequest(`/api/comments/${id}`, {
    method: "DELETE",
  });
  
  if (taskId) {
    queryClient.invalidateQueries({ queryKey: ["/api/tasks", taskId, "comments"] });
  }
  
  if (fileId) {
    queryClient.invalidateQueries({ queryKey: ["/api/files", fileId, "comments"] });
  }
};