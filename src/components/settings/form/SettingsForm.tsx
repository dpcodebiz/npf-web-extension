import { Controller, useForm } from "react-hook-form";
import { Configuration } from "../../../utils/configuration/types";
import Select from "react-select";
import {
  getGraphAxisTitle,
  getSettingsDefaultSplitParametersOptions,
  getSettingsGraphOptions,
  getSettingsGraphTitle,
  getSettingsGraphType,
  getSettingsSplitAxis,
  getSettingsSplitAxisFormat,
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
        },
        y: {
          format: getSettingsSplitAxis("y", settings, configuration.id)?.format ?? "{{parameter}}={{value}}",
        },
      },
    },
  });

  const onSubmit = useCallback(
    (data: FormData) => {
      setSettings({
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
        },
      });
    },
    [configuration, setSettings]
  );

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch, onSubmit]);

  return (
    <form key={configuration.id} className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row gap-4 divide-x-2">
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
          <div className={_clsx(styles.group)}>
            <label htmlFor="x.title">X axis label</label>
            <input className={styles.input} {...register("x.title")} id="x.title" type="text" />
          </div>
          <div className={_clsx(styles.group)}>
            <label htmlFor="y.title">Y axis label</label>
            <input className={styles.input} {...register("y.title")} id="y.title" type="text" />
          </div>
        </div>
        <SplitGraphsSettingsComponent setSettings={setSettings} settings={settings} configuration={configuration} />
      </div>
      <div className="grid grid-cols-2 gap-6">
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
                    getSettingsSplitParametersOptions("x", settings, configuration).find((c) => c.value === value) ??
                    getSettingsSplitParametersOptions("x", settings, configuration)[0]
                  }
                  options={getSettingsSplitParametersOptions("x", settings, configuration)}
                  onChange={(val) =>
                    onChange((val ?? getSettingsSplitParametersOptions("x", settings, configuration)[0]).value)
                  }
                />
              )}
            />
          </div>
          <div className={_clsx(styles.group)}>
            <label htmlFor="split.y.format">Format</label>
            <input className={styles.input} {...register("split.x.format")} id="x_format" type="text" />
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
                    getSettingsSplitParametersOptions("y", settings, configuration).find((c) => c.value === value) ??
                    getSettingsSplitParametersOptions("y", settings, configuration)[0]
                  }
                  options={getSettingsSplitParametersOptions("y", settings, configuration)}
                  onChange={(val) =>
                    onChange((val ?? getSettingsSplitParametersOptions("y", settings, configuration)[0]).value)
                  }
                />
              )}
            />
          </div>
          <div className={_clsx(styles.group)}>
            <label htmlFor="split.y.format">Format</label>
            <input className={styles.input} {...register("split.y.format")} id="y_format" type="text" />
          </div>
        </div>
      </div>
    </form>
  );
};
