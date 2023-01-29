import React, { useEffect } from "react";
import "./App.css";
import About from "./partials/About";
import Card from "./partials/Card";
import Footer from "./partials/Footer";
import Skills from "./partials/Skills";
import data from "./assets/data";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
    const {
        name,
        title,
        social,
        skills,
        about: { title: aboutTitle, description: aboutDescription },
    } = data;

    useEffect(() => {
        AOS.init({
            once: true,
        });
    });

    return (
        <div className="min-h-screen py-10 px-3 sm:px-5 bg-gray-900">
            <div data-aos="fade-down" data-aos-duration="800">
                <Card name={name} title={title} social={social} />
            </div>
            <div
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="400"
            >
                <About title={aboutTitle} description={aboutDescription} />
                <Skills skills={skills} />
                <Footer userName={name} github={social.github} />
            </div>
        </div>
    );
}
export default App;
