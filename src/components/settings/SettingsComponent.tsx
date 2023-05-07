import { SettingsForm } from "./form/SettingsForm";
import { SettingsProps, getSettingsGraphOptions } from "./utils";

export const SettingsComponent = (props: SettingsProps) => {
  const { setSettings, configuration, settings } = props;

  return (
    <div className="bg-white rounded-xl xl:min-w-[1200px]">
      <div className="flex flex-col gap-2 xl:gap-4 p-4">
        <span className="text-2xl">Settings</span>
        <span>
          The recommended graph type for this data is:
          <span className="font-bold">
            {" "}
            {
              getSettingsGraphOptions().find(
                (option) => option.value == configuration.experiments[0].metadata.recommended_type
              )?.label
            }
            {configuration.experiments[0].metadata.recommended_error_bars ?? "with error bars"}
          </span>
        </span>
        <SettingsForm configuration={configuration} settings={settings} setSettings={setSettings}></SettingsForm>
      </div>
    </div>
  );
};
