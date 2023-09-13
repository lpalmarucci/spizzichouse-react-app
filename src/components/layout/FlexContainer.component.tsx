import { CSSProperties } from "react";

type FlexComponentProps = {
  justifyContent: CSSProperties["justifyContent"];
  children: React.ReactNode;
};
const FlexContainer = (props: FlexComponentProps) => (
  <div
    style={{
      justifyContent: props.justifyContent,
    }}
    className="flex w-full gap-1 items-center"
  >
    {props.children}
  </div>
);

export default FlexContainer;
