import { Component } from "projen";
import { IVitepressTemplate, VitepressProject } from "../vitepress";

export class ApiExamplesMd extends Component implements IVitepressTemplate {
  readonly fileContent: string;
  readonly fileName: string = "api-examples.md";

  constructor(project: VitepressProject) {
    super(project);

    this.fileContent = [
      "---",
      "outline: deep",
      "---",
      "",
      "# Runtime API Examples",
      "",
      "This page demonstrates usage of some of the runtime APIs provided by VitePress.",
      "",
      "The main `useData()` API can be used to access site, theme, and page data for the current page. It works in both `.md` and `.vue` files:",
      "",
      "```md",
      "<script setup>",
      "import { useData } from 'vitepress'",
      "",
      "const { theme, page, frontmatter } = useData()",
      "</script>",
      "",
      "## Results",
      "",
      "### Theme Data",
      "<pre>{{ theme }}</pre>",
      "",
      "### Page Data",
      "<pre>{{ page }}</pre>",
      "",
      "### Page Frontmatter",
      "<pre>{{ frontmatter }}</pre>",
      "```",
      "",
      "<script setup>",
      "import { useData } from 'vitepress'",
      "",
      "const { site, theme, page, frontmatter } = useData()",
      "</script>",
      "",
      "## Results",
      "",
      "### Theme Data",
      "<pre>{{ theme }}</pre>",
      "",
      "### Page Data",
      "<pre>{{ page }}</pre>",
      "",
      "### Page Frontmatter",
      "<pre>{{ frontmatter }}</pre>",
      "",
      "## More",
      "",
      "Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).",
      "",
    ].join("\n");
  }
}
