import React from 'react';
import Reveal from '@/utils/effects/Reveal';
import { useRouter } from "next/navigation";

const Info: React.FC = () => {
  const router = useRouter(); 

  return (
    <div className="bg-[#C6AC8E]  h-screen w-screen flex-col items-center justify-center relative ">
      <Reveal width="fit-content" delay={0.35}>
        <div className="flex  w-screen px-10 justify-around">
          <div className=" rounded-lg  bg-cover min-h-[368px] min-w-[368px] border border-solid shadow-lg border-[#22333B]" style={{backgroundImage: 'url(/img/moon.jpg)', filter: 'grayscale(80%)'}}>
            <div style={{backgroundColor: '#5E503F', opacity: 0.7, height: '100%', width: '100%'}}></div>
          </div>
          <div className="text-[#22333B] px-11 py-12 flex flex-col   items-center justify-around ">
            <div className=' '>
              <p className="text-[34px] font-bold  font-mono">Ready for a rhythmic revolution? </p>
              <p className="text-[34px] font-bold  font-mono">Join our crew for a symphony of<br/> surprises</p>
            </div>
            <div className="flex-grow"></div>
            <button className="bg-[#22333B] text-[#C6AC8E] font-mono  font-semibold text-3xl border-none px-5 py-5 cursor-pointer w-full flex justify-between rounded-full mb-auto "
            onClick={() => router.push('/signup')}
            >
              <span className="pr-2">Sign Up</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>
      </Reveal>
      <br/><br/>
      <Reveal width="fit-content" delay={0.35}>
        <div className="flex  w-screen px-10 justify-around">
          <div className="text-[#22333B] px-11 py-12 flex flex-col  items-center justify-around">
              <div className=' '>
                <p className="text-[48px] font-bold  font-mono">500K+ Hours of Music </p>
                <p className="text-[44px] font-bold  font-mono">Discover a world of new sounds</p>
              </div>
              <div className="flex-grow"></div>
              <button className="bg-transparent text-[#22333B] font-mono  font-semibold text-3xl border-2 border-[#22333B] px-5 py-5 cursor-pointer w-full flex justify-between rounded-full mb-auto"
                onClick={() => router.push('/sound')}
              > 
                <span className="pr-2">Explore</span>
                <span>&gt;</span>
              </button>
          </div>
          <div className=" rounded-lg bg-cover min-h-[368px] min-w-[368px] border border-solid shadow-lg border-[#22333B]" style={{backgroundImage: 'url(/img/city.jpg)', filter: 'grayscale(80%)'}}>
            <div style={{backgroundColor: '#5E503F', opacity: 0.7, height: '100%', width: '100%'}}></div>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default Info;
