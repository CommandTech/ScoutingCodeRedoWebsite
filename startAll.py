import subprocess

def start_process(command):
    return subprocess.Popen(command, shell=True)

if __name__ == "__main__":
    frontend_command = "npm run start --prefix frontend"  # Example command to start the frontend
    backend_command = "npm run start --prefix backend"    # Example command to start the backend
    csvmaker_command = "python csvmaker.py"               # Command to start csvmaker.py

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