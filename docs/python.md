# Python Package

This page describes the methods inside the python package. These methods act as an interface with the web app.

## cli

- `-v, --version` returns the version of the package

## export (configurationData, outdir)

This exports a specific set of configurations to the web interface.

- `configurationData` **ConfigurationData** or **ConfigurationData[]** - configuration(s) with the dataset
- `outdir` **string** - outdir of the exported app

Each **ConfigurationData** follows the same structure as provided inside */src/configuration/types.ts*.

```ts
interface ConfigurationData {
  id: string; // Must be unique
  name: string;
  parameters: string[];
  measurements: string[];
  data: string;
}
```

## demo (outdir)

This provides a running app only for demonstration purposes.

- `outdir` **string** - outdir of the exported app

The demonstration datasets are available inside */src/utils/examples/*.
