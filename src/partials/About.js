import React from "react";
import { useTranslation } from "react-i18next";
import ptBrIcon from "../images/icons8-brazil-48.png";
import enUsIcon from "../images/icons8-usa-48.png";

const About = () => {
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="max-w-4xl mx-auto mt-16 text-center">
            <button onClick={() => changeLanguage("pt-BR")}>
                <img
                    className="w-10 shadow-xl"
                    src={ptBrIcon}
                    alt="pt-BR Icon"
                />
            </button>

            <button onClick={() => changeLanguage("en-US")}>
                <img
                    className="w-10 shadow-xl"
                    src={enUsIcon}
                    alt="en-US Icon"
                />
            </button>

            <p className="text-2xl md:text-4xl font-bold text-center text-gray-200">
                {t("about.title")}
            </p>

            <p className="text-base text-justify text-gray-300 leading-relaxed mt-4">
                {t("about.description")
                    .split("\n")
                    .map((line, index) => {
                        if (line.trim() === "") return null;

                        return (
                            <React.Fragment key={index}>
                                <p className="text-base text-justify text-gray-300 leading-relaxed mt-4">
                                    {line}
                                </p>
                            </React.Fragment>
                        );
                    })}
            </p>
        </div>
    );
};

export default About;
