import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import Background from "./Background"

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-yellow-400 selection:text-black">
      <Background />
      <div className="relative z-10 flex flex-col flex-1">  {/* ← wrapper for all content */}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}