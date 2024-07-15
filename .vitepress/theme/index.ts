// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
// @ts-ignore
import SiteLayout from "./SiteLayout.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout: SiteLayout,
} as Theme;
