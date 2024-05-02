import React from 'react';
 


const Sidebar: React.FC = () => {
    return (
        <div className="flex flex-col items-start">
            <div className="flex-col h-[642px] gap-[20px] pl-0 pr-[10px] pt-[20px] pb-0 w-full rounded-[20px] overflow-hidden [background:linear-gradient(180deg,rgba(255,249.36,249.36,0.2)_0%,rgba(255,255,255,0)_100%)] flex items-center relative self-stretch">
          <div className="h-[63px] justify-between pl-[22px] pr-0 py-[7px] w-full flex items-center relative self-stretch">
            <div className="inline-flex gap-[15px] flex-[0_0_auto] mt-[-0.50px] mb-[-0.50px] items-center relative">
              <img
                className="relative w-[50px] h-[50px] object-cover"
                alt="Library icon"
                src="/icons/library_icon.png"
              />
              <div className="relative w-fit [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[30px] text-center tracking-[0] leading-[normal]">
                Your Sounds
              </div>
            </div>
            <div className="flex flex-col w-[45px] h-[45px] justify-center gap-[10px] bg-[#ffffff66] rounded-[10000px] items-center relative">
              <div className="w-[33px] h-[49px] mt-[-3.00px] mb-[-1.00px] [font-family:'JetBrains_Mono-Thin',Helvetica] font-thin text-[55px] whitespace-nowrap relative text-white text-center tracking-[0] leading-[normal]">
                +
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[477px] h-[187px] gap-[20px] pl-0 pr-[10px] py-0 bg-[#fff9f94c] rounded-[20px] overflow-hidden items-center relative">
            <div className="flex h-[63px] pl-[22px] pr-0 py-[7px] self-stretch w-full items-center relative">
              <div className="inline-flex gap-[15px] flex-[0_0_auto] items-center relative">
                <div className="relative w-fit mt-[-1.00px] [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[25px] text-center tracking-[0] leading-[normal]">
                  Playlists
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[477px] h-[190px] gap-[20px] pl-0 pr-[10px] py-0 bg-[#fff9f94c] rounded-[20px] overflow-hidden items-center relative">
            <div className="flex h-[63px] pl-[22px] pr-0 py-[7px] self-stretch w-full items-center relative">
              <div className="inline-flex gap-[15px] flex-[0_0_auto] items-center relative">
                <div className="relative w-fit mt-[-1.00px] [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[25px] text-center tracking-[0] leading-[normal]">
                  Songs
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    );
};

export default Sidebar;
