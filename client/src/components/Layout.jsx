import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <main
        className="container mx-auto my-4 px-4"
        style={{ border: "1px solid blue" }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
