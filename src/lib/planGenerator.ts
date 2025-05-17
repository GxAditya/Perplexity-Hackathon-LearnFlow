
import { LearningPlan, TopicInputData, Resource, Milestone, LearningPreference } from "./types";

// Mock resources until we integrate with a real API
const mockResources: Record<string, Record<LearningPreference, Resource[]>> = {
  beginner: {
    video: [
      {
        id: "vid-1",
        title: "Introduction to the Topic",
        url: "https://example.com/intro-video",
        type: "video",
        description: "A beginner-friendly introduction to get you started",
        estimatedTime: 45,
        completed: false
      },
      {
        id: "vid-2",
        title: "Core Concepts Explained",
        url: "https://example.com/core-concepts",
        type: "video",
        description: "Understanding the fundamental principles",
        estimatedTime: 60,
        completed: false
      }
    ],
    text: [
      {
        id: "text-1",
        title: "Beginner's Guide",
        url: "https://example.com/beginners-guide",
        type: "text",
        description: "A comprehensive guide for beginners",
        estimatedTime: 90,
        completed: false
      }
    ],
    project: [
      {
        id: "proj-1",
        title: "Your First Project",
        url: "https://example.com/first-project",
        type: "project",
        description: "A hands-on project to apply what you've learned",
        estimatedTime: 120,
        completed: false
      }
    ],
    interactive: [
      {
        id: "int-1",
        title: "Interactive Tutorial",
        url: "https://example.com/interactive",
        type: "interactive",
        description: "Learn by doing with this interactive tutorial",
        estimatedTime: 60,
        completed: false
      }
    ],
    audio: [
      {
        id: "aud-1",
        title: "Beginner Podcast",
        url: "https://example.com/podcast",
        type: "audio",
        description: "Listen and learn with this beginner-friendly podcast",
        estimatedTime: 30,
        completed: false
      }
    ]
  },
  intermediate: {
    video: [
      {
        id: "vid-3",
        title: "Advanced Techniques",
        url: "https://example.com/advanced-video",
        type: "video",
        description: "Take your skills to the next level",
        estimatedTime: 75,
        completed: false
      }
    ],
    text: [
      {
        id: "text-2",
        title: "Intermediate Guide",
        url: "https://example.com/intermediate-guide",
        type: "text",
        description: "Expand your knowledge with this intermediate guide",
        estimatedTime: 120,
        completed: false
      }
    ],
    project: [
      {
        id: "proj-2",
        title: "Complex Project",
        url: "https://example.com/complex-project",
        type: "project",
        description: "A challenging project to test your abilities",
        estimatedTime: 180,
        completed: false
      }
    ],
    interactive: [
      {
        id: "int-2",
        title: "Interactive Workshop",
        url: "https://example.com/workshop",
        type: "interactive",
        description: "A deep-dive interactive workshop",
        estimatedTime: 90,
        completed: false
      }
    ],
    audio: [
      {
        id: "aud-2",
        title: "In-depth Podcast Series",
        url: "https://example.com/podcast-series",
        type: "audio",
        description: "A series of podcasts covering intermediate topics",
        estimatedTime: 45,
        completed: false
      }
    ]
  },
  advanced: {
    video: [
      {
        id: "vid-4",
        title: "Expert Masterclass",
        url: "https://example.com/masterclass",
        type: "video",
        description: "An expert-level masterclass",
        estimatedTime: 90,
        completed: false
      }
    ],
    text: [
      {
        id: "text-3",
        title: "Advanced Documentation",
        url: "https://example.com/advanced-docs",
        type: "text",
        description: "Comprehensive documentation for experts",
        estimatedTime: 150,
        completed: false
      }
    ],
    project: [
      {
        id: "proj-3",
        title: "Professional Project",
        url: "https://example.com/pro-project",
        type: "project",
        description: "A professional-grade project challenge",
        estimatedTime: 240,
        completed: false
      }
    ],
    interactive: [
      {
        id: "int-3",
        title: "Expert Challenge",
        url: "https://example.com/expert-challenge",
        type: "interactive",
        description: "Test your expertise with this interactive challenge",
        estimatedTime: 120,
        completed: false
      }
    ],
    audio: [
      {
        id: "aud-3",
        title: "Expert Interviews",
        url: "https://example.com/interviews",
        type: "audio",
        description: "Interviews with experts in the field",
        estimatedTime: 60,
        completed: false
      }
    ]
  }
};

