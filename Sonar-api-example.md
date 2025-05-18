# Example of a system prompt

You are a helpful AI assistant.

## Rules:
1. Provide only the final answer. It is important that you do not include any explanation on the steps below.
2. Do not show the intermediate steps information.

Steps:
1. Decide if the answer should be a brief sentence or a list of suggestions.
2. If it is a list of suggestions, first, write a brief and natural introduction based on the original query.
3. Followed by a list of suggestions, each suggestion should be split by two newlines.

# Parameter Optimization

- Adjust model parameters based on your specific needs:

   1. Search Domain Filter: Limit results to trusted sources for research-heavy queries.
   2. Search Context Size: Use “high” for comprehensive research questions and “low” for simple factual queries.

-  Example configuration for technical documentation:

{
  "search_domain_filter": ["wikipedia.org", "docs.python.org"],
  "web_search_options": {
    "search_context_size": "medium"
  }
}

# Search Domain Filter Guide

The search_domain_filter parameter allows you to control which websites are included in or excluded from the search results used by the Sonar models. This feature is particularly useful when you want to:

   - Restrict search results to trusted sources.
   - Filter out specific domains from search results.
   - Focus research on particular websites.

## Examples
​
1. Allowlist Specific Domains

This example shows how to limit search results to only include content from specific domains.

 Request:

import requests
url = "https://api.perplexity.ai/chat/completions"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
payload = {
    "model": "sonar-reasoning-pro",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Tell me about the James Webb Space Telescope discoveries."}
    ],
    "search_domain_filter": [
        "nasa.gov",
        "wikipedia.org",
        "space.com"
    ]
}
response = requests.post(url, headers=headers, json=payload).json()
print(response["choices"][0]["message"]["content"])



2. Denylist Specific Domains

This example shows how to exclude specific domains from search results by prefixing the domain name with a minus sign (-).

Request:

import requests

url = "https://api.perplexity.ai/chat/completions"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
payload = {
    "model": "sonar-deep-research",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What are the latest advancements in renewable energy?"}
    ],
    "search_domain_filter": [
        "-pinterest.com",
        "-reddit.com",
        "-quora.com"
    ]
}

response = requests.post(url, headers=headers, json=payload).json()
print(response["choices"][0]["message"]["content"])

# Best Practices
​
## Domain Specification

   - Use simple domain names: Specify domains in their simplest form (e.g., example.com) without protocol prefixes (http://, https://) or subdomain specifiers (www.).

   - Main domains only: Using the main domain (e.g., nytimes.com) will filter all subdomains as well.

​
## Filter Optimization

   - Be specific: Use domains that are most relevant to your query to get the best results.

   - Combine approaches: You can mix inclusion and exclusion in the same request (e.g., ["wikipedia.org", "-pinterest.com"]).

   - Limit filter size: Although you can add up to 10 domains, using fewer, more targeted domains often yields better results.

# Structured Outputs Guide

 JSON Schema

   - response_format: { type: "json_schema", json_schema: {"schema": object} } .

   - The schema should be a valid JSON schema object.


## Examples
​
1. Get a response in JSON format

Request:

import requests
from pydantic import BaseModel

class AnswerFormat(BaseModel):
    first_name: str
    last_name: str
    year_of_birth: int
    num_seasons_in_nba: int

url = "https://api.perplexity.ai/chat/completions"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
payload = {
    "model": "sonar",
    "messages": [
        {"role": "system", "content": "Be precise and concise."},
        {"role": "user", "content": (
            "Tell me about Michael Jordan. "
            "Please output a JSON object containing the following fields: "
            "first_name, last_name, year_of_birth, num_seasons_in_nba. "
        )},
    ],
    "response_format": {
		    "type": "json_schema",
        "json_schema": {"schema": AnswerFormat.model_json_schema()},
    },
}
response = requests.post(url, headers=headers, json=payload).json()
print(response["choices"][0]["message"]["content"])

Response:

{"first_name":"Michael","last_name":"Jordan","year_of_birth":1963,"num_seasons_in_nba":15}

## Best Practices
​
Generating responses in a JSON Format

For Python users, we recommend using the Pydantic library to generate JSON schema.

Unsupported JSON Schemas

Recursive JSON schema is not supported. As a result of that, unconstrained objects are not supported either. Here’s a few example of unsupported schemas:
Copy

# UNSUPPORTED!

from typing import Any

class UnconstrainedDict(BaseModel):
   unconstrained: dict[str, Any]

class RecursiveJson(BaseModel):
   value: str
   child: list["RecursiveJson"]


# Models 

1. Sonar Pro

An advanced search model designed for complex queries, delivering deeper content understanding with enhanced citation accuracy.

    Model Type: Non-reasoning
    Use Case: Suitable for multi-step Q&A tasks requiring deeper content understanding.
    Context Length: 200k

Key Features:

    In-depth answers with 2x more citations than Sonar
    Uses advanced information retrieval architecture
    Optimized for multi-step tasks

Real-World Examples:

    Conducting academic literature reviews
    Researching competitors and industry trends
    Generating restaurant catalogs with reviews

- sonar-pro has a max output token limit of 8k.

## Examples :
curl --request POST \
  --url https://api.perplexity.ai/chat/completions \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "model": "sonar-pro",
  "messages": [
    {"role": "user", "content": "Summarize the latest research papers on climate change."}
  ],
  "max_tokens": 300
}'

