import { 
  users, type User, type InsertUser, 
  projects, type Project, type InsertProject,
  projectMembers, type ProjectMember, type InsertProjectMember,
  milestones, type Milestone, type InsertMilestone,
  tasks, type Task, type InsertTask,
  folders, type Folder, type InsertFolder,
  files, type File, type InsertFile, 
  fileVersions, type FileVersion, type InsertFileVersion,
  fileActivities, type FileActivity, type InsertFileActivity,
  comments, type Comment, type InsertComment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, isNull, sql, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Project Member operations
  getProjectMembers(projectId: number): Promise<(ProjectMember & { user: User })[]>;
  addProjectMember(member: InsertProjectMember): Promise<ProjectMember>;
  removeProjectMember(projectId: number, userId: number): Promise<boolean>;
  
  // Milestone operations
  getMilestones(projectId: number): Promise<Milestone[]>;
  getMilestone(id: number): Promise<Milestone | undefined>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestone(id: number, milestone: Partial<InsertMilestone>): Promise<Milestone | undefined>;
  deleteMilestone(id: number): Promise<boolean>;
  
  // Task operations
  getTasks(projectId: number, milestoneId?: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Folder operations
  getFolders(projectId: number, parentId?: number): Promise<Folder[]>;
  getFolder(id: number): Promise<Folder | undefined>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  updateFolder(id: number, folder: Partial<InsertFolder>): Promise<Folder | undefined>;
  deleteFolder(id: number): Promise<boolean>;
  
  // File operations
  getFiles(projectId: number, folderId?: number): Promise<File[]>;
  getFile(id: number): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: number, file: Partial<InsertFile>): Promise<File | undefined>;
  deleteFile(id: number): Promise<boolean>;
  
  // File Version operations
  getFileVersions(fileId: number): Promise<FileVersion[]>;
  createFileVersion(version: InsertFileVersion): Promise<FileVersion>;
  
  // File Activity operations
  getFileActivities(fileId: number): Promise<FileActivity[]>;
  createFileActivity(activity: InsertFileActivity): Promise<FileActivity>;
  
  // Comment operations
  getTaskComments(taskId: number): Promise<Comment[]>;
  getFileComments(fileId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  
  async getProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  }
  
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }
  
  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...projectData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Project Member operations
  async getProjectMembers(projectId: number): Promise<(ProjectMember & { user: User })[]> {
    const members = await db.select().from(projectMembers).where(eq(projectMembers.projectId, projectId));
    
    const membersWithUsers: (ProjectMember & { user: User })[] = [];
    
    for (const member of members) {
      const [user] = await db.select().from(users).where(eq(users.id, member.userId));
      if (user) {
        membersWithUsers.push({
          ...member,
          user
        });
      }
    }
    
    return membersWithUsers;
  }
  
  async addProjectMember(member: InsertProjectMember): Promise<ProjectMember> {
    const [newMember] = await db.insert(projectMembers).values(member).returning();
    return newMember;
  }
  
  async removeProjectMember(projectId: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, projectId),
          eq(projectMembers.userId, userId)
        )
      );
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Milestone operations
  async getMilestones(projectId: number): Promise<Milestone[]> {
    return db
      .select()
      .from(milestones)
      .where(eq(milestones.projectId, projectId))
      .orderBy(milestones.dueDate);
  }
  
  async getMilestone(id: number): Promise<Milestone | undefined> {
    const [milestone] = await db.select().from(milestones).where(eq(milestones.id, id));
    return milestone;
  }
  
  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    const [newMilestone] = await db.insert(milestones).values(milestone).returning();
    return newMilestone;
  }
  
  async updateMilestone(id: number, milestoneData: Partial<InsertMilestone>): Promise<Milestone | undefined> {
    const [updatedMilestone] = await db
      .update(milestones)
      .set(milestoneData)
      .where(eq(milestones.id, id))
      .returning();
    return updatedMilestone;
  }
  
  async deleteMilestone(id: number): Promise<boolean> {
    const result = await db.delete(milestones).where(eq(milestones.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Task operations
  async getTasks(projectId: number, milestoneId?: number): Promise<Task[]> {
    let baseQuery = db.select().from(tasks).where(eq(tasks.projectId, projectId));
      
    if (milestoneId) {
      return db.select().from(tasks).where(
        and(
          eq(tasks.projectId, projectId),
          eq(tasks.milestoneId, milestoneId)
        )
      ).orderBy(tasks.dueDate);
    }
    
    return baseQuery.orderBy(tasks.dueDate);
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }
  
  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }
  
  async updateTask(id: number, taskData: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...taskData, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Folder operations
  async getFolders(projectId: number, parentId?: number): Promise<Folder[]> {
    if (parentId) {
      return db.select()
        .from(folders)
        .where(
          and(
            eq(folders.projectId, projectId),
            eq(folders.parentId, parentId)
          )
        )
        .orderBy(folders.name);
    } else {
      return db.select()
        .from(folders)
        .where(
          and(
            eq(folders.projectId, projectId),
            isNull(folders.parentId)
          )
        )
        .orderBy(folders.name);
    }
  }
  
  async getFolder(id: number): Promise<Folder | undefined> {
    const [folder] = await db.select().from(folders).where(eq(folders.id, id));
    return folder;
  }
  
  async createFolder(folder: InsertFolder): Promise<Folder> {
    const [newFolder] = await db.insert(folders).values(folder).returning();
    return newFolder;
  }
  
  async updateFolder(id: number, folderData: Partial<InsertFolder>): Promise<Folder | undefined> {
    const [updatedFolder] = await db
      .update(folders)
      .set({ ...folderData, updatedAt: new Date() })
      .where(eq(folders.id, id))
      .returning();
    return updatedFolder;
  }
  
  async deleteFolder(id: number): Promise<boolean> {
    const result = await db.delete(folders).where(eq(folders.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // File operations
  async getFiles(projectId: number, folderId?: number): Promise<File[]> {
    if (folderId) {
      return db.select()
        .from(files)
        .where(
          and(
            eq(files.projectId, projectId),
            eq(files.folderId, folderId)
          )
        )
        .orderBy(files.name);
    } else {
      return db.select()
        .from(files)
        .where(
          and(
            eq(files.projectId, projectId),
            isNull(files.folderId)
          )
        )
        .orderBy(files.name);
    }
  }
  
  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }
  
  async createFile(file: InsertFile): Promise<File> {
    const [newFile] = await db.insert(files).values(file).returning();
    return newFile;
  }
  
  async updateFile(id: number, fileData: Partial<InsertFile>): Promise<File | undefined> {
    const [updatedFile] = await db
      .update(files)
      .set({ ...fileData, updatedAt: new Date() })
      .where(eq(files.id, id))
      .returning();
    return updatedFile;
  }
  
  async deleteFile(id: number): Promise<boolean> {
    const result = await db.delete(files).where(eq(files.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // File Version operations
  async getFileVersions(fileId: number): Promise<FileVersion[]> {
    return db
      .select()
      .from(fileVersions)
      .where(eq(fileVersions.fileId, fileId))
      .orderBy(desc(fileVersions.versionNumber));
  }
  
  async createFileVersion(version: InsertFileVersion): Promise<FileVersion> {
    const [newVersion] = await db.insert(fileVersions).values(version).returning();
    return newVersion;
  }
  
  // File Activity operations
  async getFileActivities(fileId: number): Promise<FileActivity[]> {
    return db
      .select()
      .from(fileActivities)
      .where(eq(fileActivities.fileId, fileId))
      .orderBy(desc(fileActivities.createdAt));
  }
  
  async createFileActivity(activity: InsertFileActivity): Promise<FileActivity> {
    const [newActivity] = await db.insert(fileActivities).values(activity).returning();
    return newActivity;
  }
  
  // Comment operations
  async getTaskComments(taskId: number): Promise<Comment[]> {
    return db
      .select()
      .from(comments)
      .where(eq(comments.taskId, taskId))
      .orderBy(comments.createdAt);
  }
  
  async getFileComments(fileId: number): Promise<Comment[]> {
    return db
      .select()
      .from(comments)
      .where(eq(comments.fileId, fileId))
      .orderBy(comments.createdAt);
  }
  
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }
  
  async deleteComment(id: number): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
