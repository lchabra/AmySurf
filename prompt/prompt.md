# Guides

## GitHub Copilot

https://docs.github.com/en/copilot/using-github-copilot/ai-models/choosing-the-right-ai-model-for-your-task

- For balance between cost and performance:
  - GPT-4.1
  - Claude 3.7 Sonnet.
- For fast, low-cost support for basic tasks:

  - o4-mini
  - Claude 3.5 Sonnet

- For deep reasoning or complex coding challenges:

  - o3
  - GPT-4.5
  - Claude 3.7 Sonnet

- For multimodal inputs and real-time performance:
  - Gemini 2.0 Flash
  - GPT-4o

# Prompts

## ASK README.md General:

What prompt should I use to generate a README file similar to the one provided, including sections like project overview, prerequisites, setup instructions, development and production deployment, API examples, and project structure?
write this prompt in markdown format.

## Generate README.md, Model: GPT-4o

Generate a comprehensive README file for a project. Include the following sections:

1. **Project Overview**: Briefly describe the project, its purpose, and key features.
2. **Prerequisites**: List the tools and dependencies required to set up the project.
3. **Setup Instructions**: Provide step-by-step instructions for setting up the development environment, including backend and frontend setup.
4. **Running the Application**: Explain how to run the application in development mode, including any necessary configurations.
5. **Production Deployment**: Detail the steps for deploying the application in a production environment using Docker or other tools.
6. **API Examples**: Provide example API endpoints and their usage.
7. **Project Structure**: Outline the directory structure of the project with brief descriptions of key folders.
8. **License**: Include licensing information for the project.

Ensure the README is clear, well-structured, and includes code snippets where necessary.

## Generate README.md, Model: Claude 3.7 Sonnet

Create a comprehensive README.md file for my project named [Project Name]. The README should follow this structure:

1. **Project Overview**

   - Brief description of what the project does
   - Key features (3-5 bullet points)
   - Main components/architecture

2. **Prerequisites**

   - Required software with version requirements
   - Required accounts or API keys
   - Hardware requirements (if applicable)

3. **Setup Instructions**

   - Repository cloning instructions
   - Environment setup steps (including .env file creation)
   - Package installation commands
   - Configuration steps

4. **Running the Application**

   - **Development Mode**
     - Steps to run locally
     - VS Code configuration (.vscode folder setup)
     - Testing endpoints or functionality
   - **Production Deployment**
     - Docker setup instructions
     - Build and deployment commands
     - Startup/shutdown procedures
     - Helper commands/scripts

5. **API Examples**

   - List of key API endpoints with example URLs
   - Expected responses (briefly)

6. **Project Structure**

   - Directory tree showing main folders and files
   - Brief description of each component

7. **License**
   - License type and brief explanation

Format the README with proper Markdown, including:

- Code blocks with bash/json syntax highlighting
- Clear section headers with appropriate heading levels
- Consistent formatting throughout

The README should be user-friendly, assuming the reader has basic technical knowledge but needs clear instructions to get started with the project.

## Generate README.md, Model: Another AI
