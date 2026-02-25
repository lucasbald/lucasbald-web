import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import About from "./partials/About";
import Card from "./partials/Card";
import Footer from "./partials/Footer";
import Skills from "./partials/Skills";
import KonamiCode from "./partials/KonamiCode";
import Voucher from "./partials/Voucher";
import DotaHome from "./pages/DotaHome";
import DotaPlayer from "./pages/DotaPlayer";
import DotaMatch from "./pages/DotaMatch";
import DotaHeroes from "./pages/DotaHeroes";
import DotaHeroDetail from "./pages/DotaHeroDetail";

import data from "./assets/data";
import konamiImage from "./images/pangolier.png";

import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
    const { name, title, social, skills } = data;
    const [showImage, setShowImage] = useState(false);

    const handleKonamiCode = () => {
        setShowImage(true);
    };

    useEffect(() => {
        AOS.init({ once: true });
    }, []);

    return (
        <div className="min-h-screen py-10 px-3 sm:px-5 bg-gray-800">
            <div data-aos="fade-down" data-aos-duration="800">
                <Card name={name} title={title} social={social} />
            </div>
            <div
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="400"
            >
                <About />
                <KonamiCode onKonamiCode={handleKonamiCode} />
                {showImage && (
                    <img
                        src={konamiImage}
                        alt="Konami"
                        className="flex flex-col justify-center max-w-xs mx-auto bg-gray-800 shadow-xl rounded-xl p-5"
                    />
                )}

                <Skills skills={skills} />
                <Footer userName={name} github={social.github} />
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/voucher" element={<Voucher />} />
                <Route path="/dota" element={<DotaHome />} />
                <Route path="/dota/heroes" element={<DotaHeroes />} />
                <Route
                    path="/dota/heroes/:heroId"
                    element={<DotaHeroDetail />}
                />
                <Route path="/dota/player/:steamId" element={<DotaPlayer />} />
                <Route
                    path="/dota/player/:steamId/match/:matchId"
                    element={<DotaMatch />}
                />
            </Routes>
        </Router>
    );
};

export default App;
