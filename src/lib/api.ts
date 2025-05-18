import { LearningPlan, TopicInputData } from "./types";

// API base URL - change this to match your FastAPI server
const API_BASE_URL = "http://localhost:8000/api";

/**
 * Generate a learning plan using the FastAPI backend
 * @param inputData User input data for generating a plan
 * @returns The generated learning plan
 */
export async function generatePlanFromAPI(inputData: TopicInputData): Promise<LearningPlan> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error generating learning plan:", errorData); // Log full error data
      throw new Error(errorData.detail || "Failed to generate learning plan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating learning plan:", error);
    throw error;
  }
}

/**
 * Check the health of the API server
 * @returns A boolean indicating if the API server is healthy
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
}