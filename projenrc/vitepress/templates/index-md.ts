import { Component } from "projen";
import {
  IVitepressTemplate,
  ScaffoldThemeType,
  VitepressProject,
} from "../vitepress";

export class IndexMd extends Component implements IVitepressTemplate {
  readonly fileContent: string;
  readonly fileName: string = "index.md";

  constructor(project: VitepressProject) {
    super(project);

    const options = project.scaffoldOptions;
    const title = JSON.stringify(options.title);
    const description = JSON.stringify(options.description);
    const defaultTheme =
      options.theme === ScaffoldThemeType.DefaultCustom ||
      options.theme === ScaffoldThemeType.Default;

    if (defaultTheme) {
      this.fileContent = [
        "---",
        "# https://vitepress.dev/reference/default-theme-home-page",
        "layout: home",
        "",
        "hero:",
        `  name: ${title}`,
        `  text: ${description}`,
        "  tagline: My great project tagline",
        "  actions:",
        "    - theme: brand",
        "      text: Markdown Examples",
        "      link: /markdown-examples",
        "    - theme: alt",
        "      text: API Examples",
        "      link: /api-examples",
        "",
        "features:",
        "  - title: Feature A",
        "    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "  - title: Feature B",
        "    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "  - title: Feature C",
        "    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "---",
        "",
        "",
      ].join("\n");
    } else {
      this.fileContent = ["---", "home: true", "---", "", ""].join("\n");
    }
  }
}
