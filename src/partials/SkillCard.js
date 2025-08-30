import React from "react";

const SkillCard = ({ skillName, skillIcon }) => {
    return (
        <div className="m-4 w-40 flex-none mx-auto text-center p-5 rounded-xl border-2 border-gray-400 text-gray-200">
            {skillIcon}

            <p className="text-xl font-semibold mt-4 text-gray-200">
                {skillName}
            </p>
        </div>
    );
};

export default SkillCard;