Sample Response:

{'
  id': 'f9f96801-2e7f-4400-b0e9-f2cf8cf9ac4d', 
  'model': 'sonar-pro', 
  'created': 1743529048, 
  'usage': {'prompt_tokens': 11, 'completion_tokens': 401, 'total_tokens': 412, 'citation_tokens': 5149, 'num_search_queries': 1}, 
  'citations': ['https://www.wri.org/insights/2023-ipcc-ar6-synthesis-report-climate-change-findings', 'https://www.ipcc.ch/report/ar6/wg1/', 'https://www.ipcc.ch/report/ar6/syr/downloads/report/IPCC_AR6_SYR_SPM.pdf', 'https://science.nasa.gov/climate-change/scientific-consensus/', 'https://science.nasa.gov/climate-change/effects/', 'https://10insightsclimate.science', 'https://www.noaa.gov/education/resource-collections/climate/climate-change-impacts', 'https://academic.oup.com/bioscience/article/74/12/812/7808595', 'https://www.un.org/en/climatechange/reports'], 
  'object': 'chat.completion', 
  'choices': [{'index': 0, 'finish_reason': 'stop', 'message': {'role': 'assistant', 'content': "Recent research on climate change has yielded several important findings:\n\n## Key Findings\n\n1. Global warming continues to accelerate. The Earth's surface temperature was 1.09°C higher in 2011-2020 compared to 1850-1900, with larger increases over land than oceans[1][3].\n\n2. Human activities are the dominant cause of observed warming since the mid-20th century. Greenhouse gas emissions from fossil fuels, land use changes, and unsustainable consumption patterns are primary drivers[1][3].\n\n3. Climate impacts are intensifying. Effects like sea ice loss, glacial melting, sea level rise, and more frequent extreme weather events are occurring faster than previously projected[5].\n\n4. Urgent action is needed. To limit warming to 1.5°C, global emissions must peak before 2025 and decline 43% by 2030 relative to 2019 levels[1].\n\n5. Systemic transformations are required across sectors including energy, buildings, industry, transport, and land use to achieve net-zero emissions[1].\n\n## Recent Developments\n\n- Summer 2023 was Earth's hottest on record, 1.2°C warmer than the 1951-1980 average[5].\n\n- The Arctic is likely to become ice-free in late summer before mid-century if current trends continue[5].\n\n- Wildfire seasons are lengthening and intensifying, especially in the Western United States[5].\n\n- Precipitation patterns are changing unevenly, with some regions experiencing increased flooding while others face more severe droughts[5].\n\n## Scientific Consensus\n\nMultiple studies show that 97% of climate scientists agree that recent climate change is primarily caused by human activities[4]. Leading scientific organizations worldwide have issued statements endorsing this position[4].\n\nThe evidence is clear that climate change poses significant risks to human wellbeing and planetary health. Rapid, concerted global action is necessary to secure a livable future and avoid the worst projected impacts[5]."}, 'delta': {'role': 'assistant', 'content': ''}}]
}

