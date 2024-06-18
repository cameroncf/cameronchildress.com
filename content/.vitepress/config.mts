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
      { text: "Blog", link: "/posts/" },
      { text: "Resume", link: "/resume/" },
    ],

    sidebar: VitePressSidebar.generateSidebar([
      {
        documentRootPath: "content",
        scanStartPath: "posts",
        resolvePath: "/posts/",
        useTitleFromFrontmatter: true,
        useFolderTitleFromIndexFile: true,
        useFolderLinkFromIndexFile: true,
        sortMenusByFrontmatterDate: true,
      },
    ]),

    footer: {
      /* message: 'Built with VitePress', */
      copyright: 'Copyright © 2023-Present Cameron Childress'
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/cameroncf/",
      },
      {
        icon: "twitter",
        link: "https://twitter.com/cameronc/",
      },
      {
        icon: "linkedin",
        link: "https://www.linkedin.com/in/cameronc/",
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>'
        },
        link: "mailto: cameronc@gmail.com",
      },
      
    ],
  },

  /*
  sitemap: {
    hostname: "https://www.cameronchildress.com",
  },
  */
});

export default config;
