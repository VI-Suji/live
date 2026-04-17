import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { FaArrowLeft, FaShareAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { PortableText } from "@portabletext/react";
import { motion, useScroll, useSpring } from "framer-motion";
import { sanityClient } from "../../sanity/config";
import Meta from "../../components/Meta";

type SanityPost = {
  _id: string;
  title: string;
  slug: { current: string };
  author?: string;
  mainImage?: string;
  seoImage?: string;
  excerpt?: string;
  body: any[];
  publishedAt?: string;
  category?: string;
};

type Props = {
  post: SanityPost | null;
};

export default function NewsSlugPage({ post }: Props) {
  const router = useRouter();
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

  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  if (router.isFallback || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
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
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`,
  };

  const portableTextComponents = {
    types: {
      image: ({ value }: { value: any }) => (
        <figure className="my-12 sm:my-16 -mx-4 sm:mx-0">
          <div className="relative aspect-video overflow-hidden bg-gray-100">
            <Image
              src={value.asset?.url || value.url}
              alt={value.alt || "Article image"}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-4 px-4 sm:px-0 italic border-t border-gray-100 pt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ),
    },
    block: {
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mt-16 mb-6 leading-[1.15] tracking-tight border-l-4 border-blue-600 pl-5">
          {children}
        </h2>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mt-14 mb-5 leading-[1.2] tracking-tight">
          {children}
        </h3>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-10 mb-4 leading-snug">
          {children}
        </h4>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="my-10 sm:my-12 py-6 px-8 bg-gray-50 border-l-4 border-gray-900 relative">
          <svg className="absolute top-4 left-4 w-8 h-8 text-gray-200" fill="currentColor" viewBox="0 0 32 32">
            <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
          </svg>
          <p className="text-xl sm:text-2xl leading-relaxed italic text-gray-800 font-serif pl-8">
            {children}
          </p>
        </blockquote>
      ),
      normal: ({ children }: { children?: React.ReactNode }) => {
        return (
          <p className="text-[18px] sm:text-[19px] leading-[1.8] text-gray-800 mb-6 first-of-type:first-letter:text-7xl first-of-type:first-letter:font-bold first-of-type:first-letter:text-gray-900 first-of-type:first-letter:float-left first-of-type:first-letter:mr-3 first-of-type:first-letter:leading-[0.85]">
            {children}
          </p>
        );
      },
    },
    list: {
      bullet: ({ children }: { children?: React.ReactNode }) => (
        <ul className="space-y-3 my-8 pl-6 list-none">{children}</ul>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <ol className="space-y-3 my-8 pl-6 list-none counter-reset-item">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children?: React.ReactNode }) => (
        <li className="text-[18px] sm:text-[19px] text-gray-800 leading-[1.8] pl-2 relative before:content-['•'] before:absolute before:left-[-1rem] before:text-blue-600 before:font-bold">
          {children}
        </li>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <li className="text-[18px] sm:text-[19px] text-gray-800 leading-[1.8] pl-2 relative counter-increment-item before:content-[counter(item)'.'] before:absolute before:left-[-1.5rem] before:text-blue-600 before:font-bold">
          {children}
        </li>
      ),
    },
    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-bold text-gray-900">{children}</strong>
      ),
      em: ({ children }: { children?: React.ReactNode }) => (
        <em className="italic font-serif">{children}</em>
      ),
      link: ({ children, value }: { children?: React.ReactNode; value?: any }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline decoration-1 underline-offset-2 transition-colors"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Meta
        title={`${post.title} | Gramika News`}
        description={post.excerpt || post.title}
        keywords={`${post.title}, ${post.category || ''}, Gramika News, ഗ്രാമിക, Malayalam News, Kerala News, Local News`}
        image={post.seoImage || post.mainImage}
        url={`${shareUrl}`}
        type="article"
        articleData={{
          publishedTime: post.publishedAt,
          author: post.author || "Gramika Team",
          section: post.category,
        }}
      />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />

      <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            ഗ്രാമിക
          </span>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            >
              <FaShareAlt className="text-sm" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 flex gap-2">
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
                  <FaFacebookF className="text-sm" />
                </a>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 hover:bg-sky-50 rounded text-sky-500 transition-colors">
                  <FaTwitter className="text-sm" />
                </a>
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 hover:bg-blue-50 rounded text-blue-700 transition-colors">
                  <FaLinkedinIn className="text-sm" />
                </a>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2.5 hover:bg-green-50 rounded text-green-600 transition-colors">
                  <FaWhatsapp className="text-sm" />
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
        {post.category && (
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 rounded">
              {post.category}
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-5 pb-6 mb-6 border-b border-gray-200 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
              {(post.author || "Gramika Team").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Author</p>
              <p className="font-semibold text-gray-900">{post.author || "Gramika Team"}</p>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Published</p>
            <p className="font-medium text-gray-900">{formatDate(post.publishedAt)}</p>
          </div>
          {readingTime > 0 && (
            <>
              <div className="h-10 w-px bg-gray-300"></div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Reading Time</p>
                <p className="font-medium text-gray-900">{readingTime} min</p>
              </div>
            </>
          )}
        </div>

        {post.mainImage && (
          <figure className="mb-10 -mx-4 sm:mx-0">
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <Image
                src={post.mainImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </figure>
        )}

        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
          {post.title}
        </h1>

        <div className="prose prose-lg max-w-none">
          {post.excerpt && (() => {
            try {
              const content = (typeof post.excerpt === 'string' && (post.excerpt as string).startsWith('{'))
                ? JSON.parse(post.excerpt as string)
                : post.excerpt;

              if (typeof content === 'string') {
                return <div dangerouslySetInnerHTML={{ __html: content }} />;
              }

              return <PortableText value={content} components={portableTextComponents} />;
            } catch (e) {
              console.error('Error parsing excerpt:', e);
              if (typeof post.excerpt === 'string') {
                return <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />;
              }
              return null;
            }
          })()}
        </div>

        <div className="mt-16 pt-10 border-t-2 border-gray-900">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Share Article</p>
            <div className="flex-1 h-px bg-gray-200 ml-4"></div>
          </div>
          <div className="flex gap-3">
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">
              <FaFacebookF />
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors shadow-sm hover:shadow-md">
              <FaTwitter />
            </a>
            <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors shadow-sm hover:shadow-md">
              <FaLinkedinIn />
            </a>
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 bg-green-500 text-white rounded hover:bg-green-600 transition-colors shadow-sm hover:shadow-md">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </article>

      <style jsx global>{`
        .prose h1 { font-size: 1.5rem !important; font-weight: 900 !important; color: #111827 !important; margin-top: 3rem !important; margin-bottom: 1.5rem !important; line-height: 1.2 !important; border-left: 4px solid #2563eb !important; padding-left: 1.25rem !important; }
        .prose h2 { font-size: 1.35rem !important; font-weight: 900 !important; color: #111827 !important; margin-top: 2.5rem !important; margin-bottom: 1.25rem !important; line-height: 1.25 !important; }
        .prose p { font-size: 1.125rem !important; line-height: 1.8 !important; color: #374151 !important; margin-bottom: 1.5rem !important; }
        @media (min-width: 640px) { .prose h1 { font-size: 2.5rem !important; } .prose h2 { font-size: 2rem !important; } }
      `}</style>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params || {};
  if (!slug) return { notFound: true };

  const query = `*[_type in ["topStory", "localNews", "nationalNews", "entertainmentNews", "healthNews", "sportsNews"] && (slug.current == $slug || title match $slug)][0] {
    _id, 
    _type,
    title, 
    slug, 
    author, 
    "mainImage": coalesce(mainImage.asset->url, image.asset->url),
    "seoImage": coalesce(mainImage.asset->url, image.asset->url) + "?w=1200&h=630&fit=crop&auto=format&q=80",
    "excerpt": coalesce(excerpt, description), 
    body, 
    publishedAt, 
    featured, 
    category
  }`;

  try {
    const post = await sanityClient.fetch(query, { slug });
    if (!post) return { notFound: true };
    return { props: { post } };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { notFound: true };
  }
};
