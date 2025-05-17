
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Milestone, Resource, LearningPlan } from "@/lib/types";
import ResourceCard from "./ResourceCard";
import { CheckSquare, Check, Square } from "lucide-react";

interface TimelineProps {
  plan: LearningPlan;
  onResourceComplete: (resourceId: string, completed: boolean) => void;
  onMilestoneComplete: (milestoneId: string, completed: boolean) => void;
}

export default function Timeline({ plan, onResourceComplete, onMilestoneComplete }: TimelineProps) {
  const [activeResource, setActiveResource] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Find the first incomplete resource to highlight
  useEffect(() => {
    const firstIncomplete = plan.resources.find(r => !r.completed);
    if (firstIncomplete) {
      setActiveResource(firstIncomplete.id);
    } else {
      setActiveResource(null);
    }
  }, [plan.resources]);

  // Group resources by due date
  const resourcesByDate: Record<string, Resource[]> = {};
  plan.resources.forEach(resource => {
    if (!resource.dueDate) return;
    
    const date = new Date(resource.dueDate).toISOString().split('T')[0];
    if (!resourcesByDate[date]) {
      resourcesByDate[date] = [];
    }
    resourcesByDate[date].push(resource);
  });
  
  // Sort dates
  const sortedDates = Object.keys(resourcesByDate).sort();
  
  // Determine if a milestone is complete (all associated resources are completed)
  const isMilestoneComplete = (milestone: Milestone) => {
    return milestone.resources.every(resourceId => {
      const resource = plan.resources.find(r => r.id === resourceId);
      return resource && resource.completed;
    });
  };
  
  // Find the milestone for a given date
  const getMilestoneForDate = (date: string) => {
    return plan.milestones.find(milestone => {
      const milestoneDate = new Date(milestone.targetDate).toISOString().split('T')[0];
      return milestoneDate === date;
    });
  };
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle milestone completion toggle
  const toggleMilestoneComplete = (milestone: Milestone) => {
    onMilestoneComplete(milestone.id, !milestone.completed);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in" ref={timelineRef}>
      <h2 className="text-2xl font-bold mb-4 text-planner-purple-dark">Your Learning Timeline</h2>
      
      <div className="space-y-10">
        {sortedDates.map((date, index) => {
          const resources = resourcesByDate[date];
          const milestone = getMilestoneForDate(date);
          
          return (
            <div key={date} className="relative">
              {/* Timeline connector line */}
              {index < sortedDates.length - 1 && (
                <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-planner-purple-light h-[calc(100%+40px)]" />
              )}
              
              <div className="flex items-start gap-4">
                {/* Timeline dot */}
                <div className="rounded-full bg-planner-purple w-10 h-10 flex items-center justify-center z-10 flex-shrink-0 mt-6">
                  <span className="text-white text-sm font-semibold">{index + 1}</span>
                </div>
                
                <div className="w-full">
                  <div className="text-sm text-planner-gray mb-2 font-medium">
                    {formatDate(date)}
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    {resources.map(resource => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onComplete={onResourceComplete}
                      />
                    ))}
                  </div>
                  
                  {/* Milestone if there is one for this date */}
                  {milestone && (
                    <Card className="mt-4 bg-planner-blue-light border-planner-blue p-4">
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => toggleMilestoneComplete(milestone)}
                          className="mt-0.5"
                        >
                          {milestone.completed ? 
                            <CheckSquare className="h-5 w-5 text-planner-blue" /> : 
                            <Square className="h-5 w-5 text-planner-blue-dark" />
                          }
                        </button>
                        <div>
                          <h3 className="font-semibold text-planner-blue-dark">
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-planner-gray-dark mt-1">
                            {milestone.description}
                          </p>
                          {milestone.completed && (
                            <div className="mt-2 flex items-center text-green-600 text-sm">
                              <Check className="h-4 w-4 mr-1" />
                              Milestone completed!
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
