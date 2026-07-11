import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
    const [tagline, setTagline] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/sanity/aboutUs`)
            .then(res => res.json())
            .then(data => {
                if (data && !data.error && data.description) setTagline(data.description);
            })
            .catch(() => {});
    }, []);

    return (
        <footer className="w-full bg-zinc-950 text-zinc-300 pt-16 pb-8 border-t border-zinc-800">
            <div className="page-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9">
                                <Image src="/gramika.png" alt="Gramika Logo" fill className="object-contain" />
                            </div>
                            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-white">
                                GRAMIKA NEWS ONLINE
                            </h2>
                        </div>
                        {tagline && (
                            <p className="text-zinc-400 leading-relaxed text-sm max-w-md">
                                {tagline}
                            </p>
                        )}
                        <div className="flex gap-2">
                            {[
                                { href: "https://www.facebook.com/GRAMIKATV/", icon: FaFacebookF, hover: "hover:bg-blue-600" },
                                { href: "https://www.instagram.com/gramikatv/reels/", icon: FaInstagram, hover: "hover:bg-pink-600" },
                                { href: "https://www.youtube.com/@GramikaTv", icon: FaYoutube, hover: "hover:bg-red-600" },
                                { href: "https://chat.whatsapp.com/Hyue1YLgww0E3DYtgQK97J", icon: FaWhatsapp, hover: "hover:bg-green-600" },
                            ].map(({ href, icon: Icon, hover }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white ${hover} transition-all duration-200 border border-zinc-700/50`}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="md:text-right space-y-5">
                        <h3 className="font-[family-name:var(--font-display)] font-medium text-white text-sm uppercase tracking-wider">
                            Contact
                        </h3>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li className="flex items-center gap-3 md:justify-end">
                                <FaEnvelope className="text-zinc-500 flex-shrink-0" size={14} />
                                <a href="mailto:newsgramika@gmail.com" className="hover:text-white transition-colors">
                                    newsgramika@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3 md:justify-end">
                                <FaPhone className="text-zinc-500 flex-shrink-0" size={14} />
                                <span>04902360808</span>
                            </li>
                            <li className="flex items-start gap-3 md:justify-end md:text-right">
                                <FaMapMarkerAlt className="text-zinc-500 mt-0.5 flex-shrink-0" size={14} />
                                <span>Gramika, Kuthuparmba Co. Op Rural Bank Complex,<br />Paral, Kuthuparamba</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-zinc-500">
                        © 2025 Gramika Limited. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-zinc-500">
                        <Link href="/about" className="hover:text-zinc-300 transition-colors">About</Link>
                        <Link href="/privacy-policy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-zinc-300 transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
