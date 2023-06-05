import React from "react";

const About = ({ title, description }) => {
    const lines = description.split("\n");

    return (
        <div className="max-w-4xl mx-auto mt-16">
            <p className="text-2xl md:text-4xl font-bold text-center text-gray-300">
                {title}
            </p>
            {lines.map((line, index) => {
                if (line.trim() === "") return null;

                return (
                    <React.Fragment key={index}>
                        <p className="text-base text-justify text-gray-500 leading-relaxed mt-4">
                            {line}
                        </p>
                        {index !== lines.length - 1 && <br/>}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default About;
