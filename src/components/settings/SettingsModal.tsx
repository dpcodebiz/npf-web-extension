import { Modal, ModalProps } from "../modal/Modal";
import { SettingsComponent } from "./SettingsComponent";
import { SettingsProps } from "./utils";

type Props = SettingsProps & ModalProps;

export const SettingsModal = (props: Props) => {
  const { setSettings, configuration } = props;

  return (
    <Modal setOpen={props.setOpen} open={props.open}>
      <div className="p-4 flex flex-row divide-x-[1px] gap-4">
        <SettingsComponent setSettings={setSettings} configuration={configuration} />
      </div>
    </Modal>
  );
};
