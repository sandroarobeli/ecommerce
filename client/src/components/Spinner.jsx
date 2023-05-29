import { RotatingLines } from "react-loader-spinner";

export default function Spinner({ className, strokeColor, strokeWidth }) {
  return (
    <div className={className}>
      <RotatingLines
        strokeColor={strokeColor}
        strokeWidth="5"
        animationDuration="1"
        width={strokeWidth}
        visible={true}
      />
    </div>
  );
}
