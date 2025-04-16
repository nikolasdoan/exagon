import { pgTable, text, serial, integer, timestamp, boolean, pgEnum, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
  role: text("role").default("member"),
});

export const usersRelations = relations(users, ({ many }) => ({
  projectMembers: many(projectMembers),
  tasks: many(tasks),
  comments: many(comments),
  fileActivities: many(fileActivities),
}));

// Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  members: many(projectMembers),
  milestones: many(milestones),
  files: many(files),
  tasks: many(tasks),
}));

// Project Members
export const projectMembers = pgTable("project_members", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text("role").default("member"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

// Milestones
export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const milestonesRelations = relations(milestones, ({ one, many }) => ({
  project: one(projects, {
    fields: [milestones.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

// Tasks
export const taskStatusEnum = pgEnum('task_status', ['backlog', 'todo', 'in_progress', 'review', 'done']);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  milestoneId: integer("milestone_id").references(() => milestones.id, { onDelete: 'set null' }),
  assigneeId: integer("assignee_id").references(() => users.id, { onDelete: 'set null' }),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default('todo'),
  priority: text("priority").default("medium"),
  dueDate: timestamp("due_date"),
  estimatedHours: integer("estimated_hours"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  milestone: one(milestones, {
    fields: [tasks.milestoneId],
    references: [milestones.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  comments: many(comments),
}));

// Folders
export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  parentId: integer("parent_id"),
  path: text("path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Set up foreign key reference after table definition to avoid circular reference
export const foldersRelationsConstraints = pgTable("folders", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references(() => folders.id, { onDelete: 'cascade' }),
});

export const foldersRelations = relations(folders, ({ one, many }) => ({
  project: one(projects, {
    fields: [folders.projectId],
    references: [projects.id],
  }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),
  subfolders: many(folders, { relationName: 'subfolders' }),
  files: many(files),
}));

// Files
export const fileTypeEnum = pgEnum('file_type', ['model', 'texture', 'material', 'animation', 'document', 'other']);

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  folderId: integer("folder_id").references(() => folders.id, { onDelete: 'set null' }),
  name: text("name").notNull(),
  type: fileTypeEnum("type").notNull(),
  fileExtension: text("file_extension").notNull(),
  path: text("path").notNull(),
  size: integer("size").notNull(), // in bytes
  metadata: json("metadata"),
  currentVersionId: integer("current_version_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ one, many }) => ({
  project: one(projects, {
    fields: [files.projectId],
    references: [projects.id],
  }),
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
  versions: many(fileVersions),
  activities: many(fileActivities),
}));

// File Versions
export const fileVersions = pgTable("file_versions", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").notNull().references(() => files.id, { onDelete: 'cascade' }),
  versionNumber: integer("version_number").notNull(),
  createdById: integer("created_by_id").references(() => users.id),
  path: text("path").notNull(),
  size: integer("size").notNull(),
  metadata: json("metadata"),
  changeDescription: text("change_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fileVersionsRelations = relations(fileVersions, ({ one }) => ({
  file: one(files, {
    fields: [fileVersions.fileId],
    references: [files.id],
  }),
  createdBy: one(users, {
    fields: [fileVersions.createdById],
    references: [users.id],
  }),
}));

// File Activities
export const fileActivities = pgTable("file_activities", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").notNull().references(() => files.id, { onDelete: 'cascade' }),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(), // e.g., 'created', 'updated', 'deleted', 'renamed'
  details: json("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fileActivitiesRelations = relations(fileActivities, ({ one }) => ({
  file: one(files, {
    fields: [fileActivities.fileId],
    references: [files.id],
  }),
  user: one(users, {
    fields: [fileActivities.userId],
    references: [users.id],
  }),
}));

// Comments
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id, { onDelete: 'cascade' }),
  fileId: integer("file_id").references(() => files.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  file: one(files, {
    fields: [comments.fileId],
    references: [files.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectMemberSchema = createInsertSchema(projectMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFolderSchema = createInsertSchema(folders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileVersionSchema = createInsertSchema(fileVersions).omit({
  id: true,
  createdAt: true,
});

export const insertFileActivitySchema = createInsertSchema(fileActivities).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type ProjectMember = typeof projectMembers.$inferSelect;
export type InsertProjectMember = z.infer<typeof insertProjectMemberSchema>;

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Folder = typeof folders.$inferSelect;
export type InsertFolder = z.infer<typeof insertFolderSchema>;

export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

export type FileVersion = typeof fileVersions.$inferSelect;
export type InsertFileVersion = z.infer<typeof insertFileVersionSchema>;

export type FileActivity = typeof fileActivities.$inferSelect;
export type InsertFileActivity = z.infer<typeof insertFileActivitySchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
