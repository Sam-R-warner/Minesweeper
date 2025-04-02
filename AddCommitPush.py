import subprocess

print("Add Commit Push")


# Print the output
print("Executing \"git status\":")
print("")

# Run the git status command
resultGitStatus = subprocess.run(["git", "status"], capture_output=True, text=True)

print(resultGitStatus.stdout)
#print("STDERR:")
#print(result.stderr)

# Print the output
print("Executing \"git add -A\":")
print("")

# Run the git status command
resultGitAdd = subprocess.run(["git", "add -A",], capture_output=True, text=True)

print(resultGitAdd.stdout)
print("STDERR:")
print(resultGitAdd.stderr)