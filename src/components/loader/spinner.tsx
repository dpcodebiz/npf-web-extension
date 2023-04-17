import spinner_styles from "../../styles/spinner.module.css";

export const Spinner = () => {
  return (
    <div className="mb-10">
      <i className={`${spinner_styles.spinner} ${spinner_styles["--7"]} mx-auto`}></i>
    </div>
  );
};
