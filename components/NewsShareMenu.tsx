"use client";

import React, { useState } from "react";
import { FaShareAlt, FaWhatsapp, FaFacebookF, FaInstagram, FaLink, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { buildWhatsAppShareUrl } from "../utils/shareMeta";

type NewsShareMenuProps = {
  shareUrl: string;
  size?: "sm" | "md";
  variant?: "light" | "dark" | "on-dark" | "prominent";
  className?: string;
  layout?: "dropdown" | "inline";
  menuPlacement?: "above" | "below";
};

const NewsShareMenu = ({
  shareUrl,
  size = "md",
  variant = "light",
  className = "",
  layout = "dropdown",
  menuPlacement = "above",
}: NewsShareMenuProps) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    whatsapp: buildWhatsAppShareUrl(shareUrl),
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    instagram: "https://www.instagram.com/",
  };

  const iconSize = size === "sm" ? 12 : 14;
  const isOnDark = variant === "dark" || variant === "on-dark";
  const isProminent = variant === "prominent";

  const buttonClass = size === "sm"
    ? `rounded-lg transition-all duration-200 ${
        isProminent
          ? "p-2 bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)] border border-[var(--border-default)] shadow-sm"
          : isOnDark
            ? "p-2 bg-white/20 text-white hover:bg-white/30 border border-white/25 shadow-sm"
            : "p-1.5 bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)]"
      }`
    : `rounded-lg transition-all duration-200 ${
        isProminent
          ? "p-2.5 bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)] border border-[var(--border-default)] shadow-sm"
          : isOnDark
            ? "p-2.5 bg-white/20 text-white hover:bg-white/30 border border-white/25 shadow-sm"
            : "p-2 bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)]"
      }`;

  const menuPositionClass =
    menuPlacement === "above"
      ? "absolute right-0 bottom-full mb-2"
      : "absolute right-0 top-full mt-2";

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (layout === "inline") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`} onClick={(e) => e.stopPropagation()}>
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="story-share-btn story-share-btn--whatsapp"
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp size={16} />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="story-share-btn story-share-btn--facebook"
          aria-label="Share on Facebook"
        >
          <FaFacebookF size={16} />
        </a>
        <a
          href={shareLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="story-share-btn story-share-btn--instagram"
          aria-label="Share on Instagram"
        >
          <FaInstagram size={16} />
        </a>
        <button
          type="button"
          onClick={copyToClipboard}
          className="story-share-btn story-share-btn--copy"
          aria-label="Copy link"
        >
          {copied ? <FaCheck size={16} className="text-green-600 dark:text-green-400" /> : <FaLink size={16} />}
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setShowShare(!showShare); }}
        className={buttonClass}
        aria-label="Share"
        aria-expanded={showShare}
      >
        <FaShareAlt size={iconSize} />
      </button>

      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: menuPlacement === "above" ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: menuPlacement === "above" ? 4 : -4 }}
            transition={{ duration: 0.15 }}
            className={`${menuPositionClass} bg-[var(--bg-elevated)] rounded-xl shadow-[var(--shadow-lg)] border border-[var(--border-default)] p-1.5 flex gap-1 z-[60]`}
            onClick={(e) => e.stopPropagation()}
          >
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 rounded-lg hover:bg-green-500/10 text-green-600 transition-colors" aria-label="WhatsApp">
              <FaWhatsapp size={15} />
            </a>
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-600 transition-colors" aria-label="Facebook">
              <FaFacebookF size={15} />
            </a>
            <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 rounded-lg hover:bg-pink-500/10 text-pink-600 transition-colors" aria-label="Instagram">
              <FaInstagram size={15} />
            </a>
            <button onClick={copyToClipboard} className="p-2 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] transition-colors" aria-label="Copy link">
              {copied ? <FaCheck size={15} className="text-green-600" /> : <FaLink size={15} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsShareMenu;
