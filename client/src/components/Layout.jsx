import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <main className="container mx-auto min-h-screen my-4 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
