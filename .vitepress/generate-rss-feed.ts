import { writeFileSync } from "node:fs";
import path from "node:path";
import { Feed } from "feed";
import { createContentLoader, type SiteConfig } from "vitepress";

const baseUrl = `https://www.cameronchildress.com`;

export async function generateRssFeed(config: SiteConfig) {
  const feed = new Feed({
    title: "Cameron Childress",
    description: "A personal blog from Cameron Childress.",
    id: baseUrl,
    link: baseUrl,
    language: "en",
    image: "https://www.cameronchildress.com/images/cameron-childress.jpg",
    // favicon: `${baseUrl}/favicon.ico`,
    copyright: "Copyright (c) 2023-present, Cameron Childress",
  });

  const allPosts = await createContentLoader("posts/**/*.md", {
    excerpt: true,
    render: true,
  }).load();

  const posts = allPosts.filter(
    (page) => page.frontmatter.excludeFromRss !== true,
  );

  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string),
  );

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${baseUrl}${url}`,
      link: `${baseUrl}${url}`,
      description: excerpt,
      content: html?.replaceAll("&ZeroWidthSpace;", ""),
      author: [
        {
          name: frontmatter.author,
          link: frontmatter.twitter
            ? `https://twitter.com/${frontmatter.twitter}`
            : undefined,
        },
      ],
      date: frontmatter.date,
    });
  }

  writeFileSync(path.join(config.outDir, "feed.rss"), feed.rss2());
}
