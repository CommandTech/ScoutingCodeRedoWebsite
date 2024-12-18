import subprocess

def run_command(command):
    process = subprocess.Popen(command, shell=True)
    process.wait()

def start_process(command):
    return subprocess.Popen(command, shell=True)

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
    csvmaker_command = "python csvmaker.py"

    # Start the processes
    frontend_process = start_process(frontend_command)
    backend_process = start_process(backend_command)
    csvmaker_process = start_process(csvmaker_command)

    try:
        # Keep the script running while the subprocesses are running
        frontend_process.wait()
        backend_process.wait()
        csvmaker_process.wait()
    except KeyboardInterrupt:
        # Terminate all processes if the script is interrupted
        frontend_process.terminate()
        backend_process.terminate()
        csvmaker_process.terminate()