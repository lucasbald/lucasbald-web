import React from "react";
import profile from "../images/profile.png";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";

const Card = ({ name, title, social: { github, linkedin, email } }) => {
    return (
        <div className="w-full">
            <div className="flex flex-col justify-center max-w-xs mx-auto bg-gray-800 shadow-xl rounded-xl p-5">
                <div className="">
                    <img
                        className="w-32 mx-auto shadow-xl rounded-full"
                        src={profile}
                        alt="Profile face"
                    />
                </div>
                <div className="text-center mt-5">
                    <p className="text-xl sm:text-2xl font-semibold text-gray-200">
                        {name}
                    </p>
                    <p className="text-xs sm:text-base text-gray-400 pt-2 pb-4 px-5 w-auto inline-block border-b-2">
                        {title}
                    </p>
                    <div className="flex align-center justify-center mt-4">
                        <a
                            className="text-xl m-1 p-1 sm:m-2 sm:p-2 text-gray-400 hover:bg-gray-800 rounded-full hover:text-white transition-colors duration-300"
                            href={github}
                        >
                            <FaGithub />
                            <span className="sr-only">Github</span>
                        </a>

                        <a
                            className="text-xl m-1 p-1 sm:m-2 sm:p-2 text-blue-500 hover:bg-blue-500 rounded-full hover:text-white transition-colors duration-300"
                            href={linkedin}
                        >
                            <FaLinkedin />
                            <span className="sr-only">Linkedin</span>
                        </a>

                        <a
                            className="text-xl m-1 p-1 sm:m-2 sm:p-2 text-teal-500 hover:bg-teal-500 rounded-full hover:text-white transition-colors duration-300"
                            href={
                                "https://mail.google.com/mail/?view=cm&fs=1&to=" +
                                email
                            }
                        >
                            <FaRegEnvelope />
                            <span className="sr-only">Email</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
