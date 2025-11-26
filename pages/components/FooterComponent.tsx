import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">ഗ്രാമിക</h2>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            ഗ്രാമങ്ങളുടെ ഹൃദയതാളം. സത്യസന്ധമായ വാർത്തകളും വിശേഷങ്ങളും നിങ്ങളുടെ വിരൽത്തുമ്പിൽ.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-all duration-300">
                                <FaInstagram />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-all duration-300">
                                <FaYoutube />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-all duration-300">
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Home</a></li>
                            <li><a href="#top-stories" className="hover:text-blue-600 transition-colors">Top Stories</a></li>
                            <li><a href="#live-section" className="hover:text-blue-600 transition-colors">Live TV</a></li>
                            <li><a href="#socials" className="hover:text-blue-600 transition-colors">Social Media</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6">Categories</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Kerala</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">National</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Politics</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Entertainment</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li>Email: contact@gramika.tv</li>
                            <li>Phone: +91 98765 43210</li>
                            <li>Address: Gramika Media House,<br />Kochi, Kerala, India</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © 2025 Gramika Limited. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
