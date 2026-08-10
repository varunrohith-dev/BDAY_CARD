import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Calendar, RotateCw, BookOpen, Maximize2 } from 'lucide-react';
import { musicEngine } from '../utils/audioEngine';
import chapter1Image1 from '../assets/chapter1-memory1.jpg';
import chapter1Image2 from '../assets/chapter1-memory2.jpg';
import chapter2Image1 from '../assets/chapter2-memory1.jpg';
import chapter2Image2 from '../assets/chapter2-memory2.jpg';
import chapter3Image1 from '../assets/chapter3-memory1.jpg';

export const MemoryCard = ({ memory, onOpenStory }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [likes, setLikes] = useState(memory.likes || 24);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleFlipCard = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (memory && memory.songUrl) {
      musicEngine.playCustomAudioUrl(memory.songUrl, memory.title, memory.songQuote || "Tamil Soundtrack");
    }
    if (onOpenStory) {
      onOpenStory(memory);
    }
  };

  const handleCardClick = () => {
    if (memory && memory.songUrl) {
      musicEngine.playCustomAudioUrl(memory.songUrl, memory.title, memory.songQuote || "Tamil Soundtrack");
    }
    if (!isFlipped && onOpenStory) {
      onOpenStory(memory);
    }
  };

  return (
    <div className="perspective-1000 max-w-sm w-full mx-auto my-4 select-none group">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative polaroid-frame cursor-pointer"
        onClick={handleCardClick}
      >
        {/* FRONT OF POLAROID */}
        <div className={`${isFlipped ? 'pointer-events-none opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          {/* Photo Container - Tapping photo frame directly opens full page view */}
          <div
            onClick={handleImageClick}
            className="relative aspect-[4/3] overflow-hidden rounded bg-slate-900 mb-3 border border-slate-200/50 group/img cursor-pointer"
            title="Tap photo frame to open full page view"
          >
            <img
              src={memory.image}
              alt={memory.title}
              className="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-500"
              loading="lazy"
            />

            {/* Full Screen View Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 sm:opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-3">
              <span className="px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
                <Maximize2 className="w-3.5 h-3.5" />
                Tap for Full Page View
              </span>
              <span className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                <BookOpen className="w-4 h-4 text-amber-300" />
              </span>
            </div>

            {memory.tag && (
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-black/75 backdrop-blur-md text-amber-300 border border-white/20">
                {memory.tag}
              </span>
            )}

            {/* Flip indicator button */}
            <button
              onClick={handleFlipCard}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 hover:bg-black/90 transition z-10"
              title="Flip to read quick note"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Polaroid Content */}
          <div className="flex flex-col text-slate-800">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-serif font-bold text-lg leading-snug text-slate-900 group-hover:text-rose-600 transition-colors">
                {memory.title}
              </h3>
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500 animate-bounce' : 'text-rose-400'}`} />
                <span>{likes}</span>
              </button>
            </div>

            <p className="handwritten text-slate-700 mt-1">
              "{memory.caption}"
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-200">
              {memory.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {memory.date}
                </span>
              )}
              <span className="flex items-center gap-1 text-rose-600 font-bold hover:underline">
                Full Page View 📖
              </span>
            </div>
          </div>
        </div>

        {/* BACK OF POLAROID */}
        <div
          style={{ transform: 'rotateY(180deg)' }}
          className={`absolute inset-0 p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded text-white flex flex-col justify-between ${isFlipped ? 'opacity-100' : 'pointer-events-none opacity-0'
            } transition-opacity duration-300 border-2 border-amber-400/40`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Quick Note
              </span>
              <button
                onClick={handleFlipCard}
                className="p-1 rounded-full hover:bg-white/10 text-slate-300"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed font-light">
              "{memory.description}"
            </p>
          </div>

          <button
            onClick={() => onOpenStory && onOpenStory(memory)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Navigate to Full Page View 📖
          </button>
        </div>

      </motion.div>
    </div>
  );
};
// Emotional Journey Memories for Priya with full story support
export const MEMORIES_DATA = {
  chapter1: [
    {
      id: 'm1',
      title: "Shobana !!",
      caption: "You're the Brighest Version.",

      fullStory: `Hi Priyanka!, A thanks for you first of all , because u have given a perfect comfortable zone to me , surely i think nanum unna nalla murai la thaan namma rendu perukum endha oru sanda sacharavu illama loving ah poitu irundhuchu , enaku ipovum enna solrathu therila.. But i think u deservered as a better to me always..!!, You will be remembered in a every set of life and na proud ah solluven enaku oru good soul amanjudhu apdinu..I did'nt expect that you'll come to my life and it happened unexpectatdly and it is happening now also!!... You'll be always blessed whenever ur with this Varun!!. I don't know how much of years we're going to travel through ur life as this upto this bond exists!!..  Namma sethu senja lollu, adicha lutti ellaam eppovume en nenjodae irukum. Nee eppovum ipdiye santhoshama irukanum nu i'll pray for you my `,
      date: "<>",
      location: "Where It All Began",
      tag: "Chapter 1",
      likes: 54,
      songQuote: "Verenna verenna venum, Nee mattum nee mattum pothum!!.",
      image: chapter1Image1,
      songUrl: "/music/Nanbiye- Ending.mpeg"
    },
    {
      id: 'm2',
      title: "Varun's Diary about this Idiotic Priyanka!",
      caption: "Read Fully!!!",
      fullStory: `Un kooda naan romba Kammi-ana time dhaan spend panniruken Nerla, Aana namma travel panna time-um romba kammi dhaan, aana nijama solren... indha short time kooda nee create panna impact romba romba Nalla irundhchu. Sila per kooda varshakanakka travel kooda oru closeness, un kooda irukura indha konja nallave enaku vandhuduchu. Namma sethu spend panna andha ovvoru moment-um.. I was Happy that time.. Enakkunnu perusa connections yaarukoodaiyum illatha time la..unna madhiri oru pure soul en life-kulla vandhu enaku periya comfortable-ah irundhuchu. Namma bond mela thaan nalla conncection adhu innum continue aaganum nu naa nenaikuren.. I think this bond has no end. If no one exist with u- I'll be exist if u need.. ini enna thunbam vandhaalum. This Varun Loves you always whenever you need attention. Enjoy Pannu! Santhoshama iru! [(Vimal and Co) , (Ravichandran and Co)] - Make them care always and Care urself!! .`,
      date: "Unknown",
      location: "Bonding off Us",
      tag: "Chapter 1",
      likes: 62,
      songQuote: "Unnai Indru Paathathum Ennai naane Ketkiren!.",
      image: chapter1Image2,
      songUrl: "/music/Kadhaippoma reprise - .mpeg"
    }
  ],
  chapter2: [
    {
      id: 'm3',
      title: "Our Laughter days and us!",
      caption: "Those days!",

      fullStory: `Namma Siricha naal lam paathu romba naal aachu la , avlo pesuvom avlo irukum.. aana adhula ipo andha alavuku illa ngra apo oru maari different ah iruku.. pesurom avlodhaan nu iruku.. But , it's ok nu accept pannitu poiten.. situations will change us unaku solliruken la adhu pola thaan nadakum pola.. namakunu neram amaiyum bodhu paathu pesikalam.. Santhoshama apo irundha polaiye iruku apo irudnhu ipo unaku oru difference na kalyanam aiduchu and baaram neraiya irukum.. adhulaiyum santhoshama enkooda epd happy ah pesitu santhosham ah irundhiyo adhu polaiye ellathaiyume happy ku convert panni apd pazhagiko priya!!`,
      date: "/",
      location: "Melted ",
      tag: "Chapter 2",
      likes: 78,
      songQuote: "Idharkellaam arthanagal enna Kekka vendum unnai Kaalam kai koodinal.",
      image: chapter2Image1,
      songUrl: "/music/Kadhaippoma reprise - .mpeg"
    },
    {
      id: 'm4',
      title: "Your Daddy Advices!",
      caption: "Plot_Varthaigal!",
      fullStory: `Idhu varaikum na panna advices ellame unaku epd convey aachu therila.. aana nee nalla vithama thaan eduthu irupaa.. naa en ipd convey aagala nu solren na.. silathu eduthukum silathu eduthukathu adhukaaga sonnen.. aana sila vishiyam na sonna advice la nee ketadhu ellame i liked and i was happpy on that days. that oru normal person solra advices lam serious ah eduthukittu , Sometimes adhu kooda follow panra nuu perumaiyavum irukum.. advice ngra varthai normal aana vishiyam illa. Enkitta keta maari ellarukittaiyum advices kudukuranga na ketuko.. adhu unaku ennaiku venunaalum use aagum... indha photo kulla yen again add panni pannirukan na ennoda advices lam nee avlo value pannnathu naala andha moonju paathu unaku oru santhosham varum nu thaan.. I repeated this Picture Here! Ithey maari neeyum neraiya peruku advices pannanum.. avangalukuu scratch lernthu puriyura maari nee solli kudukanum.. matured ah simple ah advice panrathu vida na unaku kili pullaiku solli thara maariyaana advice maari neeyum ellaruukum pannanum.. I hope u will do ur best to everyone! Unaku yaarum illa advice panna nu nenaikatha.. Neeyum neraiya peru paapa , go through panuva , pesuva.. Ellarukum amaiyyudhu unaku amaiyaathu apd nu lam nenaikatha... you'll also get persons to speak.. strangers is also better for advices and avanga pannalum nalla kaadhula vaangi unaku pudichudhu na ethuko.. pudikala  la vittudu apd illa na adha un vazhila purinjikitu apd kooda iru! BE Happy for this!..  Advices nu oru card potu sollanum nu illa.. unnoda indha life laiyum nee itha go through panni survive pannanum , Kasta pada koodathu nu nenachi - I made this!`,
      date: "-",
      location: "Peak_Advices",
      tag: "Chapter 2",
      likes: 85,
      songQuote: "Side by side through sunshine and rain.",
      image: chapter2Image2,
      songUrl: "/music/FInal Confrontation BGM.mpeg"
    }
  ],
  chapter3: [
    {
      id: 'm7',
      title: "It's About You!",
      caption: "urself <3.",
      fullStory: `Priyanka! , Ennala mudinja ipo irukura priyanka ku kudukura advise.. Vimal paathupan adhulam aana en side lernthu nee unnoda self priyanka ku solrathu ithu.. Unnoda ipo irukura situation unaku epd poitu iruku nu regular ah theriyala.. aana ini nee unnoda nokkam enna na unakaanathu thedu , first nee yaaaru nu therinjika unaku enna varum nu first yosichhi paaru unaku naa kadaisi ah viddeo call la sonnnathu thaan.. unaakana carrer ethu nu choose pannnu.. unnala mudinja vara unnoda efforts potu adhula concentrate panni adhula velaiku pora vazhi ya paaru.. neraiya peru 1000 solluvanga ethaiyume kaadhula vaangikama , unakaana ethu unna ethu growth pannum nu first choose pannu.... Aana nee nenacha unaku irukura talent la nee neraiya kathupa , pannuva adhu theriyum , adhuku edho kalyanam adhu idhu poiduchu nu vachiko.. idhuku aprm athuku gap kudukatha , odanum nu nenachika , sambarikanum nu nenaaichiko , avan oru side avan kastathula oditu irukaan.. neeyum adhukaaga baaram avan side epd koraika mudiyum , un side la nee velaiku poi epd koraika mudiyum apd nu yosi.. Innum nee poga poga days thalli pochu na unaku thalli poite irukum.. Adhunala Try to upskill urself.. don't get delayed.. vayasu aaga aaga pvt la lam kelvi kepaanunga ivlo varusham enna panninga adhu maari.. illa govt try panra na exams ezhuthu veetlaiye padi.. adhukaaga concentrate pamnnu.. edhacham oru vagai la unnaiya nee improve panrathuku kaaga edhcham try pannu priyanka.. Indha maari solrathu ipo nee irukura situation la unaku hurt aaguma illa enmela kova paduviya therila.. enaku nee ipo irukura situation ennanu therila adhunala ennala nee sila vishiyangal la improvement pannanum nu naa idhu solre.. edhacham thappu ah irundha mannnichiko.. 
      Ivlo uhm unaku solrathukaana Kaaranam age poite irukum , days uhm poite irukum ngrathu kaaga sonnen! , Mathapadi endha oru negativity kaagavum sollala.. Ithuve unaku therinjadhu thaan aana en side lernthu edho ennala mudinja oru chinna advice.. adhu vachi edhacham oru imagine panni next level ku step edupe nu thaan sonnen.. Na en unna thaniya idhula potrukan naa.... Priyanka Vimal ah ellame ok thaan.. Priyanka oda self carrear wise neraiya yosika vendiya vishiyam iruku la adhukaaga solren.... Naa indha webpage la solliruka ella vishiyam uh meh repeated ah thaan irukum , every vishiyam uhmeh.. aana repeated ah irukurathu kaana kaaranam.. endha vidhathulaiyum unnoda  nee nikkura stand ah unaku neeye unna feel panna vachira koodathu.. Unna neeye suffocate panni feel panna vachira koodathu nu thaan ivlo uhm sollirukan.. idhu ellame nee endha vidhathula epd eduthukura therila.. But all these is for ur future goods , I think It may be useful for you!!! `,
      date: "-",
      location: "Your Unwritten Future",
      tag: "Chapter 3",
      likes: 150,
      songQuote: "Vazhkaila Munneru Jeichi Kaatu , Live Happy Stay Happy! , Happy Birthday Priyanka! ( SHOBANA)!! ",
      image: chapter3Image1,
      songUrl: "/music/Soulmate unite -.mpeg"
    }
  ]
};
