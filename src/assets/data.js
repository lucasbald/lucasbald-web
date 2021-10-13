import React from "react";
import { FaAmazon, FaCode, FaNodeJs, FaMicrosoft } from "react-icons/fa";

const BOOTSTRAP_FOR_SKILL_ICON = "text-4xl mx-auto inline-block";

const data = {
    name: "Lucas Baldin",
    title: "Back-End Developer/Front-End enthusiast",
    social: {
        github: "https://github.com/lucasbald",
        linkedin: "https://www.linkedin.com/in/lbaldin/",
        email: "lucas.sbaldin@gmail.com",
    },
    about: {
        title: "My Background",
        description:
            "1 year professional experience in the Support/Legacy Optimization area. Answering N2 tickets and developing N3 tickets. I worked for 2 years as an automation QA, developing tests for APIs. And today I'm developing services and integrations for Chat Bots.",
    },
    skills: [
        {
            skillName: "NodeJS",
            skillIcon: <FaNodeJs className={BOOTSTRAP_FOR_SKILL_ICON} />,
        },
        {
            skillName: "Backend",
            skillIcon: <FaCode className={BOOTSTRAP_FOR_SKILL_ICON} />,
        },
        {
            skillName: "AWS",
            skillIcon: <FaAmazon className={BOOTSTRAP_FOR_SKILL_ICON} />,
        },
        {
            skillName: "Azure",
            skillIcon: <FaMicrosoft className={BOOTSTRAP_FOR_SKILL_ICON} />,
        },
    ],
};

export default data;
