import { Controller, useForm } from "react-hook-form";
import { Configuration, ConfigurationSettings, Settings } from "../../../utils/configuration/types";
import Select from "react-select";
import { getSettingsGraphSelectOptions, getSettingsGraphTitle, getSettingsSelectedGraphType } from "../utils";
import { useCallback, useEffect } from "react";
import { _clsx } from "../../../utils/misc";
import styles from "../../../styles/form.module.scss";

type Props = {
  settings: Settings;
  configuration: Configuration;
  setSettings: (_: Settings) => void;
};

type FormData = ConfigurationSettings;

export const MetadataForm = (props: Props) => {
  const { settings, setSettings, configuration } = props;
  const { control, handleSubmit, watch, register } = useForm<FormData>({
    defaultValues: {
      title: getSettingsGraphTitle(settings, configuration),
      x_format: "{{parameter}}={{value}}",
      y_format: "{{parameter}}={{value}}",
    },
  });

  const onSubmit = useCallback(
    (data: FormData) => {
      setSettings({
        [configuration.id]: {
          x_format: data.x_format,
          y_format: data.y_format,
          title: data.title,
          type: data.type,
        },
      });
    },
    [configuration, setSettings]
  );

  useEffect(() => {
    // TypeScript users
    const subscription = watch(() => handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch, onSubmit]);

  console.log("rendered", configuration);

  return (
    <form key={configuration.id} className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={_clsx(styles["form-group"])}>
        <label htmlFor="title">Title</label>
        <input className={styles["form-input"]} {...register("title")} id="title" type="text" />
      </div>
      <div className={_clsx(styles["form-group"])}>
        <label htmlFor="x_format">Split X axis format</label>
        <input className={styles["form-input"]} {...register("x_format")} id="x_format" type="text" />
      </div>
      <div className={_clsx(styles["form-group"])}>
        <label htmlFor="y_format">Split Y axis format</label>
        <input className={styles["form-input"]} {...register("y_format")} id="y_format" type="text" />
      </div>
      <Controller
        name="type"
        defaultValue={getSettingsSelectedGraphType(settings, configuration)}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            value={getSettingsGraphSelectOptions().find((c) => c.value === value) ?? getSettingsGraphSelectOptions()[0]}
            options={getSettingsGraphSelectOptions()}
            onChange={(val) => onChange((val ?? getSettingsGraphSelectOptions()[0]).value)}
          />
        )}
      />
    </form>
  );
};
