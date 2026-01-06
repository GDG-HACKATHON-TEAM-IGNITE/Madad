import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Self_defence = () => {
  const images = [
    {
      gif: "https://i.pinimg.com/originals/8f/28/3d/8f283db9240e684db7c33f9eb3165a5f.gif",
      poster: "https://i.pinimg.com/736x/8f/28/3d/8f283db9240e684db7c33f9eb3165a5f.jpg",
    },
    {
      gif: "https://i.pinimg.com/originals/99/f0/d8/99f0d8f044454ef908d636ff8c7be7a0.gif",
      poster: "https://i.pinimg.com/736x/99/f0/d8/99f0d8f044454ef908d636ff8c7be7a0.jpg",
    },
    {
      gif: "https://i.pinimg.com/originals/1b/bd/58/1bbd58d5332543d213a6406662d42998.gif",
      poster: "https://i.pinimg.com/736x/1b/bd/58/1bbd58d5332543d213a6406662d42998.jpg",
    },
    {
      gif: "https://i.pinimg.com/originals/a6/28/e7/a628e72364b576a6463e13745d296ce8.gif",
      poster: "https://i.pinimg.com/736x/a6/28/e7/a628e72364b576a6463e13745d296ce8.jpg",
    },
    {
      gif: "https://i.pinimg.com/originals/eb/dd/96/ebdd96705b184434d7b6e8b912e8dd40.gif",
      poster: "https://i.pinimg.com/736x/eb/dd/96/ebdd96705b184434d7b6e8b912e8dd40.jpg",
    },
    {
      gif: "https://i.pinimg.com/originals/db/0e/61/db0e61b1b3e11af3c08cb6ffbe8da712.gif",
      poster: "https://i.pinimg.com/736x/db/0e/61/db0e61b1b3e11af3c08cb6ffbe8da712.jpg",
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [current, setCurrent] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(null);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrent(emblaApi.selectedScrollSnap());
      setPlayingIndex(null);
    };

    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <div className="w-full flex flex-col items-center mt-12 sm:mt-20 mb-10 px-4">
      {/* Heading */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl mb-4 text-center">
        Self-Defence,{" "}
        <span className="text-[#A7C7E7]">Made Simple</span>
      </h1>

      <p className="max-w-3xl text-center text-gray-500 font-light mb-10 sm:mb-16 text-sm sm:text-base">
        Self-defence here is not about fighting. It's about awareness, calm
        responses, and simple actions — designed for real situations and quiet confidence.
      </p>

      {/* Carousel */}
      <div className="relative w-full overflow-hidden">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex h-75 sm:h-105 lg:h-125">
            {images.map((img, index) => (
              <div
                key={index}
                className="
                  relative 
                  flex-[0_0_100%] 
                  sm:flex-[0_0_50%] 
                  lg:flex-[0_0_25%] 
                  px-2 sm:px-3 
                  flex items-center justify-center
                "
              >
                <motion.div
                  animate={{
                    clipPath:
                      current === index
                        ? "inset(0 0 0 0 round 1.5rem)"
                        : "inset(15% 0 15% 0 round 1.5rem)",
                  }}
                  className="h-full w-full overflow-hidden rounded-2xl bg-black"
                >
                  {playingIndex === index ? (
                    <img
                      src={img.gif}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      onClick={() => setPlayingIndex(index)}
                      className="relative h-full w-full cursor-pointer"
                    >
                      <img
                        src={img.poster}
                        alt=""
                        className="h-full w-full object-cover"
                      />

                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/90 flex items-center justify-center text-lg sm:text-xl">
                          ▶
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 sm:px-6">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="rounded-full bg-black/10 p-2"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="rounded-full bg-black/10 p-2"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Pagination */}
        <div className="mt-6 sm:mt-10 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                current === i ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Self_defence;
