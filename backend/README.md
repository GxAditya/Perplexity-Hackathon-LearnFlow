# LearnFlow Pathfinder Backend

This is the FastAPI backend for the LearnFlow Pathfinder application. It integrates with Perplexity's Sonar models to generate personalized learning plans based on user input.

## Setup

### Prerequisites

- Python 3.8 or higher
- Perplexity API key (get one from [Perplexity AI](https://www.perplexity.ai/))

### Installation

1. Install the required dependencies:

```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the backend directory by copying the `.env.example` file:

```bash
cp .env.example .env
```

3. Edit the `.env` file and add your Perplexity API key:

```
PERPLEXITY_API_KEY=your_api_key_here
```

## Running the Server

Start the FastAPI server with the following command:

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will be available at http://localhost:8000

## API Endpoints

### Generate Learning Plan

- **URL**: `/api/generate-plan`
- **Method**: `POST`
- **Description**: Generates a personalized learning plan based on user input
- **Request Body**: JSON object with the following fields:
  - `topic`: The learning topic
  - `timeframe`: The number of time units
  - `timeframeUnit`: The time unit ("days", "weeks", or "months")
  - `knowledgeLevel`: The user's knowledge level ("beginner", "intermediate", or "advanced")
  - `preferences`: Array of learning preferences ("video", "text", "project", "interactive", "audio")
  - `studyTimePerDay`: Hours of study time per day

### Health Check

- **URL**: `/api/health`
- **Method**: `GET`
- **Description**: Checks if the API server is running

## Integration with Frontend

The frontend communicates with this backend through the API service defined in `src/lib/api.ts`. Make sure the API base URL in that file matches the URL where your FastAPI server is running.

## How It Works

The backend uses Perplexity's Sonar Reasoning model to generate personalized learning resources based on the user's input. It then structures these resources into a learning plan with distributed resources and milestones over the specified timeframe.