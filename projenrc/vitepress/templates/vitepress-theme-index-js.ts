import { Component } from "projen";
import {
  IVitepressTemplate,
  ScaffoldThemeType,
  VitepressProject,
} from "../vitepress";

export class VitepressThemeIndexJs
  extends Component
  implements IVitepressTemplate
{
  readonly fileContent: string;
  readonly fileName: string = ".vitepress/theme/index.ts";

  // @ts-ignore
  constructor(project: VitepressProject) {
    super(project);

    const options = project.scaffoldOptions;
    const defaultTheme =
      options.theme === ScaffoldThemeType.DefaultCustom ||
      options.theme === ScaffoldThemeType.Default;

    this.fileContent = [
      "// https://vitepress.dev/guide/custom-theme",
      ...(defaultTheme ? ["import { h } from 'vue'"] : []),
      ...(!defaultTheme ? ["import Layout from './Layout.vue'"] : []),
      "import type { Theme } from 'vitepress'",
      ...(defaultTheme ? ["import DefaultTheme from 'vitepress/theme'"] : []),
      "import './style.css'",
      "",
      "export default {",
      ...(defaultTheme
        ? [
            "  extends: DefaultTheme,",
            "  Layout: () => {",
            "    return h(DefaultTheme.Layout, null, {",
            "      // https://vitepress.dev/guide/extending-default-theme#layout-slots",
            "    })",
            "  },",
          ]
        : []),
      ...(!defaultTheme ? ["  Layout,"] : []),
      "  enhanceApp({ app, router, siteData }) {",
      "    // ...",
      "  }",
      "} satisfies Theme",
      "",
      ...(!defaultTheme ? [""] : []),
    ].join("\n");
  }
}
