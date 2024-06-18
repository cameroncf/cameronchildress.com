import { Project } from "projen";

const project = new Project({ name: "cameronchildress.com" });

// make vite-node the default for executing the projen entry point
project.defaultTask?.exec("npx vite-node .projenrc.ts");

project.addGitIgnore("content/.vitepress/cache");
project.addGitIgnore("content/.vitepress/dist");

project.synth()