import React from "react";
import { FaAmazon, FaCode, FaNodeJs, FaMicrosoft } from "react-icons/fa";

const BOOTSTRAP_FOR_SKILL_ICON = "text-4xl mx-auto inline-block";

const data = {
    name: "Lucas Baldin",
    title: "Project Manager",
    social: {
        github: "https://github.com/lucasbald",
        linkedin: "https://www.linkedin.com/in/lbaldin",
        email: "lucas.sbaldin@gmail.com",
        medium: "https://medium.com/@lucas.sbaldin",
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
