
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Timeline from "./Timeline";
import { LearningPlan as LearningPlanType } from "@/lib/types";
import { CalendarDays, Clock, ListChecks } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface LearningPlanProps {
  plan: LearningPlanType;
  onUpdatePlan: (updatedPlan: LearningPlanType) => void;
  onClose: () => void;
}

export default function LearningPlan({ plan, onUpdatePlan, onClose }: LearningPlanProps) {
  const [currentPlan, setCurrentPlan] = useState<LearningPlanType>(plan);
  
  useEffect(() => {
    setCurrentPlan(plan);
  }, [plan]);
  
  // Calculate progress percentage
  const completedResources = plan.resources.filter(r => r.completed).length;
  const totalResources = plan.resources.length;
  const progressPercentage = totalResources > 0 
    ? Math.round((completedResources / totalResources) * 100) 
    : 0;
  
  // Format timeframe for display
  const getTimeframeText = () => {
    const unit = plan.timeframeUnit === 'days' 
      ? plan.timeframe === 1 ? 'day' : 'days'
      : plan.timeframeUnit === 'weeks'
        ? plan.timeframe === 1 ? 'week' : 'weeks'
        : plan.timeframe === 1 ? 'month' : 'months';
        
    return `${plan.timeframe} ${unit}`;
  };

  const handleResourceComplete = (resourceId: string, completed: boolean) => {
    const updatedResources = currentPlan.resources.map(resource => 
      resource.id === resourceId ? { ...resource, completed } : resource
    );
    
    const updatedPlan = {
      ...currentPlan,
      resources: updatedResources
    };
    
    setCurrentPlan(updatedPlan);
    onUpdatePlan(updatedPlan);
  };

  const handleMilestoneComplete = (milestoneId: string, completed: boolean) => {
    const updatedMilestones = currentPlan.milestones.map(milestone => 
      milestone.id === milestoneId ? { ...milestone, completed } : milestone
    );
    
    const updatedPlan = {
      ...currentPlan,
      milestones: updatedMilestones
    };
    
    setCurrentPlan(updatedPlan);
    onUpdatePlan(updatedPlan);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-planner-purple-dark">{plan.title}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-planner-gray">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{getTimeframeText()}</span>
            </div>
            <div className="flex items-center gap-1">
              <ListChecks className="h-4 w-4" />
              <span>{completedResources} of {totalResources} resources completed</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Back to Plans
        </Button>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-planner-purple h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="timeline" className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>Timeline</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-0">
          <Timeline 
            plan={currentPlan}
            onResourceComplete={handleResourceComplete}
            onMilestoneComplete={handleMilestoneComplete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
