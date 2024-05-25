import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Cameron Childress",
  description: "My Personal Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Resume', link: '/resume' }
    ],

    /*
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    */

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cameroncf/cameronchildress.com' }
    ]
  },

  sitemap: {
    hostname: 'https://www.cameronchildress.com'
  }
})
