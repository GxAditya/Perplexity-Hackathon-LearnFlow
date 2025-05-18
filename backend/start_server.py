import os
import sys
import socket
import re
import subprocess
from pathlib import Path
from typing import Tuple, Optional

def check_requirements():
    """Check if all required packages are installed"""
    required_packages = ["fastapi", "uvicorn", "pydantic", "requests", "python-dotenv"]
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == "python-dotenv":
                import dotenv
            else:
                __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("Missing dependencies:")
        for package in missing_packages:
            print(f"  - {package}")
        print("\nPlease install required packages with: pip install -r requirements.txt")
        return False
    
    return True

def is_valid_api_key(api_key: str) -> bool:
    """Check if the API key format is valid"""
    # Most API keys are alphanumeric and may include some special characters
    # This is a basic check - adjust based on Perplexity's actual key format
    if api_key == "your_api_key_here" or not api_key:
        return False
    
    # Basic format check (alphanumeric with possible special chars, reasonable length)
    if len(api_key) < 10:  # Most API keys are longer than 10 characters
        return False
    
    # Check if it contains at least some alphanumeric characters
    if not re.search(r'[a-zA-Z0-9]', api_key):
        return False
    
    return True

def check_env_file() -> Tuple[bool, Optional[str]]:
    """Check if .env file exists and contains a valid API key
    
    Returns:
        Tuple[bool, Optional[str]]: (is_valid, api_key)
    """
    env_path = Path(".env")
    api_key = None
    
    if not env_path.exists():
        print(".env file not found. Creating from example...")
        example_path = Path(".env.example")
        if example_path.exists():
            with open(example_path, "r") as example_file:
                example_content = example_file.read()
            
            with open(env_path, "w") as env_file:
                env_file.write(example_content)
            
            print(".env file created. Please edit it to add your Perplexity API key.")
            print("Example: PERPLEXITY_API_KEY=your_api_key_here")
            return False, None
        else:
            print(".env.example file not found. Creating basic .env file...")
            with open(env_path, "w") as env_file:
                env_file.write("# Perplexity API Key\nPERPLEXITY_API_KEY=your_api_key_here\n")
            print(".env file created. Please edit it to add your Perplexity API key.")
            return False, None
    
    # Check if API key is set and valid
    try:
        from dotenv import load_dotenv
        load_dotenv(env_path)
        api_key = os.getenv("PERPLEXITY_API_KEY")
        
        if not api_key or not is_valid_api_key(api_key):
            print("Warning: Perplexity API key not set or appears invalid in .env file.")
            print("Please edit the .env file to add your API key.")
            return False, api_key
        
        return True, api_key
    except Exception as e:
        print(f"Error loading .env file: {e}")
        return False, None

def check_port_available(port: int) -> bool:
    """Check if the specified port is available"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("127.0.0.1", port))
            return True
        except socket.error:
            return False

def find_available_port(start_port: int = 8000, max_attempts: int = 10) -> int:
    """Find an available port starting from start_port"""
    port = start_port
    for _ in range(max_attempts):
        if check_port_available(port):
            return port
        port += 1
    return start_port  # Return the original port if no available ports found

def main():
    """Main function to start the server"""
    print("Starting LearnFlow Pathfinder Backend...")
    
    # Check requirements
    if not check_requirements():
        user_input = input("Do you want to install the required packages? (y/n): ")
        if user_input.lower() == "y":
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
                print("Dependencies installed successfully.")
            except subprocess.CalledProcessError as e:
                print(f"Error installing dependencies: {e}")
                return
        else:
            print("Exiting. Please install the required packages and try again.")
            return
    
    # Check .env file
    env_valid, api_key = check_env_file()
    if not env_valid:
        user_input = input("Do you want to continue anyway? (y/n): ")
        if user_input.lower() != "y":
            print("Exiting. Please set up your environment and try again.")
            return
    
    # Check if port 8000 is available
    default_port = 8000
    if not check_port_available(default_port):
        available_port = find_available_port(default_port)
        if available_port != default_port:
            print(f"Port {default_port} is already in use. Using port {available_port} instead.")
            port = available_port
        else:
            print(f"Warning: Port {default_port} is already in use and no alternative ports are available.")
            user_input = input("Do you want to try to start the server anyway? (y/n): ")
            if user_input.lower() != "y":
                print("Exiting. Please free up the port and try again.")
                return
            port = default_port
    else:
        port = default_port
    
    # Start the server
    print(f"Starting FastAPI server on port {port}...")
    try:
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
    except Exception as e:
        print(f"Error starting server: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure no other application is using the port")
        print("2. Check that your Perplexity API key is valid")
        print("3. Ensure you have the latest version of the required packages")

if __name__ == "__main__":
    main()