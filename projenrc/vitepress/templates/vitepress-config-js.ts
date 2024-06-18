import { Component } from "projen";
import {
  IVitepressTemplate,
  ScaffoldThemeType,
  VitepressProject,
} from "../vitepress";

export class VitepressConfigJs extends Component implements IVitepressTemplate {
  readonly fileContent: string;
  readonly fileName: string = ".vitepress/config.mts";

  constructor(project: VitepressProject) {
    super(project);

    const options = project.scaffoldOptions;
    const title = JSON.stringify(options.title);
    const description = JSON.stringify(options.description);
    const defaultTheme =
      options.theme === ScaffoldThemeType.DefaultCustom ||
      options.theme === ScaffoldThemeType.Default;

    this.fileContent = [
      "import { defineConfig } from 'vitepress'",
      "",
      "// https://vitepress.dev/reference/site-config",
      "export default defineConfig({",
      `  title: ${title},`,
      `  description: ${description}${defaultTheme ? "," : ""}`,
      ...(defaultTheme
        ? [
            "  themeConfig: {",
            "    // https://vitepress.dev/reference/default-theme-config",
            "    nav: [",
            "      { text: 'Home', link: '/' },",
            "      { text: 'Examples', link: '/markdown-examples' }",
            "    ],",
            "",
            "    sidebar: [",
            "      {",
            "        text: 'Examples',",
            "        items: [",
            "          { text: 'Markdown Examples', link: '/markdown-examples' },",
            "          { text: 'Runtime API Examples', link: '/api-examples' }",
            "        ]",
            "      }",
            "    ],",
            "",
            "    socialLinks: [",
            "      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }",
            "    ]",
            "  }",
          ]
        : []),
      "})",
      "",
    ].join("\n");
  }
}
