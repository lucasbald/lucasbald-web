import React, { useEffect, useRef } from "react";

const KonamiCode = ({ onKonamiCode }) => {
    const konamiCode = useRef([]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const { key } = event;

            konamiCode.current.push(key);

            if (konamiCode.current.length > 10) {
                konamiCode.current.shift();
            }

            const konamiSequence = [
                "p",
                "a",
                "n",
                "g",
                "o",
                "l",
                "i",
                "e",
                "r",
            ];

            if (konamiCode.current.join() === konamiSequence.join()) {
                onKonamiCode();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onKonamiCode]);

    return <></>;
};

export default KonamiCode;
