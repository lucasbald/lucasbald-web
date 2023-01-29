import React from "react";
import SkillCard from "./SkillCard";

const Skills = ({ skills }) => {
    return (
        <div className="flex flex-col sm:flex-row align-center justify-center max-w-2xl mx-auto mt-8">
            {skills.map((skill) => {
                const { skillName, skillIcon } = skill;

                return (
                    <SkillCard
                        key={skillName}
                        skillName={skillName}
                        skillIcon={skillIcon}
                    />
                );
            })}
        </div>
    );
};

export default Skills;
