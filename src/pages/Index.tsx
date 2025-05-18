
import { useState, useEffect } from "react";
import TopicInput from "@/components/TopicInput";
import PlanList from "@/components/PlanList";
import LearningPlan from "@/components/LearningPlan";
import { TopicInputData, LearningPlan as LearningPlanType } from "@/lib/types";
import { generatePlanFromAPI } from "@/lib/api";
import { deletePlan, getPlans, getPlan, savePlan } from "@/lib/storage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Index() {
  const [showInputForm, setShowInputForm] = useState(true);
  const [plans, setPlans] = useState<LearningPlanType[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<LearningPlanType | null>(null);

  // Load plans on initial render
  useEffect(() => {
    const storedPlans = getPlans();
    setPlans(storedPlans);
    
    // If plans exist and none is active, show the plan list
    if (storedPlans.length > 0) {
      setShowInputForm(false);
    }
  }, []);
  
  // Update active plan when activePlanId changes
  useEffect(() => {
    if (activePlanId) {
      const plan = getPlan(activePlanId);
      if (plan) {
        setActivePlan(plan);
      }
    } else {
      setActivePlan(null);
    }
  }, [activePlanId]);

  const handleCreatePlan = async (inputData: TopicInputData) => {
    try {
      // Show loading toast
      toast.loading("Generating your learning plan...");
      
      // Generate a new learning plan using the API
      const newPlan = await generatePlanFromAPI(inputData);
      
      // Save the plan to local storage
      if (savePlan(newPlan)) {
        // Update the state
        setPlans([...plans, newPlan]);
        setActivePlanId(newPlan.id);
        setShowInputForm(false);
        toast.dismiss();
        toast.success("Learning plan created successfully!");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : "Failed to generate learning plan");
      console.error("Error creating plan:", error);
    }
  };
  
  const handleUpdatePlan = (updatedPlan: LearningPlanType) => {
    // Save the updated plan to local storage
    if (savePlan(updatedPlan)) {
      // Update the plans array
      setPlans(plans.map(plan => 
        plan.id === updatedPlan.id ? updatedPlan : plan
      ));
      // Update the active plan if needed
      if (activePlan && activePlan.id === updatedPlan.id) {
        setActivePlan(updatedPlan);
      }
    }
  };
  
  const handleDeletePlan = (planId: string) => {
    // Delete the plan from local storage
    if (deletePlan(planId)) {
      // Update the state
      const updatedPlans = plans.filter(plan => plan.id !== planId);
      setPlans(updatedPlans);
      
      // If deleted plan was active, reset active plan
      if (activePlanId === planId) {
        setActivePlanId(null);
      }
      
      // If no plans left, show the input form
      if (updatedPlans.length === 0) {
        setShowInputForm(true);
      }
      
      toast.success("Learning plan deleted successfully!");
    }
  };
  
  const handleSelectPlan = (planId: string) => {
    setActivePlanId(planId);
  };
  
  const handleClosePlan = () => {
    setActivePlanId(null);
  };
  
  const handleNewPlan = () => {
    setActivePlanId(null);
    setShowInputForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-planner-purple">Learning Planner</h1>
          
          {!showInputForm && (
            <Button 
              onClick={handleNewPlan}
              className="bg-planner-purple hover:bg-planner-purple-dark flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Plan
            </Button>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {showInputForm ? (
          <TopicInput onSubmit={handleCreatePlan} />
        ) : activePlan ? (
          <LearningPlan 
            plan={activePlan} 
            onUpdatePlan={handleUpdatePlan}
            onClose={handleClosePlan}
          />
        ) : (
          <PlanList 
            plans={plans} 
            onSelectPlan={handleSelectPlan} 
            onDeletePlan={handleDeletePlan}
            activePlanId={activePlanId || undefined}
          />
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-planner-gray">
            Learning Planner - Customize your educational journey
          </p>
        </div>
      </footer>
    </div>
  );
}
