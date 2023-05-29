import DynamicTitle from "../components/DynamicTitle";

export default function Inactivity() {
  return (
    <div className="mx-auto px-12 mt-[35vh] text-center">
      <DynamicTitle title="Inactivity logout" />
      <h3 className="font-roboto text-lg md:text-2xl">
        You have been signed out due to inactivity.
      </h3>
    </div>
  );
}
