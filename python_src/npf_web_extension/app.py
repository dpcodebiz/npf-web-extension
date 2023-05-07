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

"""
Prepares a new template ready for configuration injection.
"""
def _prepare(outdir):

    # Configuration
    output_path = f"{outdir}"

    # Copying app to outdir
    shutil.copy(template_path, output_path)

"""
Injects the configuration into a prepared template.
"""
def _hydrate(configurationData, outdir, demo = False):

    # Configuration
    file_path = f"{outdir}"
    insertion_point = "<!-- NPF_CONFIG_INSERTION -->"
    js_snippet = f'\t<script type="text/javascript">window.addEventListener("APP_READY", () => window.demo())</script>' if demo else f'\t<script type="text/javascript">window.addEventListener("APP_READY", () => window.updateConfiguration({json.dumps(configurationData)}))</script>'

    # Replacing the insertion point with the js_snippet
    with open(file_path, 'r', encoding='utf-8') as file:
        file_contents = file.read()

    new_contents = file_contents.replace(insertion_point, js_snippet)

    with open(file_path, 'w', encoding='utf-8') as file:
        # Write the modified contents to the file
        file.write(new_contents)

"""
Provides an exported app ready for demonstration purposes.

pre:
    outdir: string
"""
def demo(outdir):

    _prepare(outdir)
    _hydrate(None, outdir, True)

    print("Web app has been exported properly to {outdir}")

"""
Exports a given set of configurations.

pre:
    configurationData: ConfigurationData or ConfigurationData[]
    outdir: string
"""
def export(configurationData, outdir):
    
    _prepare(outdir)
    _hydrate(configurationData, outdir)

    print(f"Web app has been exported properly to {outdir}")