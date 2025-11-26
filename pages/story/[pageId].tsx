"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BlogPost from "../components/TopStoryPostComponent";

type Post = {
  id: number | string;
  pageId: string;
  title: string;
  img?: string;
  text?: string;
  date?: string;
  author?: string;
};

export default function StoryPage() {
  const router = useRouter();
  const { pageId } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pageId || typeof pageId !== "string") return;

    const fetchPost = async () => {
      try {
        const res = await fetch("/api/notionPages");
        const data: Post[] = await res.json();

        const currentPost = data.find((p) => p.pageId === pageId);
        if (currentPost) setPost(currentPost);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [pageId]);

  if (!pageId || typeof pageId !== "string") {
    return null;
  }

  return (
    <BlogPost
      pageId={pageId}
      author={post?.author}
      date={post?.date}
    />
  );
}
