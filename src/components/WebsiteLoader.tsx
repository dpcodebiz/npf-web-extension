import { useEffect, useState } from "react";
import { Spinner } from "./loader/spinner";

type Props = {
  loading?: boolean;
};

const TRANSITION_TIME = 750;

export const WebsiteLoader = (props: Props) => {
  const { loading = false } = props;

  const [transition, setTransition] = useState(true);

  // Set up transition when website is no longer loading
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setTransition(false);
      }, TRANSITION_TIME);
    }
  }, [loading]);

  return (
    <>
      {loading || transition ? (
        <div className="absolute z-10 top-0 right-0 left-0 bottom-0 bg-white flex flex-col justify-center">
          <div className="mx-auto w-max h-max -mt-48">
            <Spinner />
            <div className="w-80 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`transition-all duration-500 ${
                  !loading && transition ? "w-full" : "w-0"
                } h-2 rounded-l-full bg-uclouvain-1`}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
