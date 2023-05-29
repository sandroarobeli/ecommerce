import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col justify-between">
      <Header />
      <main className="container min-h-screen mx-auto my-4 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// min-h-screen. Keeping it just in case. belongs to the topmost div
