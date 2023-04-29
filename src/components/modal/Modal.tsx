import { PropsWithChildren } from "react";
import styles from "../../styles/modal.module.scss";

export type ModalProps = {
  setOpen: (_: boolean) => void;
  open: boolean;
};

export const Modal = (props: PropsWithChildren<ModalProps>) => {
  const { open, children, setOpen } = props;

  return open ? (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={styles["container"]} onClick={() => setOpen(false)}>
      <div className={styles.space}></div>
      <div
        className="p-4 w-max mx-auto"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles.modal}>{children}</div>
      </div>
    </div>
  ) : (
    <></>
  );
};