// Helper function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Helper function to distribute resources over the timeframe
function distributeResourcesOverTime(resources: Resource[], startDate: Date, endDate: Date): Resource[] {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPerResource = Math.max(1, Math.floor(totalDays / resources.length));
  
  return resources.map((resource, index) => {
    const dueDate = new Date(startDate);
    dueDate.setDate(startDate.getDate() + (index * daysPerResource));
    
    // Make sure the last resources don't go past the end date
    if (dueDate > endDate) {
      dueDate.setTime(endDate.getTime());
    }
    
    return {
      ...resource,
      dueDate: dueDate.toISOString()
    };
  });
}

// Helper function to create milestones
function createMilestones(resources: Resource[], startDate: Date, endDate: Date): Milestone[] {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const milestoneCount = Math.max(1, Math.ceil(totalDays / 7)); // One milestone per week approximately
  const daysPerMilestone = Math.floor(totalDays / milestoneCount);
  
  const milestones: Milestone[] = [];
  
  for (let i = 0; i < milestoneCount; i++) {
    const milestoneDate = new Date(startDate);
    milestoneDate.setDate(startDate.getDate() + ((i + 1) * daysPerMilestone));
    
    // Get resources that should be completed by this milestone
    const resourcesForMilestone = resources.filter(resource => {
      if (!resource.dueDate) return false;
      const resourceDate = new Date(resource.dueDate);
      return resourceDate <= milestoneDate;
    });

    const resourceIds = resourcesForMilestone
      .slice(Math.max(0, resourcesForMilestone.length - 3)) // Get up to 3 most recent resources
      .map(r => r.id);
    
    milestones.push({
      id: generateId(),
      title: `Milestone ${i + 1}`,
      description: `Complete key resources and test your understanding`,
      targetDate: milestoneDate.toISOString(),
      completed: false,
      resources: resourceIds
    });
  }
  
  return milestones;
}

export function generateLearningPlan(inputData: TopicInputData): LearningPlan {
  const { topic, timeframe, timeframeUnit, knowledgeLevel, preferences, studyTimePerDay } = inputData;
  
  // Calculate start and end dates
  const startDate = new Date();
  const endDate = new Date(startDate);
  
  switch (timeframeUnit) {
    case 'days':
      endDate.setDate(startDate.getDate() + timeframe);
      break;
    case 'weeks':
      endDate.setDate(startDate.getDate() + (timeframe * 7));
      break;
    case 'months':
      endDate.setMonth(startDate.getMonth() + timeframe);
      break;
  }
  
  // Filter resources based on user preferences and knowledge level
  let selectedResources: Resource[] = [];
  
  preferences.forEach(pref => {
    const resourcesForPreference = mockResources[knowledgeLevel][pref];
    if (resourcesForPreference) {
      selectedResources = [...selectedResources, ...resourcesForPreference];
    }
  });
  
  // If no preferences match or selection is too small, add some default resources
  if (selectedResources.length < 5) {
    Object.values(mockResources[knowledgeLevel]).forEach(resources => {
      selectedResources = [...selectedResources, ...resources.slice(0, 1)];
    });
  }
  
  // Generate unique IDs for each resource
  selectedResources = selectedResources.map(resource => ({
    ...resource,
    id: generateId()
  }));
  
  // Distribute resources over the timeframe
  const distributedResources = distributeResourcesOverTime(selectedResources, startDate, endDate);
  
  // Create milestones
  const milestones = createMilestones(distributedResources, startDate, endDate);
  
  return {
    id: generateId(),
    title: `${topic} Learning Plan`,
    topic,
    timeframe,
    timeframeUnit,
    knowledgeLevel,
    preferences,
    studyTimePerDay,
    resources: distributedResources,
    milestones,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
