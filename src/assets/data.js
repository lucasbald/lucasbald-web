import React from "react";
import { FaAmazon, FaCode, FaNodeJs, FaMicrosoft } from "react-icons/fa";

const BOOTSTRAP_FOR_SKILL_ICON = "text-4xl mx-auto inline-block";

const data = {
    name: "Lucas Baldin",
    title: "Back-End Developer / Front-End Enthusiast",
    social: {
        github: "https://github.com/lucasbald",
        linkedin: "https://www.linkedin.com/in/lbaldin/",
        email: "lucas.sbaldin@gmail.com",
    },
    about: {
        title: "My Background",
        description:
            "I worked for about 3 years in a Junior Company, as a Web developer and Chief Legal Officer. " +
            "Started working in Ci&T in 2018, as an intern, on a Support and Legacy Optimization team, answering L2 tickets and developing L3 tickets, through AEM. " +
            "I have 2 years of experience being an automation QA, developing tests for Lambda functions, and also creating an automation tool in NodeJS. " +
            "Nowadays, I'm developing web services and integrations for Chat Bots, using Azure and Microsoft Framework.",
    },
    skills: [
        {
            skillName: "Backend",
            skillIcon: <FaCode className={BOOTSTRAP_FOR_SKILL_ICON} />,
        },
        {
            skillName: "NodeJS",
            skillIcon: <FaNodeJs className={BOOTSTRAP_FOR_SKILL_ICON} />,
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
