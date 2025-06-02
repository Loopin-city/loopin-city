import os
import re
import shutil
from pathlib import Path
from datetime import datetime


SKIP_DIRS = {
    'node_modules',
    '.git',
    '.bolt',
    'dist'
}


PROCESS_EXTENSIONS = {
    '.js', '.jsx', '.ts', '.tsx',
    '.py',
    '.sql',
    '.json', '.config.js', '.config.ts',
    '.html', '.css', '.scss',
    '.sh',
    '.md'
}

def backup_file(file_path):
    backup_dir = Path('backup_' + datetime.now().strftime('%Y%m%d_%H%M%S'))
    backup_dir.mkdir(exist_ok=True)
    backup_path = backup_dir / file_path.name
    shutil.copy2(file_path, backup_path)
    return backup_path

def remove_js_comments(content):
    # Remove single-line comments
    content = re.sub(r'//.*$', '', content, flags=re.MULTILINE)
    # Remove multi-line comments
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    return content

def remove_python_comments(content):
    # Remove single-line comments
    content = re.sub(r'#.*$', '', content, flags=re.MULTILINE)
    # Remove multi-line comments
    content = re.sub(r'""".*?"""', '', content, flags=re.DOTALL)
    content = re.sub(r"'''.*?'''", '', content, flags=re.DOTALL)
    return content

def remove_sql_comments(content):
    # Remove single-line comments
    content = re.sub(r'--.*$', '', content, flags=re.MULTILINE)
    # Remove multi-line comments
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    return content

def remove_html_comments(content):
    return re.sub(r'<!--[\s\S]*?-->', '', content)

def process_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        print(f"Skipping binary file: {file_path}")
        return
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return

    original_content = content
    extension = file_path.suffix.lower()

    try:
        if extension in {'.js', '.jsx', '.ts', '.tsx', '.json', '.config.js', '.config.ts'}:
            content = remove_js_comments(content)
        elif extension == '.py':
            content = remove_python_comments(content)
        elif extension == '.sql':
            content = remove_sql_comments(content)
        elif extension in {'.html', '.css', '.scss'}:
            content = remove_html_comments(content)
            if extension == '.css':
                content = remove_js_comments(content)

        # Only write if content has changed and is not empty
        if content != original_content and content.strip():
            # Create backup before modifying
            backup_path = backup_file(file_path)
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Processed: {file_path} (Backup: {backup_path})")
            except Exception as e:
                print(f"Error writing to {file_path}: {e}")
                # Restore from backup if write fails
                shutil.copy2(backup_path, file_path)
                print(f"Restored from backup: {backup_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() in PROCESS_EXTENSIONS:
                process_file(file_path)

if __name__ == "__main__":
    script_dir = Path(__file__).parent
    print(f"Starting comment removal from: {script_dir}")
    process_directory(script_dir)
    print("Comment removal completed!") 