import subprocess
import sys
import re

def run_command(command, check=True):
    try:
        result = subprocess.run(command, check=check, shell=True, text=True, capture_output=True, encoding='utf-8')
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        if check:
            raise
        return None

def get_remote_branches():
    output = run_command("git branch -r")
    branches = []
    for line in output.split('\n'):
        line = line.strip()
        if not line:
            continue
        if "->" in line: # Skip HEAD -> main
            continue
        if "origin/main" in line: # Skip main
            continue
        branches.append(line)
    return branches

def merge_branch(branch, target_branch="main"):
    print(f"\nAttempting to merge {branch}...")
    try:
        # Try standard merge
        run_command(f"git merge {branch} --no-edit", check=True)
        print(f"Successfully merged {branch}")
    except subprocess.CalledProcessError:
        print(f"Conflict merging {branch}. Resolving by taking 'theirs' (incoming changes)...")
        try:
            # If conflict, checkout theirs for all files
            # run_command("git checkout --theirs .", check=True) # This only works for unmerged files? No, '.' checks out all files from index?
            # Standard way to resolve "theirs" for unmerged files:
            # git checkout --theirs <paths>
            
            # Let's verify what conflicts exists
            status = run_command("git status --porcelain")
            conflicted_files = []
            for line in status.split('\n'):
                if line.startswith('UU') or line.startswith('AA') or line.startswith('DU') or line.startswith('UD'):
                     conflicted_files.append(line[3:])
            
            if conflicted_files:
                print(f"Conflicted files: {conflicted_files}")
                for file_path in conflicted_files:
                    # git checkout --theirs <file>
                    # Note: file path might need quoting if spaces
                    run_command(f'git checkout --theirs "{file_path}"')
                    run_command(f'git add "{file_path}"')
                
                run_command("git commit --no-edit")
                print(f"Resolved conflicts for {branch} and committed.")
            else:
                # Sometimes merge fails but no UI/conflict? (unrelated histories?)
                # Try simple commit if index is dirty but no conflict markers?
                # or maybe just abort?
                print("Merge failed but no conflicts found? Aborting merge.")
                run_command("git merge --abort", check=False)

        except Exception as e:
            print(f"Failed to resolve merge for {branch}: {e}")
            run_command("git merge --abort", check=False)
            
def main():
    branches = get_remote_branches()
    print(f"Found {len(branches)} remote branches to merge.")
    
    for branch in branches:
        merge_branch(branch)
    
    print("\nAll merges attempted.")

if __name__ == "__main__":
    main()
