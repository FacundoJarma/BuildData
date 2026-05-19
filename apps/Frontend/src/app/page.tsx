import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./landing/sections/Hero";
import Problema from "./landing/sections/Problema";
import HowItWorks from "./landing/sections/HowItWorks";
import Funcionalidades from "./landing/sections/Funcionalidades";
import DashboardSection from "./landing/sections/DashboardSection";
import ChatbotSection from "./landing/sections/ChatbotSection";
import Beneficios from "./landing/sections/Beneficios";
import CTA from "./landing/sections/CTA";

export default function Home() {
  return (
    <div>
      <Navbar type="no-session" />
      <Hero />
      <Problema />
      <HowItWorks />
      <Funcionalidades />
      <DashboardSection />
      <ChatbotSection />
      <Beneficios />
      <CTA />
      <Footer />
    </div>
  );
}
