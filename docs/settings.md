# Settings

This page describes all the settings available inside the app interface. These settings are saved locally **per configuration** using the configuration id.

## Title

This refers to the title of the graph which is displayed at the top.

## Chart type

This applies to all the graphs rendered. There are four types available

- Line chart
- Bar chart
- Pie chart
- Boxplot chart

---

## Axis settings (X and Y)

This section is only available for line, bar and boxplot charts.

### Variable

You can choose which parameter amongst the ones provided inside the configuration data to select as the main variable of all graphs.

For the X axis, the available options include only the parameters whilst the Y axis only allows measurements.

### Label

By default the label is set to the variable name but you can redefine it here to fit your needs.

---

## Split settings (Columns and Rows)

This section is only available when there are more than 2 parameters specified in the configuration.

### Variable

All graphs are split into columns or rows based on this parameter. You can disable this feature by selecting the `None` value.

!> In order to prevent rendering issues, no parameters with more than 6 possible values will be available. Furthermore, a parameter **can not** be selected **for both columns and rows** splitting.

### Format

This allows you to format the name of each column/row. There are metaparameters available for injection:

- `{{ variable }}, {{ v }}, {{ 0 }}` These contain the variable name
- `{{ parameter }}, {{ p }}, {{ 1 }}` These contain the variable value for each iteration.

Alternatively, if you leave it blank, it shows the default value. You can insert a space character to leave it empty and split graphs with no heading.

### Placement

You can select where the heading of the column/row will be placed. By default it is set to:

- `Top` for the columns
- `After` for the rows
