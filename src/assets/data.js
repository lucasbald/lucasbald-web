import React from "react";
import { FaAmazon, FaCode, FaNodeJs, FaMicrosoft } from "react-icons/fa";

const BOOTSTRAP_FOR_SKILL_ICON = "text-4xl mx-auto inline-block";

const data = {
    name: "Lucas Baldin",
    title: "Scrum Master | Senior Software Engineer",
    social: {
        github: "https://github.com/lucasbald",
        linkedin: "https://www.linkedin.com/in/lbaldin",
        email: "lucas.sbaldin@gmail.com",
    },
    about: {
        title: "My Background",
        description:
            `Hello, my name is Lucas Baldin, and  I'd like to share a summary of my career so far =)\n
            I began my professional journey as a Web Developer at Info Jr., a junior company, where I gained experience in web development. I then took on the role of Executive/Financial Director at the same junior company, honing my management and leadership skills.\n
            Subsequently, I joined CI&T as an intern, working in a Support and Optimization team. During this time, I developed problem-solving skills and worked with the Adobe Experience Manager (AEM) platform also using the ITIL best practices as reference.\n
            As I progressed at CI&T, I was promoted to Software Engineer, where I had the opportunity to specialize in creating chatbots using technologies like BlipChat and Microsoft Bot. Additionally, I gained expertise in Node.js, Azure Functions, Cosmos DB, and Power BI, among other relevant technologies for building efficient solutions.\n
            More recently, I held the position of Senior Software Engineer at CI&T, where I was responsible for developing APIs using Node.js Lambda Functions. I also worked on integrations with databases such as Dynamo, Redis, and Aurora, as well as utilizing GraphQL and Location Services. Furthermore, I had the chance to develop the frontend using VUE 3 and expose it through AEM.\n
            Currently, I am working as a Scrum Master at CI&T, leading the agile process, collecting metrics, facilitating Scrum rituals, and collaborating on project planning and delivery. I am committed to fostering teamwork and maintaining close relationships with clients.`,
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
