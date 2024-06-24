// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import SiteLayout from "./SiteLayout.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout: SiteLayout,

  enhanceApp({ app, router, siteData }) {
    // ...
  },
} satisfies Theme;
