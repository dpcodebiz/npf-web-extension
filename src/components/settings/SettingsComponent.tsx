import { MetadataForm } from "./form/MetadataForm";
import { SettingsProps } from "./utils";

export const SettingsComponent = (props: SettingsProps) => {
  const { setSettings, configuration, settings } = props;

  return (
    <div className="bg-white rounded-xl">
      <div className="grid grid-settings-xl">
        <div className="flex flex-col gap-4 p-4 xl:w-[500px]">
          <span className="text-2xl">Settings</span>
          <span>
            The recommended graph type for this data is:
            <span className="font-bold">
              {" "}
              {configuration.experiments[0].metadata.recommended_type ? "Bar Chart" : "Line Chart"}
            </span>
          </span>
          <MetadataForm configuration={configuration} settings={settings} setSettings={setSettings}></MetadataForm>
        </div>
      </div>
    </div>
  );
};
