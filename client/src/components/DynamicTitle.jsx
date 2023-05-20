import { Helmet, HelmetProvider } from "react-helmet-async";

export default function DynamicTitle({ title }) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>e-commerce | {title}</title>
      </Helmet>
    </HelmetProvider>
  );
}
