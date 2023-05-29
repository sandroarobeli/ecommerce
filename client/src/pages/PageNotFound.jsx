import DynamicTitle from "../components/DynamicTitle";

export default function PageNotFound() {
  return (
    <div className="mx-auto px-12 mt-[35vh] text-center">
      <DynamicTitle title="Page not found" />
      <div className="flex items-center justify-center text-gray-600 font-roboto">
        <span className="text-2xl md:text-4xl">404</span>
        <span className="border-l-2 border-gray-600 h-9 md:h-12 mx-4"></span>
        <span className="text-xl md:text-2xl">Page not found</span>
      </div>
    </div>
  );
}