2. sonar-reasoning

- Fast, real-time reasoning model designed for quick problem-solving with search.

- Excellent for complex analyses requiring step-by-step thinking, tasks needing strict adherence to instructions, information synthesis across sources, and logical problem-solving that demands informed recommendations.

- Not recommended for simple factual queries, basic information retrieval, exhaustive research projects (use Research models instead), or when speed takes priority over reasoning quality.

## Examples 

Request:

import requests

url = "https://api.perplexity.ai/chat/completions"

payload = {
    "model": "sonar-reasoning",
    "messages": [
        {"role": "user", "content": "Provide an in-depth analysis of the impact of AI on global job markets over the next decade."}
    ],
    "max_tokens": 500
}
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())


Sample Response Metadata:

{
  'id': 'b3505b4b-cafb-43f1-a905-97a665f28406', 
  'model': 'sonar-reasoning', 
  'created': 1743529637, 
  'usage': {'prompt_tokens': 19, 'completion_tokens': 1793, 'total_tokens': 1812}, 
  'citations': ['https://www.sandtech.com/insight/ai-and-the-future-of-work/', 'https://www.nexford.edu/insights/how-will-ai-affect-jobs', 'https://onlinedegrees.sandiego.edu/ai-impact-on-job-market/', 'https://institute.global/insights/economic-prosperity/the-impact-of-ai-on-the-labour-market', 'https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america'], 
  'object': 'chat.completion', 'choices': [{'index': 0, 'finish_reason': 'stop', 'message': {'role': 'assistant', 
  'content': "<think>\nOkay, I need to tackle this query about the impact of AI on global job markets over the next decade. Let me start by going through the search results provided.\n\nFirst, the World Economic Forum's Future of Jobs Report 2025 is mentioned in [1]. It says that technology, especially AI, will be the most disruptive force. They predict 19 million new jobs created and 9 million displaced by 2030. That's a net gain, which is interesting. Also, there's a shift in skills, with AI-driven data analysis, cybersecurity, and technological literacy becoming top skills. Human-machine collaboration is expected to be the norm by 2030, with tasks split more evenly between humans, machines, and hybrid approaches. \n\nLooking at [2], there's a mention of Goldman Sachs predicting 300 million full-time jobs could be impacted, with two-thirds in the US and Europe exposed to AI automation. However, it also highlights economic growth potential, like McKinsey's estimate of $13 trillion added by 2030. They note that while some jobs might be lost, new ones are created, such as in AI-related fields. Sectors like finance, media, legal, and manufacturing are at higher risk of automation.\n\nResult [3] from Sandiego's online degrees page discusses both displacement and creation. It mentions sectors like finance, media, legal, and manufacturing as high-risk but also lists jobs less likely to be replaced, like teachers, nurses, and artists. New roles like AI prompt engineer and ethicist are emerging. They also touch on AI in hiring, both advantages (efficiency, unbiased screening) and challenges (potential biases).\n\nThe Tony Blair Institute's analysis in [4] breaks down the impact into labor demand, labor supply, and workplace experience. They mention that AI could increase productivity, create new markets, and improve labor market efficiency. Their scenarios show possible job displacement but also accelerated new job creation through innovation. They reference Goldman Sachs and IMF projections of increased GDP growth.\n\nMcKinsey's report in [5] focuses on the US but has global implications. They adjust their automation estimates upward to 29.5% of tasks automated by 2030 due to generative AI. They emphasize occupational shifts rather than net job loss, with 12 million more shifts expected. Sectors like STEM, creative arts, and education are poised for growth alongside AI adoption.\n\nPutting this together, the impact is multifaceted. There's job displacement, especially in repetitive tasks across various sectors, but also significant job creation. The key seems to be the shift towards skills that complement AI, like analytical thinking, adaptability, and technical proficiencies. New roles are emerging in AI development, ethics, and management. The economic boost from productivity gains and new industries could offset job losses, but there's a need for upskilling and reskilling, particularly in lower-income economies that might adopt AI slower.\n\nI need to structure this analysis into sections. Maybe start with net job creation vs displacement, then sectoral impacts, required skill shifts, new job categories, economic implications, and equity concerns. Each section should cite the relevant sources. Make sure to highlight the balance between disruption and opportunity, emphasizing adaptation and human-AI collaboration as crucial for future workforce strategies.\n</think>\n\n## Impact of AI on Global Job Markets (2024–2034)  \n\nThe integration of AI into global workforces will reshapes labor dynamics through **job displacement, skill evolution, and new economic opportunities**. Below is a structured analysis of key trends and implications.  \n\n---\n\n### **Net Job Creation vs. Displacement**  \nWhile AI could automate tasks equivalent to **300 million full-time jobs globally** by 2030[2], it is projected to create **19 million new roles** and enhance productivity for existing workers[1]. For instance, the World Economic Forum forecasts a net gain of **10 million jobs** by 2030 due to AI-driven efficiencies and emerging sectors[1]. However, displacement risks vary by sector, with repetitive tasks (e.g., manufacturing, clerical work) facing higher automation potential[3][5].  \n\n---\n\n### **Sectoral Disruption**  \n| **High-Risk Sectors**       | **Resilient Sectors**       |  \n|------------------------------|-------------------------------|  \n| **Finance/Banking**: Automated fraud detection, data analysis[3] | **Healthcare**: Nurses, therapists (require empathy)[3] |  \n| **Manufacturing**: Warehouse automation, assembly line robots[3] | **Education**: Teachers, workforce trainers[1][5] |  \n| **Legal Services**: Document review, legal research[3] | **Creative Arts**: Writers, artists (human creativity)[3] |  \n| **Transportation**: Autonomous vehicles replacing drivers[3] | **STEM Fields**: Roles in AI development, cybersecurity[1][5] |  \n\nGenerative AI (GenAI) accelerates automation in knowledge-based sectors, with tasks accounting for **29.5% of U.S. work hours** potentially automated by 2030[5].  \n\n---\n\n### **Skill Evolution and Workforce Priorities**  \nThe balance between **automation** and **augmentation** will redefine workplace strategies:  \n- **Fast-Growing Skills**: AI-driven data analysis, cybersecurity, and technological literacy will become critical[1][3]. Employers now prioritize candidates with **analytical thinking** and **adaptability** to collaborate with AI tools[1].  \n- **Human-AI Collaboration**: By 2030, **47% of tasks** are projected to involve hybrid human-machine efforts, up from 30% today[1]. This necessitates workforce training to leverage AI as an enhancer, not a replacement[1][4].  \n- **Core Competencies**: **Resilience, curiosity, and lifelong learning** will complement technical skills to address complex, data-driven challenges[1][3].  \n\n---\n\n### **New Job Categories and Economic Growth**  \nAI is driving demand for roles focused on **development, ethics, and governance**:  \n1. **AI-Specific Roles**:  \n   - **Prompt Engineers**: Design optimized interactions with AI systems.  \n   - **AI Ethicists**: Ensure responsible deployment and bias mitigation[3].  \n   - **AI Trainers/Auditors**: Refine model performance and compliance[3].  \n2. **Economic Opportunities**:  \n   - McKinsey estimates AI could add **$13 trillion to global GDP** by 2030, driven by productivity gains[2].  \n   - Generative AI could spur **new industries** in content creation, personalized education, and automated healthcare diagnostics[5].  \n\n---\n\n### **Equity and Structural Challenges**  \n- **Regional Divide**: Advanced economies will adopt AI faster than low-income regions, risking employment disparities[1][4].  \n- **Gender and Demographic Shifts**: Women may face higher early-automation risks (e.g., clerical roles), while men could later lose jobs in manual sectors like logistics[2].  \n- **Bias Risks**: AI-driven hiring tools must address algorithmic biases to ensure fairness in recruitment[3].  \n\n---\n\n### **Strategic Recommendations**  \n1. **Upskilling Programs**: Focus on cross-functional training in **data literacy** and **critical thinking** to complement AI tools[1][4].  \n2. **Policy Frameworks**: Governments must incentivize AI innovation while safeguarding labor rights (e.g., retraining support, universal basic income pilots)[4].  \n3. **Corporate Adaptation**: Prioritize roles integrating human ingenuity with AI, such as hybrid task design and ethical oversight[1][5].  \n\n---\n\n### **Projections and Scenarios**  \n| **Scenario**            | **Impact**                                                                 |  \n|--------------------------|-----------------------------------------------------------------------------|  \n| **Accelerated Adoption** | Rapid automation displaces jobs but triggers innovation-driven net gains[4]. |  \n| **Steady Growth**        | Gradual AI integration balances displacement with new roles (e.g., AI management specialists)[5]. |  \n| **Inequitable Use**      | Widens gaps between high- and low-income economies, exacerbating unemployment volatility[1][2]. |  \n\nTony Blair Institute models suggest that unemployment peaks could be mitigated if new roles emerge within **3–5 years** of displacement[4].  \n\n---\n\n### **Conclusion**  \nAI will redefine global workforces, requiring proactive adaptation. While **30–40% of global employment** faces disruption[2][4], the potential for economic growth and job creation hinges on aligning AI adoption with human-centric skills and ethical frameworks. Prioritizing **lifelong learning**, **hybrid human-AI collaboration**, and **equitable policies** will determine whether AI becomes a force for inclusive prosperity."}, 
  'delta': {'role': 'assistant', 'content': ''}}]
}

