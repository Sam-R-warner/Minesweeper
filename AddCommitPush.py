import subprocess

print("Add Commit Push")
print("Executing \"git status\":")
print("")

# Run the git status command
resultGitStatus = subprocess.run(["git", "status"], capture_output=True, text=True)
print(resultGitStatus.stdout) 

# Executing "git add -A"
print("Executing \"git add -A\":")
print("")

# Run the git status command
resultGitAdd = subprocess.run(["git", "add", "-A",], capture_output=True, text=True)
print(resultGitAdd.stdout)
print("STDERR:")
print(resultGitAdd.stderr)

# Executing "git commit"
print("Executing \"git commit -m\":")
print("")

# Run the git commit command
resultGitCommit = subprocess.run(["git", "commit", "-m", "\"Update files.\"",], capture_output=True, text=True)
print(resultGitCommit.stdout)
print("STDERR:")
print(resultGitCommit.stderr)

# Executing "git push"
print("Executing \"git push\":")
print("")

# Run the git status command
resultGitPush = subprocess.run(["git", "push",], capture_output=True, text=True)
print(resultGitPush.stdout)
print("STDERR:")
print(resultGitPush.stderr)