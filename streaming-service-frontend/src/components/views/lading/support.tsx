import React from 'react';


const Support: React.FC = () => {
  return (
    
    <div className='py-[100px] px-[100px]' style={{backgroundColor: '#C6AC8E', height: '100vh', width: '100vw'}}>

        <div className='w-full h-full rounded-xl border-[#5E503F] border-2 flex items-center justify-center' style={{backgroundImage: 'url(/img/background.png)'}}>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-[#22333B] text-[60px] font-bold text-center">HELP US RESHAPE<br/> THE FUTURE OF<br/> MUSIC</h1>
            <button className="bg-[#22333B] text-[#C6AC8E] justify-between font-mono border-2 text-3xl border-[#C6AC8E] px-5 py-5  w-full flex  rounded-full mb-auto mt-10">
              <span >Support Us</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>
    </div>
  );
};

export default Support;
