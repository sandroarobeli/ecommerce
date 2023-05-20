import { RotatingLines } from "react-loader-spinner";

export default function Spinner() {
  return (
    <div className="w-[120px] m-auto">
      <RotatingLines
        strokeColor="#2563EB"
        strokeWidth="5"
        animationDuration="1"
        width="120"
        visible={true}
      />
    </div>
  );
}
