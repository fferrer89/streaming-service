import Reveal from "@/utils/effects/Reveal";

const Hero: React.FC = () => {
  return (
    <Reveal width="fit-content" delay={0}>
      <section
          style={{
            backgroundImage: 'radial-gradient(100% 100% at 50% 0%, transparent 50%, #C6AC8E)',
          }}
        className="flex flex-col items-center justify-center h-screen w-screen space-y-[-250px] sticky top-0" 
      >
      
        <h1 className="text-[380px] font-extrabold text-[#EAE0D5] z-10">Sounds</h1>
        <h2 className="text-[420px] font-extrabold italic text-white z-10">54</h2>

      </section>
    </Reveal>

  );
};

export default Hero;

