import React, { useEffect, useState } from "react";
import "./App.css";

import About from "./partials/About";
import Card from "./partials/Card";
import Footer from "./partials/Footer";
import Skills from "./partials/Skills";
import KonamiCode from "./partials/KonamiCode";

import data from "./assets/data";
import konamiImage from "./images/pangolier.png";

import AOS from "aos";
import "aos/dist/aos.css";

function App() {
    const { name, title, social, skills } = data;

    const [showImage, setShowImage] = useState(false);

    const handleKonamiCode = () => {
        setShowImage(true);
    };

    useEffect(() => {
        AOS.init({
            once: true,
        });
    });

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
}
export default App;
