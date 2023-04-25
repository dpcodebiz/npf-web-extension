import json
import sys
from argparse import ArgumentParser
from importlib.metadata import version
import os
import shutil

# Getting package directory
package_directory = os.path.dirname(os.path.abspath(__file__))
template_path = os.path.join(package_directory, "template.html")

def main():
    parser = ArgumentParser()
    parser.add_argument("-v", "--version", action="store_true")

    args = parser.parse_args()

    if args.version:
        print(version("npf-web-extension"))
        sys.exit()


def _prepare(outdir):

    # Configuration
    output_path = f"{outdir}/index.html"

    # Copying app to outdir
    shutil.copy(template_path, output_path)

    
def _hydrate(configurationData, outdir):

    # Configuration
    file_path = f"{outdir}/index.html"
    insertion_point = "<!-- NPF_CONFIG_INSERTION -->"
    js_snippet = f'\t<script type="text/javascript">window.addEventListener("APP_READY", () => window.updateConfiguration({json.dumps(configurationData)}))</script>'

    # Replacing the insertion point with the js_snippet
    with open(file_path, 'r', encoding='utf-8') as file:
        file_contents = file.read()

    new_contents = file_contents.replace(insertion_point, js_snippet)

    with open(file_path, 'w', encoding='utf-8') as file:
        # Write the modified contents to the file
        file.write(new_contents)


def export(configurationData, outdir):
    
    _prepare(outdir)
    _hydrate(configurationData, outdir)

    print("Web app has been exported properly")