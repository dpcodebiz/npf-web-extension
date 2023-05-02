# Quickstart

First start by installing the PyPi package:

```sh
pip install npf-web-extension
```

Then import the package and call the `export` method.

```python
import npf_web_extension

# Preparing data to be exported
configurationData = {
  "id": "1234567-1234567894567878241-12456", # Must be unique
  "name": "Quickstart example",
  "parameters": ["N", "algorithm", "num_cpus", "cpu_brand"],
  "measurements": ["efficiency"],
  "data": """algorithm,N,num_cpus,efficiency,cpu_brand
Algorithm 1,10,1,0.75,Ryzen
Algorithm 1,10,4,0.85,Ryzen
Algorithm 1,10,8,0.90,Ryzen
Algorithm 2,10,1,0.65,Ryzen
Algorithm 2,10,4,0.80,Ryzen
Algorithm 2,10,8,0.87,Ryzen
""", # Raw data in csv format
}
output = "index.html"

# Exporting the configuration to 
npf_web_extension.export(configurationData, output)
```

There will be an `index.html` file waiting for you.
Start playing with it!
