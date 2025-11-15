import React from "react";
import { FaCopyright } from "react-icons/fa";

const Footer = () => {
    return (

        <footer className="w-full flex justify-center my-8 px-10">
            <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-6 
                                    bg-white backdrop-blur-md rounded-2xl text-black text-sm sm:text-base shadow-lg"
            >
                <div className="flex items-center gap-2">
                    <FaCopyright className="text-5xl sm:text-3xl" />
                    <span className="font-bold">Copyright Gramika Limited 2025. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