# API Reference

Perplexity API
Chat Completions

Generates a model’s response for the given chat conversation.
POST/chat/completions
Authorizations
​
Authorization string header required

Bearer authentication header of the form Bearer <token>, where <token> is your auth token.
Body
application/json
​
model string required

The name of the model that will complete your prompt. Refer to Supported Models to find all the models offered.
Example:

"sonar"
​
messages object[] required

A list of messages comprising the conversation so far.
Example:

[
  {
    "role": "system",
    "content": "Be precise and concise."
  },
  {
    "role": "user",
    "content": "How many stars are there in our galaxy?"
  }
]

​
max_tokens integer

The maximum number of completion tokens returned by the API. Controls the length of the model's response. If the response would exceed this limit, it will be truncated. Higher values allow for longer responses but may increase processing time and costs.
​
temperature number default:0.2

The amount of randomness in the response, valued between 0 and 2. Lower values (e.g., 0.1) make the output more focused, deterministic, and less creative. Higher values (e.g., 1.5) make the output more random and creative. Use lower values for factual/information retrieval tasks and higher values for creative applications.
Required range: 0 <= x < 2
​
top_p number default:0.9

The nucleus sampling threshold, valued between 0 and 1. Controls the diversity of generated text by considering only the tokens whose cumulative probability exceeds the top_p value. Lower values (e.g., 0.5) make the output more focused and deterministic, while higher values (e.g., 0.95) allow for more diverse outputs. Often used as an alternative to temperature.
​
search_domain_filter any[]

