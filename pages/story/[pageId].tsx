import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { GetServerSideProps } from "next";
import {
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { PortableText } from "@portabletext/react";
import { motion, useScroll, useSpring } from "framer-motion";
import Meta from "../../components/Meta";
import NewsShareMenu from "../../components/NewsShareMenu";
import ThemeToggle from "../../components/ThemeToggle";
import { findTopStoryByIdentifier, NewsPost } from "../../utils/newsPost";
import { decodeSlug } from "../../utils/slugify";
import {
  getNewsCategoryLabel,
  getOgImageUrl,
  getPlainTextDescription,
} from "../../utils/shareMeta";

type SanityPost = NewsPost;

type Props = {
  post: SanityPost | null;
  currentSlug: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function StoryPage({ post, currentSlug }: Props) {
  const router = useRouter();
  const shareUrl = `https://www.gramika.in/story/${currentSlug}`;
  const shareTitle = post ? `${post.title} | Gramika News` : "Gramika News";
  const shareDescription = post
    ? getPlainTextDescription(post.excerpt, post.title)
    : "Gramika News";
  const shareImage = post ? getOgImageUrl(post.seoImage || post.mainImage) : undefined;
  const shareSection = post ? getNewsCategoryLabel(post._type, post.category) : undefined;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [readingTime, setReadingTime] = useState(0);

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

  const stripHtml = (html?: string) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  };

  const ledeText = stripHtml(post.excerpt);

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

  const showLede = Boolean(ledeText && post.body && Array.isArray(post.body) && post.body.length > 0);

  const articleBody = post.body && Array.isArray(post.body) && post.body.length > 0 ? (
    <PortableText value={post.body} components={portableTextComponents} />
  ) : post.excerpt ? (() => {
    try {
      const content = (typeof post.excerpt === "string" && (post.excerpt as string).startsWith("{"))
        ? JSON.parse(post.excerpt as string)
        : post.excerpt;

      if (typeof content === "string") {
        if (content.includes("<") && content.includes(">")) {
          return <div className="story-html-content" dangerouslySetInnerHTML={{ __html: content }} />;
        }
        return (
          <p className="text-[1.0625rem] sm:text-[1.125rem] leading-[1.85] text-[var(--text-secondary)] mb-6 whitespace-pre-line">
            {content}
          </p>
        );
      }

      return <PortableText value={content} components={portableTextComponents} />;
    } catch (e) {
      console.error("Error parsing excerpt:", e);
      if (typeof post.excerpt === "string") {
        if (post.excerpt.includes("<") && post.excerpt.includes(">")) {
          return <div className="story-html-content" dangerouslySetInnerHTML={{ __html: post.excerpt }} />;
        }
        return (
          <p className="text-[1.0625rem] sm:text-[1.125rem] leading-[1.85] text-[var(--text-secondary)] mb-6 whitespace-pre-line">
            {post.excerpt}
          </p>
        );
      }
      return null;
    }
  })() : null;

  const authorName = post.author || "Gramika Team";

  return (
    <div className="min-h-screen page-bg">
      <Meta
        title={shareTitle}
        description={shareDescription}
        keywords={`${post.title}, ${shareSection || ''}, Gramika News, ഗ്രാമിക, Malayalam News, Kerala News, Feature Story`}
        image={shareImage}
        imageAlt={post.title}
        url={shareUrl}
        type="article"
        articleData={{
          publishedTime: post.publishedAt,
          author: authorName,
          section: shareSection,
        }}
      />

      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[var(--accent)] origin-left z-50"
        style={{ scaleX }}
      />

      <nav className="sticky top-0 w-full bg-[var(--bg-surface)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] z-40 overflow-visible">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <button
            onClick={() => router.push("/#top-stories")}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group shrink-0"
          >
            <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-[family-name:var(--font-display)] font-medium">Back</span>
          </button>

          <span className="font-[family-name:var(--font-display)] text-xs sm:text-sm font-semibold tracking-tight text-[var(--text-primary)] text-center truncate min-w-0">
            GRAMIKA NEWS ONLINE
          </span>

          <div className="shrink-0 justify-self-end">
            <NewsShareMenu
              shareUrl={shareUrlState}
              size="sm"
              variant="prominent"
              menuPlacement="below"
            />
          </div>
        </div>
      </nav>

      {/* Editorial masthead */}
      <header className="story-masthead">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="story-masthead-accent shrink-0" aria-hidden />
              <span className="story-masthead-label">Feature Stories</span>
            </div>
            <ThemeToggle className="shrink-0 text-white/60 hover:text-white hover:bg-white/10 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10" />
          </div>
        </div>
      </header>

      {/* Hero — split layout on desktop */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-10 sm:pb-14">
        <div className="grid lg:grid-cols-[1fr_min(38%,300px)] gap-8 lg:gap-12 items-start">
          <motion.div
            initial="hidden"
            animate="visible"
            className="order-2 lg:order-1"
          >
            {post.category && (
              <motion.div custom={0} variants={fadeUp} className="mb-4">
                <span className="inline-flex px-2.5 py-1 text-[10px] font-[family-name:var(--font-display)] font-semibold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] rounded-md border border-[var(--accent)]/15 dark:border-[var(--accent)]/30">
                  {post.category}
                </span>
              </motion.div>
            )}

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="text-display text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] leading-[1.12] tracking-tight text-[var(--text-primary)] mb-6"
            >
              {post.title}
            </motion.h1>

            <motion.div custom={2} variants={fadeUp} className="flex flex-wrap gap-2 mb-6">
              <span className="story-meta-chip">
                <FaUser className="text-[var(--accent)] text-xs" />
                {authorName}
              </span>
              <span className="story-meta-chip">
                <FaClock className="text-[var(--accent)] text-xs" />
                {formatDate(post.publishedAt)}
              </span>
              {readingTime > 0 && (
                <span className="story-meta-chip">
                  {readingTime} min read
                </span>
              )}
            </motion.div>

            {showLede && (
              <motion.p custom={3} variants={fadeUp} className="story-lede font-medium">
                {ledeText}
              </motion.p>
            )}
          </motion.div>

          {post.mainImage && (
            <motion.figure
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="order-1 lg:order-2 lg:sticky lg:top-20"
            >
              <div className="image-frame relative aspect-[16/9] lg:aspect-[4/3] shadow-[var(--shadow-md)]">
                <Image
                  src={post.mainImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 300px"
                />
              </div>
            </motion.figure>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="section-divider" />
      </div>

      {/* Article body */}
      <article className="reading-container px-4 sm:px-6 pt-10 sm:pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="article-prose story-article-body"
        >
          {articleBody}
        </motion.div>

        {/* Author recap */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mt-12 flex items-center gap-4 p-5 bg-[var(--bg-muted)] rounded-xl border border-[var(--border-subtle)]"
        >
          <div className="w-12 h-12 shrink-0 story-author-avatar rounded-full flex items-center justify-center text-lg font-semibold font-[family-name:var(--font-display)]">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-[family-name:var(--font-display)] mb-0.5">
              Written by
            </p>
            <p className="font-medium text-[var(--text-primary)]">{authorName}</p>
            <p className="text-sm text-[var(--text-tertiary)]">{formatDate(post.publishedAt)}</p>
          </div>
        </motion.div>

        {/* Share card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="story-share-card mt-10"
        >
          <p className="text-xs font-[family-name:var(--font-display)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
            Enjoyed this story?
          </p>
          <p className="text-[var(--text-primary)] font-medium mb-4">Share it with others</p>
          <NewsShareMenu shareUrl={shareUrlState} layout="inline" />
        </motion.div>

        {/* CTA — more stories */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="story-cta-card mt-8 p-6 sm:p-8"
        >
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="story-cta-eyebrow text-[10px] font-[family-name:var(--font-display)] font-semibold uppercase tracking-wider mb-1">
                Keep reading
              </p>
              <p className="story-cta-title text-lg sm:text-xl font-[family-name:var(--font-display)] font-semibold">
                Explore more feature stories
              </p>
            </div>
            <button
              onClick={() => router.push("/#top-stories")}
              className="story-cta-btn"
            >
              View all stories
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </motion.div>
      </article>

      <style jsx global>{`
        .story-html-content p {
          font-size: 1.0625rem;
          line-height: 1.85;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        .story-html-content h1,
        .story-html-content h2,
        .story-html-content h3 {
          color: var(--text-primary);
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .story-html-content a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageId, slug } = context.params || {};
  const rawIdentifier = pageId || slug;
  if (!rawIdentifier || Array.isArray(rawIdentifier)) return { notFound: true };

  const identifier = decodeSlug(rawIdentifier);

  try {
    const post = await findTopStoryByIdentifier(identifier);
    if (!post) return { notFound: true };
    return { props: { post, currentSlug: identifier } };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { notFound: true };
  }
};
