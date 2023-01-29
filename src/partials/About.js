import React from "react";

const About = ({ title, description }) => {
    return (
        <div className="max-w-4xl mx-auto mt-16">
            <p className="text-2xl md:text-4xl font-bold text-center text-gray-300">
                {title}
            </p>
            <p className="text-base text-justify md:text-center text-gray-500 leading-relaxed mt-4">
                {description}
            </p>
        </div>
    );
};

export default About;