A list of domains to limit search results to. Currently limited to 10 domains for Allowlisting and Denylisting. For Denylisting, add a - at the beginning of the domain string. More information about this here.
​
return_images boolean default:false

Determines whether search results should include images.
​
return_related_questions boolean default:false

Determines whether related questions should be returned.
​
search_recency_filter string

Filters search results based on time (e.g., 'week', 'day').
​
top_k number default:0

The number of tokens to keep for top-k filtering. Limits the model to consider only the k most likely next tokens at each step. Lower values (e.g., 10) make the output more focused and deterministic, while higher values allow for more diverse outputs. A value of 0 disables this filter. Often used in conjunction with top_p to control output randomness.
​
stream boolean default:false

Determines whether to stream the response incrementally.
​
presence_penalty number default:0

Positive values increase the likelihood of discussing new topics. Applies a penalty to tokens that have already appeared in the text, encouraging the model to talk about new concepts. Values typically range from 0 (no penalty) to 2.0 (strong penalty). Higher values reduce repetition but may lead to more off-topic text.
​
frequency_penalty number default:1

Decreases likelihood of repetition based on prior frequency. Applies a penalty to tokens based on how frequently they've appeared in the text so far. Values typically range from 0 (no penalty) to 2.0 (strong penalty). Higher values (e.g., 1.5) reduce repetition of the same words and phrases. Useful for preventing the model from getting stuck in loops.
​
response_format object

