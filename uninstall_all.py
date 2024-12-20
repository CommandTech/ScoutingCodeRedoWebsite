import subprocess

# Read the requirements.txt file
with open('requirements.txt', 'r') as file:
    packages = file.readlines()

# Uninstall each package listed in requirements.txt
for package in packages:
    package_name = package.strip().split('==')[0]  # Get the package name without version
    subprocess.call(['pip', 'uninstall', '-y', package_name])