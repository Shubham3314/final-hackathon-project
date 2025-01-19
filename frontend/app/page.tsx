import { Encryption } from "@/components/main/Encryption";
import { Footer } from "@/components/main/Footer";
import { Hero } from "@/components/main/Hero";
import { Projects } from "@/components/main/Projects";
import { Skills } from "@/components/main/Skills";
import Team from "@/components/main/Team";
import ChatBot from "@/components/sub/ChatBot";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Team />
        {/* <Skills /> */}
        {/* <Encryption /> */}
        {/* <Projects /> */}
      </div>
      <Footer />
      <ChatBot />
    </main>
  );
}
