import subprocess
import time
import schedule

def run_command(command, cwd=None):
    process = subprocess.Popen(command, cwd=cwd, shell=True)
    process.wait()

def csvmaker_process():
    # Assuming csvMaker.py is the script to run
    run_command("python csvMaker.py")

# Command to install Python dependencies
python_install_command = "pip install -r requirements.txt"

# Install Python dependencies
run_command(python_install_command)

# Commands to install dependencies
frontend_install_command = "npm install"
backend_install_command = "npm install"

# Run npm install in frontend and backend
run_command(frontend_install_command, cwd="frontend")
run_command(backend_install_command, cwd="backend")

# Commands to start the processes
frontend_command = "npm run start"
backend_command = "npm run start"

# Start the processes concurrently
frontend_process = subprocess.Popen(frontend_command, cwd="frontend", shell=True)
backend_process = subprocess.Popen(backend_command, cwd="backend", shell=True)

try:
    # Run csvmaker_process once before entering the loop
    csvmaker_process()
except KeyboardInterrupt:
    # Terminate all processes if the script is interrupted
    frontend_process.terminate()
    backend_process.terminate()