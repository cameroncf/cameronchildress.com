import { Component } from "projen";
import { IVitepressTemplate, VitepressProject } from "../vitepress";

export class VitepressThemeLayoutVue
  extends Component
  implements IVitepressTemplate
{
  readonly fileContent: string;
  readonly fileName: string = ".vitepress/theme/Layout.vue";

  constructor(project: VitepressProject) {
    super(project);

    this.fileContent = [
      '<script setup lang="ts">',
      "import { useData } from 'vitepress'",
      "",
      "// https://vitepress.dev/reference/runtime-api#usedata",
      "const { site, frontmatter } = useData()",
      "</script>",
      "",
      "<template>",
      '  <div v-if="frontmatter.home">',
      "    <h1>{{ site.title }}</h1>",
      "    <p>{{ site.description }}</p>",
      "    <ul>",
      '      <li><a href="/markdown-examples.html">Markdown Examples</a></li>',
      '      <li><a href="/api-examples.html">API Examples</a></li>',
      "    </ul>",
      "  </div>",
      "  <div v-else>",
      '    <a href="/">Home</a>',
      "    <Content />",
      "  </div>",
      "</template>",
      "",
    ].join("\n");
  }
}
