import React from "react";

const Footer = ({ github, userName }) => {
    return (
        <div className="text-center w-full mt-16">
            <p className="text-gray-200 mb-4">
                Made with{" "}
                <span role="img" aria-label="heart">
                    💙
                </span>{" "}
                by{" "}
                <a className="text-blue-500 hover:underline" href={github}>
                    {userName}
                </a>
            </p>
        </div>
    );
};

export default Footer;
