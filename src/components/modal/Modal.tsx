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
        className="p-2 xl:p-4 w-max mx-auto relative"
        onClick={(e) => {
          e.stopPropagation();
        }}
        role="presentation"
      >
        <button
          className="absolute right-4 top-4 py-2 m-4 px-4 bg-uclouvain-1 hover:bg-cyan-500 text-white transition-colors"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
        <div className={styles.modal}>{children}</div>
      </div>
    </div>
  ) : (
    <></>
  );
};
