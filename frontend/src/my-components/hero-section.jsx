import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  defaultProps,
  genresWrapperVars,
  heroBgVars,
  heroGenreVars,
  heroImageTitleVars,
  heroImageVars,
  staggerProps,
} from "../lib/constans";
import { formatUserFullName } from "../lib/utliles";
import api from "../lib/axios-utils";

function HeroSection() {
  const showCount = 10;
  const [heroShows, setHeroShows] = useState([]);
  const [showIndex, setShowIndex] = useState(5);
  const [paused, setPaused] = useState(false);

  const [loading, setLoading] = useState(true);

  function handleSlider(index, prev, next) {
    if (index || index === 0) {
      setShowIndex(index);
    }
    if (prev) {
      setShowIndex((currentIndex) => (currentIndex - 1) % showCount);
    }
    if (next) {
      setShowIndex((currentIndex) => (currentIndex + 1) % showCount);
    }
  }
  async function getHeroShows() {
    setLoading(true);
    try {
      const response = await api.get(
        `/shows/filtered?exceptImg=null&limit=${showCount}`
      );
      setHeroShows(response.data.showsData);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    getHeroShows();
  }, []);

  useEffect(() => {
    if (paused) return;
    const slideTimer = setInterval(
      () => setShowIndex((currentIndex) => (currentIndex + 1) % showCount),
      5000
    );

    return () => clearInterval(slideTimer);
  }, [paused]);

  return (
    <div className=" w-full h-[100vh] absolute inset-0 overflow-hidden bg-secondary/20 backdrop-blur-sm">
      {!loading && (
        <AnimatePresence mode="popLayout">
          <motion.div
            {...defaultProps}
            key={showIndex}
            className="relative flex flex-col lg:flex-row h-full overflow-hidden gap-2 lg:gap-20"
          >
            <motion.div
              variants={heroBgVars}
              className="absolute inset-0 -z-10 overflow-hidden"
              style={{
                backgroundImage: `url(${heroShows[showIndex].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="absolute inset-0  backdrop-blur-md"
                style={{
                  backgroundImage: `linear-gradient(180deg,transparent 0%,transparent 10%,#020412 100%)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </motion.div>
            <div className="px-8 lg:px-12 pt-28 w-full lg:w-[60%]">
              <motion.div
                variants={heroImageVars}
                className="w-full h-[30rem] lg:h-[40rem]  rounded-3xl overflow-hidden shadow-xl "
              >
                <img
                  className=" w-full h-full"
                  src={heroShows[showIndex]?.image}
                  alt={heroShows[showIndex].title}
                />
              </motion.div>
            </div>
            <div className="flex flex-col lg:justify-end lg:h-[38rem] p-4 w-full gap-4">
              <Link to={`/shows/${heroShows[showIndex]._id}`}>
                <motion.h1 className="text-white" variants={heroImageTitleVars}>
                  {heroShows[showIndex].title}
                </motion.h1>
              </Link>
              <motion.div
                className="p-4 flex gap-4 text-white"
                {...staggerProps}
                variants={genresWrapperVars}
              >
                {heroShows[showIndex].genre.length > 0 &&
                  heroShows[showIndex].genre.map((genre) => (
                    <motion.p key={genre} variants={heroGenreVars}>
                      {formatUserFullName(genre)}
                    </motion.p>
                  ))}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      <div className="mt-auto space-y-2 absolute bottom-0 left-0 z-10 flex flex-col items-center w-full ">
        <div className="flex items-center justify-center ">
          {Array(10)
            .fill()
            .map((dash, i) => (
              <span
                key={i}
                className={`w-5 h-2 rounded-full inline-block ${
                  i === showIndex ? "bg-white" : "bg-gray-400"
                }`}
                onClick={() => handleSlider(i, false, false)}
              ></span>
            ))}
        </div>
        <div className="flex gap-8 items-center justify-center pb-4">
          <button
            type="button"
            onClick={() => handleSlider(false, true, false)}
          >
            <ChevronLeft />
          </button>
          <button type="button" onClick={() => setPaused(!paused)}>
            {!paused ? <Pause /> : <Play />}
          </button>
          <button
            type="button"
            onClick={() => handleSlider(false, false, true)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
