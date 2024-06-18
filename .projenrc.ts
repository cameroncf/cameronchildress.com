import { JsonFile, Project } from "projen";

const project = new Project({ name: "cameronchildress.com" });

// make vite-node the default for executing the projen entry point
project.defaultTask?.exec("npx vite-node .projenrc.ts");

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
    },
    scripts: {
      "docs:dev": "vitepress dev content",
      "docs:build": "vitepress build content",
      "docs:preview": "vitepress preview content",
    },
  },
});

project.synth();