Enables structured JSON output formatting.
​
web_search_options object

Configuration for using web search in model responses.
Example:

{ "search_context_size": "high" }

Response 200 application/json

OK

The response is of type any.



### Code 

import requests

url = "https://api.perplexity.ai/chat/completions"

payload = {
    "model": "sonar",
    "messages": [
        {
            "role": "system",
            "content": "Be precise and concise."
        },
        {
            "role": "user",
            "content": "How many stars are there in our galaxy?"
        }
    ]
}
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

response = requests.request("POST", url, json=payload, headers=headers)

print(response.text)


# Sonar Model

Request:

import requests

url = "https://api.perplexity.ai/chat/completions"

payload = {
    "model": "sonar",
    "messages": [
        {"role": "user", "content": "What is the latest news in AI research?"}
    ],
    "max_tokens": 200
}
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())



Response :

{
  'id': 'ad748e84-a4bb-4665-afc9-40aac3b39e3c', 
  'model': 'sonar', 
  'created': 1743529296, 
  'usage': {'prompt_tokens': 9, 'completion_tokens': 384, 'total_tokens': 393}, 'citations': ['https://news.mit.edu/topic/artificial-intelligence2', 'https://www.sciencedaily.com/news/computers_math/artificial_intelligence/', 'https://aiweekly.co', 'https://techcrunch.com/category/artificial-intelligence/', 'https://www.artificialintelligence-news.com'], 'object': 'chat.completion', 'choices': [{'index': 0, 'finish_reason': 'stop', 'message': {'role': 'assistant', 
  'content': "Here are some of the latest developments in AI research:\n\n## Recent AI Research Developments\n\n### 1. **Improved AI Image Generation**\n- **MIT Research**: An AI tool has been developed that combines two popular methods to generate high-quality images faster and more efficiently than current state-of-the-art approaches. This tool can run locally on devices like laptops and smartphones, using less energy[1].\n\n### 2. **Enhanced Autonomous Learning**\n- **Torque Clustering Algorithm**: Researchers have introduced a new AI algorithm called Torque Clustering, which significantly enhances autonomous learning and pattern discovery in AI systems, requiring minimal human intervention[2].\n\n### 3. **Cyborg Insects Navigation**\n- **Autonomous Navigation**: A research team has developed two new autonomous navigation systems for cyborg insects, enabling them to better navigate through unknown environments using simple circuits[2].\n\n### 4. **AI in Smart Home Security**\n- **AIoT Framework**: Scientists have developed a new AIoT framework, MSF-Net, to enhance smart home security by integrating AI with IoT technology and WiFi, providing robust security solutions[2].\n\n### 5. **Advancements in Large Language Models**\n- **Reasoning Capabilities**: Studies have shown that large language models reason about diverse data types in a general way, similar to human brains, indicating advanced capabilities in handling complex information[2].\n\n### 6. **Regulatory Frameworks for AI**\n- **European AI Act**: The European Union is working on regulatory models like the AI Act to ensure ethical and safe AI use, particularly in data centers, addressing environmental impacts[3].\n\n### 7. **OpenAI Leadership Changes**\n- **Executive Shifts**: OpenAI has reshuffled its leadership, with CEO Sam Altman focusing more on technical aspects while expanding COO Brad Lightcap's responsibilities, signaling strategic adjustments in the company's direction[3]."}, 
  'delta': {'role': 'assistant', 'content': ''}}]
}