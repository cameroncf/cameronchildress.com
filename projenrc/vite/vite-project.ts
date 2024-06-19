import { JsonFile, Project, ProjectOptions } from "projen";
import { VsCodeConfig } from "../vscode/vscode-config";
import { PROJEN_RC_FILE } from "../common";

export interface ViteProjectOptions
  extends Omit<
    ProjectOptions,
    | "logging"
    | "projenrcJson"
    | "projenrcJsonOptions"
    | "projenCommand"
    | "renovatebot"
    | "renovatebotOptions"
    | "commitGenerated"
    | "gitOptions"
    | "gitIgnoreOptions"
  > {
  /**
   * Code locations
   */
  readonly artifactsDirectory?: string;
  readonly sourceDirectory?: string;
  readonly entryFileBase?: string;
}

export class ViteProject extends Project {

  /**
   * Code locations
   */
  public readonly artifactsDirectory: string;
  public readonly sourceDirectory: string;
  public readonly entryFileBase: string;

  constructor(options: ViteProjectOptions) {
    super(options);

    /**
     * If this is the root project, configure the default task to run using vite-node
     */
    if (!options.parent) {
      this.defaultTask?.exec(["pnpm", "vite-node", PROJEN_RC_FILE].join(" "));
    }

    new VsCodeConfig(this, { typescript: true });

    // build package.json
    new JsonFile(this, "package2.json", {
      obj: {
        name: this.name,
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
      readonly: false, // we want "yarn add" to work and we have anti-tamper
      newline: true, // all package managers prefer a newline, see https://github.com/projen/projen/issues/2076
      committed: true, // needs to be committed so users can install the dependencies
    });
  }
}
