import { typescript } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import {
  VsCode,
  VsCodeRecommendedExtensions,
  VsCodeSettings,
} from "projen/lib/vscode";

const project = new typescript.TypeScriptAppProject({
  defaultReleaseBranch: "main",
  name: "cameronchildress.com",
  projenrcTs: true,

  prettier: true,

  packageManager: NodePackageManager.PNPM,
  pnpmVersion: "9",

  devDeps: ["vitepress"],

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

/**
 * VitePress Configuration
 */

// Exclude Vitepress build artifacts from git
project.gitignore.exclude(".vitepress/dist", ".vitepress/cache");

// Add Vitepress tasks
project.addTask("vitepress:dev").exec("vitepress dev");
project.addTask("vitepress:build").exec("vitepress build");
project.addTask("vitepress:preview").exec("vitepress preview");

/**
 * VSCode Configuration
 */

const vscode = new VsCode(project);

// VSCODE: Root level editor settings
const vsSettings = new VsCodeSettings(vscode);
vsSettings.addSetting("editor.tabSize", 2);
vsSettings.addSetting("editor.bracketPairColorization.enabled", true);
vsSettings.addSetting("editor.guides.bracketPairs", "active");
vsSettings.addSetting("editor.rulers", [80, 120]);

// use eslint to fix files for typescript files only
vsSettings.addSetting(
  "editor.codeActionsOnSave",
  { "source.fixAll.eslint": "explicit" },
  "typescript",
);

// In case of monorepo, make sure each directory's eslint is found properly.
vsSettings.addSetting("eslint.workingDirectories", [{ mode: "auto" }]);

// VSCODE: extensions
const vsExtensions = new VsCodeRecommendedExtensions(vscode);
vsExtensions.addRecommendations("dbaeumer.vscode-eslint");

/*******************************************************************************
 *
 * Build Workflow
 *
 * Projen does not support VitePress out of the box, so we need to add the build
 * command here as part of Projen's compile process. We'll add it as part of the
 * compile process.
 *
 ******************************************************************************/

project.compileTask.exec("npx projen vitepress:build");

/**
 * Generate the project
 */
project.synth();
