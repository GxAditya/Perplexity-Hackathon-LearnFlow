
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LearningPlan } from "@/lib/types";
import { Calendar, Clock, Trash2, BookOpen } from "lucide-react";

interface PlanListProps {
  plans: LearningPlan[];
  onSelectPlan: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  activePlanId?: string;
}

export default function PlanList({ plans, onSelectPlan, onDeletePlan, activePlanId }: PlanListProps) {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const getTimeframeText = (plan: LearningPlan) => {
    const unit = plan.timeframeUnit === 'days' 
      ? plan.timeframe === 1 ? 'day' : 'days'
      : plan.timeframeUnit === 'weeks'
        ? plan.timeframe === 1 ? 'week' : 'weeks'
        : plan.timeframe === 1 ? 'month' : 'months';
        
    return `${plan.timeframe} ${unit}`;
  };
  
  const getCompletionPercentage = (plan: LearningPlan) => {
    if (plan.resources.length === 0) return 0;
    const completedCount = plan.resources.filter(r => r.completed).length;
    return Math.round((completedCount / plan.resources.length) * 100);
  };
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Learning Plans</h2>
      
      {plans.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center">
              <BookOpen className="h-12 w-12 text-planner-gray mb-4" />
              <h3 className="text-lg font-medium mb-2">No learning plans yet</h3>
              <p className="text-planner-gray">
                Create your first learning plan to get started!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.map(plan => {
            const isActive = plan.id === activePlanId;
            const completionPercentage = getCompletionPercentage(plan);
            
            return (
              <Card 
                key={plan.id}
                className={`transition-all duration-300 ${
                  isActive ? 'border-planner-purple bg-planner-purple-light/30' : ''
                } ${
                  hoveredPlan === plan.id ? 'shadow-md' : ''
                }`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                <div className="flex sm:flex-row flex-col">
                  <CardHeader className="flex-1">
                    <CardTitle>{plan.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5" /> 
                      Created: {formatDate(plan.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="py-6 flex-1">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2 text-sm text-planner-gray">
                        <Clock className="h-4 w-4" />
                        <span>{getTimeframeText(plan)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span>Progress:</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-planner-purple h-2.5 rounded-full" 
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                        <span>{completionPercentage}%</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex sm:flex-col gap-2 justify-end">
                    <Button
                      variant={isActive ? "outline" : "default"}
                      className={isActive 
                        ? "border-planner-purple text-planner-purple hover:bg-planner-purple hover:text-white" 
                        : "bg-planner-purple hover:bg-planner-purple-dark"
                      }
                      onClick={() => onSelectPlan(plan.id)}
                    >
                      {isActive ? "Current Plan" : "View Plan"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => onDeletePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
