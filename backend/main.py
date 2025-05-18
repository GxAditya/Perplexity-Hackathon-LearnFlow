from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from enum import Enum
import requests
import json
import os
import re
import logging
from datetime import datetime, timedelta
import uuid

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="LearnFlow Pathfinder API")

# Add CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Environment variables
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY", "")
PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions"

# Models
class LearningPreference(str, Enum):
    VIDEO = "video"
    TEXT = "text"
    PROJECT = "project"
    INTERACTIVE = "interactive"
    AUDIO = "audio"

class Resource(BaseModel):
    id: str
    title: str
    url: str
    type: str  # Using string instead of enum for compatibility with frontend
    description: str
    estimatedTime: int  # minutes
    completed: bool = False
    dueDate: Optional[str] = None
    rating: Optional[int] = None  # 1-5 rating after completion

class Milestone(BaseModel):
    id: str
    title: str
    description: str
    targetDate: str
    completed: bool = False
    resources: List[str]  # resource IDs

class TopicInputData(BaseModel):
    topic: str
    timeframe: int
    timeframeUnit: Literal["days", "weeks", "months"]
    knowledgeLevel: Literal["beginner", "intermediate", "advanced"]
    preferences: List[str]  # Using string instead of enum for compatibility with frontend
    studyTimePerDay: int

class LearningPlan(BaseModel):
    id: str
    title: str
    topic: str
    timeframe: int
    timeframeUnit: Literal["days", "weeks", "months"]
    knowledgeLevel: Literal["beginner", "intermediate", "advanced"]
    preferences: List[str]  # Using string instead of enum for compatibility with frontend
    studyTimePerDay: int
    resources: List[Resource]
    milestones: List[Milestone]
    createdAt: str
    updatedAt: str

# Helper functions
def generate_id() -> str:
    """Generate a unique ID"""
    return str(uuid.uuid4())[:15]

