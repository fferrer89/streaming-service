const Search: React.FC = () => {
  return (
    <div className="inline-flex flex-col h-[56px] gap-[10px] items-center relative">
      <div className="flex flex-col w-[477px] h-[56px] items-center justify-center gap-[20px] pl-0 pr-[10px] py-0 rounded-[100px] overflow-hidden border-2 border-solid border-white relative bg-[#fff9f933]">
        <div className="relative w-fit [font-family:'JetBrains_Mono-Light',Helvetica] font-light text-[#ffffffb2] text-[20px] text-center tracking-[0] leading-[normal]">
          Search
        </div>
        <img
          className="absolute w-[30px] h-[30px] top-[12px] left-[22px] object-cover"
          alt="Search results"
          src="/icons/search-white.png"
        />
      </div>
    </div>
  );
};

export default Search;
