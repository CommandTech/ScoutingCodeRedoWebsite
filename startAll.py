import subprocess
import schedule
import time
import configparser

# Read configuration
config = configparser.ConfigParser()
config.read('config.ini')
sleep_time = int(config['StartAll']['sleep_time'])

# Function to run shell commands
def run_command(command, cwd=None):
    process = subprocess.Popen(command, shell=True, cwd=cwd)
    process.wait()
    return process

# Function to be scheduled
def csvmaker_process():
    # Your csvmaker_process implementation here
    pass

# Schedule the csvmaker_process to run every minute
schedule.every(1).minute.do(csvmaker_process)

if __name__ == "__main__":
    # Install Python dependencies
    python_install_command = "pip install -r requirements.txt"
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

        # Keep the script running while the subprocesses are running
        while True:
            schedule.run_pending()
            time.sleep(sleep_time)
    except KeyboardInterrupt:
        # Terminate all processes if the script is interrupted
        frontend_process.terminate()
        backend_process.terminate()