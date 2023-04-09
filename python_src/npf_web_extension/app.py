import json
import shutil
import sys
from argparse import ArgumentParser
from importlib.metadata import version


def main():
    parser = ArgumentParser()
    parser.add_argument("-v", "--version", action="store_true")

    args = parser.parse_args()

    if args.version:
        print(version("npf-web-extension"))
        sys.exit()


def _prepare(outdir):

    # Configuration
    file_path = "index.html"

    # Copying app to outdir
    shutil.copy(file_path, f"{outdir}/{file_path}")

    
def _hydrate(configuration, outdir):

    # Configuration
    file_path = f"{outdir}/index.html"
    insertion_point = "<!-- NPF_CONFIG_INSERTION -->"
    js_snippet = f'\t<script type="text/javascript">setTimeout(() => window.updateConfiguration({json.dumps(configuration)}), 2500)</script>'

    # Replacing the insertion point with the js_snippet
    with open(file_path, 'r') as file:
        file_contents = file.read()

    new_contents = file_contents.replace(insertion_point, js_snippet)

    with open(file_path, 'w') as file:
        # Write the modified contents to the file
        file.write(new_contents)


def export(configuration, outdir):
    
    _prepare(outdir)
    _hydrate(configuration, outdir)

    print("Web app has been exported properly")