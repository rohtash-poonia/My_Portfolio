import { useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import SV from "../assets/SV.png"; // your logo
import { FiMenu } from "react-icons/fi";
import clickSoundFile from "./key5.wav";
import backgroundSongFile from "./song.mp3"; // ✅ import background music

export default function Navbar() {
  const [menuopen, setMenuopen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [forcevisible, setforcevisible] = useState(false);

  // ------------------- Audio Setup -------------------
  const clickAudio = useRef(new Audio(clickSoundFile));

  // -------- Background music setup -------------
  const musicAudio = useRef(new Audio(backgroundSongFile));
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    const audio = musicAudio.current;
    audio.loop = true; // loop music

    // try autoplay
    audio.play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => console.log("Autoplay blocked. Click Music button to start."));

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // -------- Click handlers ----------------
  const handleMenuClick = () => {
    const audio = clickAudio.current;
    audio.currentTime = 0; // reset for rapid clicks
    audio.play().catch((e) => console.log("Audio play failed:", e));
    setMenuopen(true);
  };

  const handleMusicToggle = () => {
    const audio = musicAudio.current;
    if (isMusicPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.log("Play failed:", e));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  // ------------------- Scroll Visibility -------------------
  const lastscroll = useRef(0);
  const timeid = useRef(null);

  useEffect(() => {
    const homesection = document.querySelector("#home");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setforcevisible(true);
          setVisible(true);
        } else {
          setforcevisible(false);
        }
      },
      { threshold: 0.1 }
    );
    if (homesection) observer.observe(homesection);
    return () => {
      if (homesection) observer.unobserve(homesection);
    };
  }, []);

  useEffect(() => {
    const handlescroll = () => {
      if (forcevisible) {
        setVisible(true);
        return;
      }
      const currentscrolly = window.scrollY;
      if (currentscrolly > lastscroll.current) setVisible(false);
      else {
        setVisible(true);
        if (timeid.current) clearTimeout(timeid.current);
        timeid.current = setTimeout(() => setVisible(false), 3000);
      }
      lastscroll.current = currentscrolly;
    };
    window.addEventListener("scroll", handlescroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handlescroll);
      if (timeid.current) clearTimeout(timeid.current);
    };
  }, [forcevisible]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center space-x-0 -translate-y-7 -translate-x-5">
          <img src={SV} alt="Logo" className="w-20 h-20 object-contain" />
          <span className="text-2xl font-bold text-white">.PORTFOLIO</span>
        </div>

        <div className="block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-10 -translate-y-7">
          <button
            onClick={handleMenuClick}
            className="text-white text-3xl focus:outline-none"
            aria-label="open Menu"
          >
            <FiMenu />
          </button>
        </div>

        <div className="hidden lg:block -translate-y-6">
          <button
            onClick={handleMusicToggle} // ✅ toggle music
            className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-5 py-2 rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity duration-300"
          >
            {isMusicPlaying ? "Stop Music" : "Play Music"}
          </button>
        </div>
      </nav>

      <Menu isOpen={menuopen} onClose={() => setMenuopen(false)} />
    </>
  );
}