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
  }
];
