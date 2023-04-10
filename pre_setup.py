import shutil

# Configuration
file_path = "build/index.html"
python_file_path = "python_src/npf_web_extension/template.py"

# Copy template file
shutil.copyfile(file_path, python_file_path)