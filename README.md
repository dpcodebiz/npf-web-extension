# Network Performance Framework Web Extension

This repository is an extension to NPF (<https://github.com/tbarbette/npf>). The architecture has been built based on npf's internal architecture. It should be used along as part of npf's workflow.

It can also be used as a standalone tool. It is recommended to install the python package via `pip install npf-web-extension`.

For more advanced usage, the app can be built using the commands available below and then opening the `template.html` file inside a browser. After opening the file, the following command can be run inside the browser to display a configuration.

```js
window.updateConfiguration(configurationData);
```

the signature of the `updateConfiguration` method is available inside the `App.tsx` file.

## Available Scripts

### `npm start`

Runs the app in development mode available at address `http://localhost:3000`

### `npm run test`

Runs the test suite covering all methods used by the app

### `npm run coverage`

Runs the test suite covering all methods used by the app

### `npm run build`

Builds the app for production and optimizes it.

### `npm run deploy`

Builds the app for production, optimizes it then prepares it for deployment.

## Releases

- V0.6.4
  - Complete rewriting of the internal architecture
  - Added download button to download chart as pdf
  - Added infobox when toggling fullscreen
  - Fixed pie charts not resizing properly
  - Fixed graphs not being splitted properly
  - Improved rendering performance. Settings are now saved per configuration.
- V0.6.3
  - Added settings override. It is now possible to override the default settings when exporting a configurationData.
  - Added POS data to demo sets
  - Updated readme
  - Updated docs
  - Fixed build errors
  - Fixed graph axis scaling error due to wrong behaviour of chartjs
  - Refactoring
- V0.6.2
  - Added background stripes to charts
  - Added graph axis scaling
- V0.6.1
  - Fixed app crash when no split parameter available
  - Fixed too many labels being created when too much variance in the data
- V0.6.0
  - Added boxplot charts
  - Added piechart
  - Added error bars for line and bar plots
  - Added test suite
  - Added more documentation
  - Added D-E-M-O keys interaction handler
  - Added responsive design
  - Added more settings conditionals
  - Added more settings for split parameters
  - Added parameter injection aliases for split parameter format
  - Improved code comments
  - Improved graph type recommendation
  - Redesigned settings modal
  - Settings are now saved locally per configuration
- V0.5.0
  - Added documentations feature
  - Added advanced settings
  - Added more demo data
  - Added full screen feature
  - Added graph splitting feature
  - Fixed loading system
  - Fixed output path in python interface
- V0.4.0
  - Switched data insertion system from json to csv
  - Added default demo data
  - Added bar charts and recommendation system
  - Added settings
  - Redesigned app event handler system
  - Redesigned charts rendering
- V0.3.0
  - Added navigation through configurations
  - Added website loader
  - Improved labels
- V0.2.3
  - Added automatic build and commit to repo of template to fix it not being included properly.
  - Renamed template.py to template.html
- V0.2.2
  - Fixed checkout reset when building with github actions
- V0.2.1
  - Fixed html file not being included properly. Added prebuild script.
- V0.2
  - Inlining all app source codes into a single html file instead of external scripts
- V0.1.1
  - PyPi package creation and publishing
- V0.1
  - Github actions automatic releases
