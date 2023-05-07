import { Controller, useForm } from "react-hook-form";
import { Configuration, GRAPH_TYPES } from "../../../utils/configuration/types";
import Select from "react-select";
import {
  getGraphAxisTitle,
  getSettingsDefaultParametersOptions,
  getSettingsDefaultSplitParametersOptions,
  getSettingsErrorBars,
  getSettingsGraphOptions,
  getSettingsGraphTitle,
  getSettingsGraphType,
  getSettingsParametersOptions,
  getSettingsPlacement,
  getSettingsPlacementOptions,
  getSettingsSplitAxis,
  getSettingsSplitParametersOptions,
} from "../utils";
import { useCallback, useEffect } from "react";
import { _clsx } from "../../../utils/misc";
import styles from "../../../styles/form.module.scss";
import { ConfigurationSettings, Settings } from "../../../utils/settings/types";
import { SplitGraphsSettingsComponent } from "../SplitGraphsSettingsComponent";

type Props = {
  settings: Settings;
  configuration: Configuration;
  setSettings: (_: Settings) => void;
};

type FormData = ConfigurationSettings;

export const SettingsForm = (props: Props) => {
  const { settings, setSettings, configuration } = props;
  const { control, handleSubmit, watch, register } = useForm<FormData>({
    defaultValues: {
      title: getSettingsGraphTitle(settings, configuration),
      x: {
        title: getGraphAxisTitle("x", settings, configuration),
      },
      y: {
        title: getGraphAxisTitle("y", settings, configuration),
      },
      split: {
        x: {
          format: getSettingsSplitAxis("x", settings, configuration.id)?.format ?? "{{parameter}}={{value}}",
          placement: getSettingsPlacement("x", settings, configuration) ?? "before",
        },
        y: {
          format: getSettingsSplitAxis("y", settings, configuration.id)?.format ?? "{{parameter}}={{value}}",
          placement: getSettingsPlacement("y", settings, configuration) ?? "after",
        },
      },
      error_bars: getSettingsErrorBars(settings, configuration),
    },
  });
  const splitParametersOptions = {
    x: getSettingsSplitParametersOptions("x", settings, configuration),
    y: getSettingsSplitParametersOptions("y", settings, configuration),
  };
  const parametersOptions = {
    x: getSettingsParametersOptions("x", settings, configuration),
    y: getSettingsParametersOptions("y", settings, configuration),
  };
  const graph_type = getSettingsGraphType(settings, configuration);
  const nbParameters = Object.keys(configuration.parameters).length;

  const onSubmit = useCallback(
    (data: FormData) => {
      setSettings(
        Object.assign(
          { ...settings },
          {
            [configuration.id]: {
              title: data.title,
              type: data.type,
              x: data.x,
              y: data.y,
              split: {
                x: {
                  ...data.split.x,
                  enable: data.split.x.parameter != "undefined", // TODO find a better way for this because quid if parameter name is "undefined"?
                },
                y: {
                  ...data.split.y,
                  enable: data.split.y.parameter != "undefined",
                },
              },
              error_bars: data.error_bars,
            },
          }
        )
      );
    },
    [configuration, setSettings, settings]
  );

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch, onSubmit]);

  return (
    <form key={configuration.id} className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row gap-4 xl:gap-12">
        <div className={_clsx(styles.group)}>
          <span className={_clsx(styles.heading)}>General</span>
          <div className={_clsx(styles.group)}>
            <label htmlFor="title">Title</label>
            <input className={styles.input} {...register("title")} id="title" type="text" />
          </div>
          <div className={_clsx(styles.group)}>
            <label htmlFor="y_format">Chart type</label>
            <Controller
              name="type"
              defaultValue={getSettingsGraphType(settings, configuration)}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={getSettingsGraphOptions().find((c) => c.value === value) ?? getSettingsGraphOptions()[0]}
                  options={getSettingsGraphOptions()}
                  onChange={(val) => onChange((val ?? getSettingsGraphOptions()[0]).value)}
                />
              )}
            />
          </div>
          {(graph_type == GRAPH_TYPES.LINE || graph_type == GRAPH_TYPES.BAR) && (
            <div className={_clsx(styles.group, styles.checkbox)}>
              <label className="w-max" htmlFor="error_bars">
                Error bars
              </label>
              <input {...register("error_bars")} id="error_bars" type="checkbox" />
            </div>
          )}
        </div>
        <SplitGraphsSettingsComponent setSettings={setSettings} settings={settings} configuration={configuration} />
      </div>

      <div className="grid grid-cols-2 gap-4 xl:gap-12">
        {getSettingsGraphType(settings, configuration) != GRAPH_TYPES.PIE && (
          <>
            <div className={_clsx(styles.group)}>
              <span className={_clsx(styles.heading)}>X axis</span>
              <div className={_clsx(styles.group)}>
                <label htmlFor="x.parameter">Variable</label>
                <Controller
                  name="x.parameter"
                  defaultValue={getSettingsDefaultParametersOptions("x", settings, configuration)?.value}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={
                        parametersOptions.x.find((c) => c.value === value) ??
                        getSettingsDefaultParametersOptions("x", settings, configuration)
                      }
                      options={parametersOptions.x}
                      onChange={(val) => onChange((val ?? parametersOptions.x[0]).value)}
                    />
                  )}
                />
              </div>
              <div className={_clsx(styles.group)}>
                <label htmlFor="x.title">Label</label>
                <input className={styles.input} {...register("x.title")} id="x.title" type="text" />
              </div>
            </div>
            <div className={_clsx(styles.group)}>
              <span className={_clsx(styles.heading)}>Y axis</span>
              <div className={_clsx(styles.group)}>
                <label htmlFor="y.parameter">Variable</label>
                <Controller
                  name="y.parameter"
                  defaultValue={getSettingsDefaultParametersOptions("y", settings, configuration)?.value}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={
                        parametersOptions.y.find((c) => c.value === value) ??
                        getSettingsDefaultParametersOptions("y", settings, configuration)
                      }
                      options={parametersOptions.y}
                      onChange={(val) => onChange((val ?? parametersOptions.y[0]).value)}
                    />
                  )}
                />
              </div>
              <div className={_clsx(styles.group)}>
                <label htmlFor="y.title">Label</label>
                <input className={styles.input} {...register("y.title")} id="y.title" type="text" />
              </div>
            </div>
          </>
        )}
        {nbParameters > 2 && (
          <>
            <div className={_clsx(styles.group)}>
              <span className={_clsx(styles.heading)}>Columns Split</span>
              <div className={_clsx(styles.group)}>
                <label htmlFor="split.x.parameter">Variable</label>
                <Controller
                  name="split.x.parameter"
                  defaultValue={getSettingsDefaultSplitParametersOptions("x", settings, configuration)?.value}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={
                        splitParametersOptions.x.find((c) => c.value === value) ??
                        getSettingsDefaultSplitParametersOptions("x", settings, configuration)
                      }
                      options={splitParametersOptions.x}
                      onChange={(val) => onChange((val ?? splitParametersOptions.x[0]).value)}
                    />
                  )}
                />
              </div>
              <div className={_clsx(styles.group)}>
                <label htmlFor="split.y.format">Format</label>
                <input className={styles.input} {...register("split.x.format")} id="x_format" type="text" />
              </div>
              <div className={_clsx(styles.group)}>
                <label htmlFor="split.x.placement">Placement</label>
                <Controller
                  name="split.x.placement"
                  defaultValue={getSettingsPlacement("x", settings, configuration)}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={
                        getSettingsPlacementOptions("x").find((c) => c.value === value) ?? {
                          label: "Top",
                          value: "before",
                        }
                      }
                      options={getSettingsPlacementOptions("x")}
                      onChange={(val) => onChange((val ?? getSettingsPlacementOptions("x")[0]).value)}
                    />
                  )}
                />
              </div>
            </div>
            <div className={_clsx(styles.group)}>
              <span className={_clsx(styles.heading)}>Rows Split</span>
              <div className={_clsx(styles.group)}>
                <label htmlFor="split.y.parameter">Variable</label>
                <Controller
                  name="split.y.parameter"
                  defaultValue={getSettingsDefaultSplitParametersOptions("y", settings, configuration)?.value}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={
                        splitParametersOptions.y.find((c) => c.value === value) ??
                        getSettingsDefaultSplitParametersOptions("y", settings, configuration)
                      }
                      options={splitParametersOptions.y}
                      onChange={(val) => onChange((val ?? splitParametersOptions.y[0]).value)}
                    />
                  )}
                />
              </div>
              <div className={_clsx(styles.group)}>
                <label htmlFor="split.y.format">Format</label>
                <input className={styles.input} {...register("split.y.format")} id="y_format" type="text" />
              </div>
              <div className={_clsx(styles.group)}>
                <label htmlFor="split.y.placement">Placement</label>
                <Controller
                  name="split.y.placement"
                  defaultValue={getSettingsPlacement("y", settings, configuration)}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={
                        getSettingsPlacementOptions("y").find((c) => c.value === value) ?? {
                          label: "Right",
                          value: "after",
                        }
                      }
                      options={getSettingsPlacementOptions("y")}
                      onChange={(val) => onChange((val ?? getSettingsPlacementOptions("y")[1]).value)}
                    />
                  )}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  );
};
