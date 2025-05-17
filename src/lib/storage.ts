
import { toast } from "sonner";
import { LearningPlan } from "./types";

const STORAGE_KEY = 'learning-planner-data';

export function getPlans(): LearningPlan[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return [];
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Failed to get plans from storage:", error);
    toast.error("Failed to load your saved plans");
    return [];
  }
}

export function savePlan(plan: LearningPlan): boolean {
  try {
    const existingPlans = getPlans();
    const existingIndex = existingPlans.findIndex(p => p.id === plan.id);
    
    if (existingIndex >= 0) {
      // Update existing plan
      existingPlans[existingIndex] = {
        ...plan,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new plan
      existingPlans.push({
        ...plan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingPlans));
    return true;
  } catch (error) {
    console.error("Failed to save plan:", error);
    toast.error("Failed to save your learning plan");
    return false;
  }
}

export function deletePlan(planId: string): boolean {
  try {
    const existingPlans = getPlans();
    const updatedPlans = existingPlans.filter(plan => plan.id !== planId);
    
    if (existingPlans.length === updatedPlans.length) {
      // Plan wasn't found
      return false;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
    return true;
  } catch (error) {
    console.error("Failed to delete plan:", error);
    toast.error("Failed to delete your learning plan");
    return false;
  }
}

export function getPlan(planId: string): LearningPlan | null {
  try {
    const existingPlans = getPlans();
    return existingPlans.find(plan => plan.id === planId) || null;
  } catch (error) {
    console.error("Failed to get plan:", error);
    toast.error("Failed to load your learning plan");
    return null;
  }
}
