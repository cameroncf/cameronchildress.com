import { JsonFile } from "projen";
import { ViteProject } from "./projenrc/vite/vite-project";

const project = new ViteProject({ name: "cameronchildress.com" });


project.addGitIgnore("content/.vitepress/cache");
project.addGitIgnore("content/.vitepress/dist");

// build package.json
new JsonFile(project, "package.json", {
  obj: {
    name: "cameronchildress.com",
    version: "0.0.0",
    type: "module",
    devDependencies: {
      projen: "^0.82.6",
      "vite-node": "^1.6.0",
      vitepress: "^1.2.3",
      "vitepress-sidebar": "^1.23.2",
      vue: "^3.4.29",
    },
    scripts: {
      "docs:dev": "vitepress dev content",
      "docs:build": "vitepress build content",
      "docs:preview": "vitepress preview content",
    },
  },
});

project.synth();
