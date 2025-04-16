// Predefined responses with regex patterns for keyword matching
export const responses = [
  { 
    triggers: [/build|robot|game/i],
    reply: "That sounds cool! Is this for a video game, VR, or something else?",
    ui: null
  },
  { 
    triggers: [/game/i],
    reply: "Great! Would you like me to help set up your Sci-Fi Robot project?",
    ui: null
  },
  { 
    triggers: [/yes|setup/i],
    reply: "What is the timeline for the project?",
    ui: null
  },
  { 
    triggers: [/month|week|timeline/i],
    reply: "Any milestones or workstreams to divide the project into?",
    ui: null
  },
  { 
    triggers: [/milestone|object|texture|animation/i],
    reply: "Here's your project setup with the milestones you mentioned. You can see the timeline visualization on the right.",
    ui: 'projectSetup'
  },
  { 
    triggers: [/team|teammate|member/i],
    reply: "I've added your team members to the project dashboard. Would you like to add more details about their roles?",
    ui: 'teamSetup'
  },
  { 
    triggers: [/tool|compare|software/i],
    reply: "Here's a comparison of common 3D modeling tools that could be useful for your project.",
    ui: 'toolsComparison'
  },
  { 
    triggers: [/file|files|manage/i],
    reply: "I've added file management capabilities to your project. You can now view, organize, and track your project files.",
    ui: 'fileManagement'
  },
  { 
    triggers: [/version|control|history|revision/i],
    reply: "Here's the version control panel for your project. You can track changes, view history, and manage different versions of your assets.",
    ui: 'versionControl'
  },
  { 
    triggers: [/graph|statistics|analytics|progress/i],
    reply: "I've added project analytics to help you track progress and resource utilization over time.",
    ui: 'progressGraphs'
  },
  { 
    triggers: [/import|export|exchange|format/i],
    reply: "Here are the import and export options for your project. You can work with multiple file formats similar to TinkerCAD and Onshape.",
    ui: 'importExport'
  }
];
