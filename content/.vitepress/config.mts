import { defineConfig } from "vitepress";
import VitePressSidebar from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
const config = defineConfig({
  title: "Cameron Childress",
  description: "My Personal Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Blog", link: "/blog" },
      { text: "Resume", link: "/resume" },
    ],

    sidebar: VitePressSidebar.generateSidebar([
      {
        documentRootPath: "content",
        scanStartPath: "blog",
        resolvePath: "/blog/",
        useTitleFromFrontmatter: true,
        useFolderTitleFromIndexFile: true,
        useFolderLinkFromIndexFile: true,
        sortMenusByFrontmatterDate: true,
      },
    ]),

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/cameroncf/cameronchildress.com",
      },
    ],
  },

  sitemap: {
    hostname: "https://www.cameronchildress.com",
  },
});

export default config;
