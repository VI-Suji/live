"use client";

import React, { useState } from "react";
import { FaShareAlt, FaWhatsapp, FaFacebookF, FaInstagram, FaLink, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { buildWhatsAppShareUrl } from "../utils/shareMeta";

type NewsShareMenuProps = {
  shareUrl: string;
  size?: "sm" | "md";
  className?: string;
};

const NewsShareMenu = ({ shareUrl, size = "md", className = "" }: NewsShareMenuProps) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    whatsapp: buildWhatsAppShareUrl(shareUrl),
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    instagram: "https://www.instagram.com/",
  };

  const iconSize = size === "sm" ? 12 : 14;
  const buttonClass =
    size === "sm"
      ? "p-1.5 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all"
      : "p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all";

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShare(!showShare);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleShareClick}
        className={buttonClass}
        aria-label="Share"
      >
        <FaShareAlt size={iconSize} />
      </button>

      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 flex gap-2 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all"
              aria-label="Share on WhatsApp"
            >
              <FaWhatsapp size={16} />
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all"
              aria-label="Share on Facebook"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href={shareLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 transition-all"
              aria-label="Share on Instagram"
            >
              <FaInstagram size={16} />
            </a>
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
              aria-label="Copy link"
            >
              {copied ? <FaCheck size={16} className="text-green-600" /> : <FaLink size={16} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsShareMenu;
