import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { FaArrowLeft, FaShareAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { PortableText } from "@portabletext/react";
import { motion, useScroll, useSpring } from "framer-motion";
import Meta from "../../components/Meta";
import { findNewsPostByIdentifier, NewsPost } from "../../utils/newsPost";
import { decodeSlug, getNewsSlug } from "../../utils/slugify";
import {
  buildWhatsAppShareUrl,
  getCanonicalNewsShareUrl,
  getNewsCategoryLabel,
  getOgImageUrl,
  getPlainTextDescription,
} from "../../utils/shareMeta";

type SanityPost = NewsPost;

type Props = {
  post: SanityPost | null;
  currentSlug: string;
};

export default function NewsSlugPage({ post, currentSlug }: Props) {
  const router = useRouter();
  const shareUrl = getCanonicalNewsShareUrl(post?.title || currentSlug, post?._id);
  const shareTitle = post ? `${post.title} | Gramika News` : "Gramika News";
  const shareDescription = post
    ? getPlainTextDescription(post.excerpt, post.title)
    : "Gramika News";
  const shareImage = post ? getOgImageUrl(post.seoImage || post.mainImage) : undefined;
  const shareSection = post ? getNewsCategoryLabel(post._type, post.category) : undefined;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [readingTime, setReadingTime] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (post?.body) {
      const text = JSON.stringify(post.body);
      const words = text.split(/\s+/).length;
      setReadingTime(Math.ceil(words / 200));
    }
  }, [post]);

  const [shareUrlState, setShareUrlState] = useState(shareUrl);

  useEffect(() => {
    setShareUrlState(window.location.href);
  }, []);

  if (router.isFallback || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <div className="w-10 h-10 border-2 border-[var(--border-default)] border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString();
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrlState)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrlState)}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrlState)}`,
    whatsapp: buildWhatsAppShareUrl(shareUrlState),
  };

  const portableTextComponents = {
    types: {
      image: ({ value }: { value: { asset?: { url?: string }; url?: string; alt?: string; caption?: string } }) => (
        <figure className="my-10 sm:my-14">
          <div className="image-frame relative aspect-[16/10]">
            <Image
              src={value.asset?.url || value.url || ""}
              alt={value.alt || "Article image"}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-[var(--text-tertiary)] mt-3 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ),
    },
    block: {
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-display text-2xl sm:text-3xl text-[var(--text-primary)] mt-12 mb-5 leading-tight border-l-[3px] border-[var(--accent)] pl-4">
          {children}
        </h2>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-display text-xl sm:text-2xl text-[var(--text-primary)] mt-10 mb-4 leading-snug">
          {children}
        </h3>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h4 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mt-8 mb-3">
          {children}
        </h4>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="my-10 py-6 px-6 sm:px-8 bg-[var(--bg-muted)] border-l-[3px] border-[var(--accent)] rounded-r-xl">
          <p className="text-lg sm:text-xl leading-relaxed italic text-[var(--text-secondary)] pl-6">
            {children}
          </p>
        </blockquote>
      ),
      normal: ({ children }: { children?: React.ReactNode }) => (
        <p className="text-[1.0625rem] sm:text-[1.125rem] leading-[1.85] text-[var(--text-secondary)] mb-6">
          {children}
        </p>
      ),
    },
    list: {
      bullet: ({ children }: { children?: React.ReactNode }) => (
        <ul className="space-y-2 my-6 pl-5 list-disc marker:text-[var(--accent)]">{children}</ul>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <ol className="space-y-2 my-6 pl-5 list-decimal marker:text-[var(--accent)] marker:font-semibold">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children?: React.ReactNode }) => (
        <li className="text-[1.0625rem] sm:text-[1.125rem] text-[var(--text-secondary)] leading-[1.85] pl-1">{children}</li>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <li className="text-[1.0625rem] sm:text-[1.125rem] text-[var(--text-secondary)] leading-[1.85] pl-1">{children}</li>
      ),
    },
    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>
      ),
      em: ({ children }: { children?: React.ReactNode }) => (
        <em className="italic">{children}</em>
      ),
      link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string } }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <div className="page-bg min-h-screen">
      <Meta
        title={shareTitle}
        description={shareDescription}
        keywords={`${post.title}, ${shareSection || ''}, Gramika News, ഗ്രാമിക, Malayalam News, Kerala News, Local News`}
        image={shareImage}
        imageAlt={post.title}
        url={shareUrl}
        type="article"
        articleData={{
          publishedTime: post.publishedAt,
          author: post.author || "Gramika Team",
          section: shareSection,
        }}
      />

      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[var(--accent)] origin-left z-50"
        style={{ scaleX }}
      />

      <nav className="sticky top-0 w-full bg-[var(--bg-surface)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
          >
            <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-[family-name:var(--font-display)] font-medium">Back</span>
          </button>

          <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-[var(--text-primary)] hidden sm:block">
            GRAMIKA NEWS
          </span>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-all"
            >
              <FaShareAlt className="text-sm" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 bg-[var(--bg-elevated)] rounded-xl shadow-[var(--shadow-lg)] border border-[var(--border-subtle)] p-1.5 flex gap-1">
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 hover:bg-blue-500/10 rounded-lg text-blue-600 transition-colors">
                  <FaFacebookF className="text-sm" />
                </a>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 hover:bg-sky-500/10 rounded-lg text-sky-500 transition-colors">
                  <FaTwitter className="text-sm" />
                </a>
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 hover:bg-blue-500/10 rounded-lg text-blue-700 transition-colors">
                  <FaLinkedinIn className="text-sm" />
                </a>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2.5 hover:bg-green-500/10 rounded-lg text-green-600 transition-colors">
                  <FaWhatsapp className="text-sm" />
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      <article className="reading-container px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
        {post.category && (
          <div className="mb-6">
            <span className="text-eyebrow">{post.category}</span>
          </div>
        )}

        <h1 className="text-display text-2xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight mb-8 text-[var(--text-primary)]">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-[var(--border-subtle)] text-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[var(--text-primary)] text-[var(--bg-page)] rounded-full flex items-center justify-center text-sm font-semibold font-[family-name:var(--font-display)]">
              {(post.author || "Gramika Team").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-[family-name:var(--font-display)]">Author</p>
              <p className="font-medium text-[var(--text-primary)] text-sm">{post.author || "Gramika Team"}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-[var(--border-default)] hidden sm:block" />
          <div>
            <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-[family-name:var(--font-display)]">Published</p>
            <p className="font-medium text-[var(--text-primary)] text-sm">{formatDate(post.publishedAt)}</p>
          </div>
          {readingTime > 0 && (
            <>
              <div className="h-8 w-px bg-[var(--border-default)] hidden sm:block" />
              <div>
                <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-[family-name:var(--font-display)]">Read time</p>
                <p className="font-medium text-[var(--text-primary)] text-sm">{readingTime} min</p>
              </div>
            </>
          )}
        </div>

        {post.mainImage && (
          <figure className="mb-10 -mx-4 sm:mx-0">
            <div className="image-frame relative aspect-[16/10]">
              <Image src={post.mainImage} alt={post.title} fill className="object-cover" priority />
            </div>
          </figure>
        )}

        <div className="article-prose">
          {post.body && Array.isArray(post.body) && post.body.length > 0 ? (
            <PortableText value={post.body} components={portableTextComponents} />
          ) : post.excerpt ? (() => {
            try {
              const content = (typeof post.excerpt === 'string' && (post.excerpt as string).startsWith('{'))
                ? JSON.parse(post.excerpt as string)
                : post.excerpt;

              if (typeof content === 'string') {
                if (content.includes('<') && content.includes('>')) {
                  return <div dangerouslySetInnerHTML={{ __html: content }} />;
                }
                return (
                  <p className="text-[1.0625rem] sm:text-[1.125rem] leading-[1.85] text-[var(--text-secondary)] mb-6 whitespace-pre-line">
                    {content}
                  </p>
                );
              }

              return <PortableText value={content} components={portableTextComponents} />;
            } catch (e) {
              console.error('Error parsing excerpt:', e);
              if (typeof post.excerpt === 'string') {
                if (post.excerpt.includes('<') && post.excerpt.includes('>')) {
                  return <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />;
                }
                return (
                  <p className="text-[1.0625rem] sm:text-[1.125rem] leading-[1.85] text-[var(--text-secondary)] mb-6 whitespace-pre-line">
                    {post.excerpt}
                  </p>
                );
              }
              return null;
            }
          })() : null}
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border-subtle)]">
          <p className="text-xs font-[family-name:var(--font-display)] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-4">Share this article</p>
          <div className="flex gap-2">
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-[var(--bg-muted)] text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
              <FaFacebookF size={14} />
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-[var(--bg-muted)] text-sky-500 rounded-lg hover:bg-sky-500 hover:text-white transition-all">
              <FaTwitter size={14} />
            </a>
            <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-[var(--bg-muted)] text-blue-700 rounded-lg hover:bg-blue-700 hover:text-white transition-all">
              <FaLinkedinIn size={14} />
            </a>
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-[var(--bg-muted)] text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all">
              <FaWhatsapp size={14} />
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const rawSlug = context.params?.slug;
  if (!rawSlug || Array.isArray(rawSlug)) return { notFound: true };

  const slug = decodeSlug(rawSlug);
  const preferredId =
    typeof context.query.id === "string" ? context.query.id : undefined;

  try {
    const post = await findNewsPostByIdentifier(slug, preferredId);
    if (!post) return { notFound: true };
    return { props: { post, currentSlug: getNewsSlug(post.title) } };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { notFound: true };
  }
};
