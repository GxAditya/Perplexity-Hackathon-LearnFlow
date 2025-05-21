# LearnFlow Pathfinder Planner

A personalized learning path generator that creates customized learning plans based on your topic of interest, timeframe, and learning preferences. Powered by Perplexity's Sonar models for intelligent, resource-rich learning plans.

---

## Features

- **Personalized Learning Plans:** Generate tailored learning paths for any topic.
- **Customizable Inputs:** Specify your knowledge level, timeframe, and learning preferences (video, text, projects, etc.).
- **Curated Free Resources:** Prioritizes open-access resources (YouTube, Medium, Wikipedia, etc.) for accessible learning.
- **Progress Tracking:** Track milestones, completion status, and save multiple plans.
- **Modern UI:** Built with React, Tailwind CSS, and shadcn-ui for a seamless experience.

---

## 🛠️ Tech Stack

- **Frontend:**
  - Vite
  - TypeScript
  - React
  - shadcn-ui
  - Tailwind CSS
- **Backend:**
  - FastAPI (Python)
- **AI Integration:**
  - Perplexity Sonar API (with domain filtering for free resources)

---

## ⚙️ How It Works

1. **User Input:**
   - Users enter their topic, timeframe, knowledge level, and learning preferences via the web UI.
2. **Backend Processing:**
   - The FastAPI backend receives the request and constructs a prompt for the Perplexity Sonar API.
   - The backend uses the `search_domain_filter` to prioritize free, high-quality resources (e.g., YouTube, Medium, Wikipedia, GitHub, freeCodeCamp).
   - The backend parses the AI's structured JSON response and enriches it with scheduling and milestone logic.
3. **Frontend Display:**
   - The frontend displays the personalized learning plan, resources, and milestones.
   - Users can track their progress and mark resources as complete.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Perplexity API key ([get one here](https://www.perplexity.ai/))

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
4. Add your Perplexity API key to `.env`:
   ```
   PERPLEXITY_API_KEY=your_api_key_here
   ```
5. Start the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   The backend will be available at [http://localhost:8000](http://localhost:8000)

### Frontend Setup

1. Navigate to the project root (if not already there):
   ```bash
   cd <YOUR_PROJECT_NAME>
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at [http://localhost:5173](http://localhost:5173) (default Vite port)

---

## 🌐 Free Resource Prioritization

This app leverages Perplexity's `search_domain_filter` to prioritize free, high-quality resources such as:
- YouTube
- Medium
- Wikipedia
- GitHub
- freeCodeCamp

You can customize the list of prioritized domains in the backend code for your needs.

---
# Future Improvements :
Switch to total WEb scrapping mode and maybe utilise google search or duck duck go search instead of a costly search ai api . 

