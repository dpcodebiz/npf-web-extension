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


def hydrate_app():
    print("Hydrated")