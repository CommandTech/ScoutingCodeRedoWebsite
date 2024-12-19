import schedule
import time
import subprocess

def run_command(command):
    process = subprocess.Popen(command, shell=True)
    return process

def csvmaker_process():
    # Run the csvMaker.py script
    csvmaker_command = "python csvMaker.py"
    run_command(csvmaker_command)
    print("Running csvmaker_process...")

# Schedule the csvmaker_process to run every minute
schedule.every(1).minute.do(csvmaker_process)

if __name__ == "__main__":
    # Commands to install dependencies
    frontend_install_command = "npm install --prefix frontend"
    backend_install_command = "npm install --prefix backend"

    # Run npm install in frontend and backend
    run_command(frontend_install_command)
    run_command(backend_install_command)

    # Commands to start the processes
    frontend_command = "npm run start --prefix frontend"
    backend_command = "npm run start --prefix backend"

    # Start the processes
    frontend_process = run_command(frontend_command)
    backend_process = run_command(backend_command)

    try:
        # Run csvmaker_process once before entering the loop
        csvmaker_process()

        # Keep the script running while the subprocesses are running
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        # Terminate all processes if the script is interrupted
        frontend_process.terminate()
        backend_process.terminate()