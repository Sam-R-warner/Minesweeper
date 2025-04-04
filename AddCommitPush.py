import subprocess
import argparse

def run_command(cmd):
    print(f"\n$ {cmd}")
    result = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    print(result.stdout)
    if result.stderr:
        print(result.stderr)
    return result.returncode

def main():
    parser = argparse.ArgumentParser(description="Stage all changes, commit, and push to git.")
    parser.add_argument("-m", "--message", type=str, default="Auto-commit", help="Commit message")
    parser.add_argument("-f", "--force", action="store_true", help="Skip confirmation prompt")

    args = parser.parse_args()
    commit_message = args.message
    force = args.force

    print("git status:")
    run_command("git status")

    cmds = [
        "git add .",
        f"git commit -m \"{commit_message}\"",
        "git push"
    ]

    print("\nThe following commands will be run:")
    for cmd in cmds:
        print(f"  {cmd}")

    if not force:
        confirm = input("\nDo you want to proceed? (y/n): ").lower()
        if confirm != 'y':
            print("Aborted by user.")
            return

    for cmd in cmds:
        run_command(cmd)

if __name__ == "__main__":
    main()