def distribute_resources_over_time(resources: List[Resource], start_date: datetime, end_date: datetime) -> List[Resource]:
    """Distribute resources over the timeframe"""
    total_days = (end_date - start_date).days
    days_per_resource = max(1, total_days // len(resources))
    
    distributed_resources = []
    for i, resource in enumerate(resources):
        due_date = start_date + timedelta(days=i * days_per_resource)
        
        # Make sure the last resources don't go past the end date
        if due_date > end_date:
            due_date = end_date
        
        resource_dict = resource.dict()
        resource_dict.pop("dueDate", None)
        distributed_resources.append(
            Resource(
                **resource_dict,
                dueDate=due_date.isoformat()
            )
        )
    
    return distributed_resources

def create_milestones(resources: List[Resource], start_date: datetime, end_date: datetime) -> List[Milestone]:
    """Create milestones based on resources and timeframe"""
    total_days = (end_date - start_date).days
    milestone_count = max(1, total_days // 7)  # One milestone per week approximately
    days_per_milestone = total_days // milestone_count
    
    milestones = []
    
    for i in range(milestone_count):
        milestone_date = start_date + timedelta(days=(i + 1) * days_per_milestone)
        
        # Get resources that should be completed by this milestone
        resources_for_milestone = []
        for resource in resources:
            if resource.dueDate:
                resource_date = datetime.fromisoformat(resource.dueDate)
                if resource_date <= milestone_date:
                    resources_for_milestone.append(resource)
        
        # Get up to 3 most recent resources
        resource_ids = [r.id for r in resources_for_milestone[-3:]] if resources_for_milestone else []
        
        milestones.append(
            Milestone(
                id=generate_id(),
                title=f"Milestone {i + 1}",
                description="Complete key resources and test your understanding",
                targetDate=milestone_date.isoformat(),
                completed=False,
                resources=resource_ids
            )
        )
    
    return milestones

# API endpoints
@app.post("/api/generate-plan", response_model=LearningPlan)
async def generate_plan(input_data: TopicInputData):
    """Generate a learning plan using Perplexity Sonar models"""
    global re
    if not PERPLEXITY_API_KEY:
        raise HTTPException(status_code=500, detail="Perplexity API key not configured")

    # Validate API key format
    if not re.match(r'^pplx-[A-Za-z0-9]{32,}$', PERPLEXITY_API_KEY):
        raise HTTPException(status_code=500, detail="Invalid Perplexity API key format")
    
    # Prepare the prompt for Perplexity API
    prompt = f"""
    Create a detailed learning plan for the topic: {input_data.topic}.
    
    User's knowledge level: {input_data.knowledgeLevel}
    Timeframe: {input_data.timeframe} {input_data.timeframeUnit}
    Learning preferences: {', '.join(input_data.preferences)}
    Study time per day: {input_data.studyTimePerDay} hours
    
    Please provide a structured learning plan with the following components:
    1. A list of 5-10 learning resources including:
       - Title
       - URL (can be fictional but realistic)
       - Type (matching user preferences: {', '.join(input_data.preferences)})
       - Description (1-2 sentences)
       - Estimated time to complete (in minutes)
    
    Format the response as a JSON object with the following structure:
    {{
      "resources": [
        {{
          "title": "Resource title",
          "url": "https://example.com/resource",
          "type": "one of: video, text, project, interactive, audio",
          "description": "Brief description of the resource",
          "estimatedTime": time_in_minutes
        }}
      ]
    }}
    """
    
    # Call Perplexity API
    try:
        response = requests.post(
            PERPLEXITY_API_URL,
            headers={
                "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "sonar",  # Changed to sonar for concise, JSON-only output
                "messages": [
                    {"role": "system", "content": "You are a helpful AI assistant that creates personalized learning plans."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 2000,
                "response_format": {
                    "type": "json_schema",
                    "json_schema": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "resources": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "title": {"type": "string"},
                                            "url": {"type": "string"},
                                            "type": {"type": "string"},
                                            "description": {"type": "string"},
                                            "estimatedTime": {"type": "integer"}
                                        },
                                        "required": ["title", "url", "type", "description", "estimatedTime"]
                                    }
                                }
                            },
                            "required": ["resources"]
                        }
                    }
                }
            }
        )
        
        response.raise_for_status()
        
        # Store raw response for debugging
        raw_response = response.text
        
        try:
            result = response.json()
        except json.JSONDecodeError:
            logger.error(f"Perplexity API returned invalid JSON: {raw_response}")
            raise HTTPException(status_code=502, detail="Invalid response format from AI provider")
        
        # Extract the content from the response
        content = result["choices"][0]["message"]["content"]
        
        # Parse the JSON from the content
        # Note: The content might include markdown or other text, so we need to extract just the JSON part
        plan_data = None
        
        # First attempt: Try to parse the entire content as JSON
        try:
            plan_data = json.loads(content)
            # Check if resources exist in the parsed data
            if "resources" not in plan_data:
                logger.error(f"No resources found in parsed JSON: {plan_data}")
                raise HTTPException(status_code=502, detail="No resources found in AI response")
        except json.JSONDecodeError as e:
            logger.info(f"Could not parse entire content as JSON, trying to extract JSON part. Error: {str(e)}")
            
            # Second attempt: Try to extract JSON using regex
            try:
                import re
                # Look for JSON pattern with more flexible matching
                json_match = re.search(r'\{[\s\S]*?"resources"[\s\S]*?\}', content)
                if json_match:
                    json_text = json_match.group(0)
                    # Remove any markdown code block markers
                    json_text = re.sub(r'```json|```', '', json_text)
                    # Fix common JSON formatting issues
                    json_text = json_text.replace("\'", "\"")  # Replace single quotes with double quotes
                    json_text = re.sub(r',\s*\}', '}', json_text)  # Remove trailing commas
                    
                    try:
                        plan_data = json.loads(json_text.strip())
                        if "resources" not in plan_data:
                            logger.error(f"No resources found in extracted JSON: {plan_data}")
                            raise HTTPException(status_code=502, detail="No resources found in AI response")
                    except json.JSONDecodeError as e2:
                        logger.error(f"Failed to parse extracted JSON. Error: {str(e2)}\nExtracted text: {json_text}")
                        raise HTTPException(status_code=502, detail=f"Failed to parse learning plan response: {str(e2)}")
                else:
                    logger.error(f"No JSON-like structure found in API response: {content}")
                    raise HTTPException(status_code=502, detail="No valid JSON structure found in AI response")
            except Exception as e:
                logger.error(f"Error during JSON extraction: {str(e)}\nFull content: {content}")
                raise HTTPException(status_code=502, detail=f"Error processing AI response: {str(e)}")
        
        if not plan_data:
            raise HTTPException(status_code=502, detail="Failed to extract valid data from AI response")
        
        # Calculate start and end dates
        start_date = datetime.now()
        end_date = start_date
        
        if input_data.timeframeUnit == "days":
            end_date += timedelta(days=input_data.timeframe)
        elif input_data.timeframeUnit == "weeks":
            end_date += timedelta(days=input_data.timeframe * 7)
        elif input_data.timeframeUnit == "months":
            # Approximate a month as 30 days
            end_date += timedelta(days=input_data.timeframe * 30)
        
        # Create resources with IDs
        resources = []
        for resource_data in plan_data.get("resources", []):
            resources.append(
                Resource(
                    id=generate_id(),
                    title=resource_data.get("title", "Untitled Resource"),
                    url=resource_data.get("url", "https://example.com"),
                    type=resource_data.get("type", input_data.preferences[0] if input_data.preferences else "text"),
                    description=resource_data.get("description", "No description provided"),
                    estimatedTime=resource_data.get("estimatedTime", 60),
                    completed=False
                )
            )
        
        # Distribute resources over time
        distributed_resources = distribute_resources_over_time(resources, start_date, end_date)
        
        # Create milestones
        milestones = create_milestones(distributed_resources, start_date, end_date)
        
        # Create the learning plan
        learning_plan = LearningPlan(
            id=generate_id(),
            title=f"{input_data.topic} Learning Plan",
            topic=input_data.topic,
            timeframe=input_data.timeframe,
            timeframeUnit=input_data.timeframeUnit,
            knowledgeLevel=input_data.knowledgeLevel,
            preferences=input_data.preferences,
            studyTimePerDay=input_data.studyTimePerDay,
            resources=distributed_resources,
            milestones=milestones,
            createdAt=datetime.now().isoformat(),
            updatedAt=datetime.now().isoformat()
        )
        
        return learning_plan
    
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error calling Perplexity API: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)