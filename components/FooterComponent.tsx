import React from "react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/gramika.png"
                                    alt="Gramika Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">ഗ്രാമിക</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm max-w-md">
                            ഗ്രാമീണതയുടെ ഹൃദയതാളം. സത്യസന്ധമായ വാർത്തകളും വിശേഷങ്ങളും നിങ്ങളുടെ വിരൽത്തുമ്പിൽ.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://www.facebook.com/GRAMIKATV/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all duration-300 border border-white/10"
                            >
                                <FaFacebookF size={18} />
                            </a>
                            <a
                                href="https://www.instagram.com/gramikatv/reels/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-pink-600 hover:scale-110 transition-all duration-300 border border-white/10"
                            >
                                <FaInstagram size={18} />
                            </a>
                            <a
                                href="https://www.youtube.com/@GramikaTv"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 hover:scale-110 transition-all duration-300 border border-white/10"
                            >
                                <FaYoutube size={18} />
                            </a>
                            <a
                                href="https://chat.whatsapp.com/Hyue1YLgww0E3DYtgQK97J"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-green-500 hover:scale-110 transition-all duration-300 border border-white/10"
                            >
                                <FaWhatsapp size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="md:text-right space-y-6">
                        <h3 className="font-black text-xl text-white mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-center gap-3 md:justify-end">
                                <FaEnvelope className="text-blue-400" />
                                <a href="mailto:newsgramika@gmail.com" className="hover:text-white transition-colors">
                                    newsgramika@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3 md:justify-end">
                                <FaPhone className="text-green-400" />
                                <span>04902360808</span>
                            </li>
                            <li className="flex items-start gap-3 md:justify-end md:text-right">
                                <FaMapMarkerAlt className="text-red-400 mt-1" />
                                <span>Gramika, Kuthuparmba Co. Op Rural Bank Complex,<br />Paral, Kuthuparamba</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © 2025 Gramika Limited. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
