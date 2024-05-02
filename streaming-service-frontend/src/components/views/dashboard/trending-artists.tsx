const TrendingArtists: React.FC = ({ artistsData }) => {
  return (
    <div className="w-[1150px] h-[791px] rounded-[20px] relative bg-[#fff9f933]">
      <div className="flex h-[63px] pl-[22px] pr-0 py-[7px] self-stretch w-full items-center relative">
        <div className="inline-flex gap-[15px] flex-[0_0_auto] items-center relative">
          <div className="relative w-fit mt-[-1.00px] [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[20px] text-center tracking-[0] leading-[normal]">
            Trending Artist
          </div>
        </div>
      </div>
      <div className="overflow-x-auto ">
        <div className="flex flex-nowrap justify-start px-4">
          {artistsData.artists.map((artist) => (
            <a
              href="/artist/"
              className="flex-shrink-0 w-[110px] m-4 rounded p-4 shadow-lg transition-all duration-700 hover:scale-110"
            >
              <div className="relative">
                <img
                  src="/img/artist-icon.jpeg"
                  alt={artist.display_name}
                  className="w-full rounded-[10px]"
                />
              </div>
              <div className="mt-2 text-center text-[#1e1e1e] font-semibold">
                {artist.display_name}
              </div>
              <div className="mt-1 text-center text-[#7b7b7b] text-sm overflow-x-auto">
                {artist.genres.join(", ")}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingArtists;
