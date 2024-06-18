//import { fileURLToPath } from "node:url";
import { Component, SampleDir } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptAppProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { ApiExamplesMd } from "./templates/api-examples-md";
import { IndexMd } from "./templates/index-md";
import { MarkdownExamplesMd } from "./templates/markdown-examples-md";
import { VitepressConfigJs } from "./templates/vitepress-config-js";
import { VitepressThemeIndexJs } from "./templates/vitepress-theme-index-js";
import { VitepressThemeLayoutVue } from "./templates/vitepress-theme-layout-vue";
import { VitepressThemeStyleCss } from "./templates/vitepress-theme-style-css";
import { defaultTypescriptProjectOptions } from "../common-project-defaults";
import { PnpmWorkspace } from "../pnpm";
import { VsCodeConfig } from "../vscode";

/**
 * An interface for all template generators for VitePress.
 */
export interface IVitepressTemplate {
  readonly fileContent: string;
  readonly fileName: string;
}

/**
 * Direct copy of Vitepress theme types.
 */
export enum ScaffoldThemeType {
  Default = "default theme",
  DefaultCustom = "default theme + customization",
  Custom = "custom theme",
}

/**
 * Options for scaffolding a new VitePress project. Copied directly from the
 * VitePress CLI (with some modifications).
 *
 * These are meant to mimic the options you'd get if you used the CLI, but we're
 * also simplifying the options available.
 */
export interface ScaffoldOptions {
  /**
   * The site title to use.
   *
   * @default: "My Awesome Project"
   */
  readonly title?: string;
  /**
   * Site description to use in scaffolded files.
   *
   * @default: "A VitePress Site"
   */
  readonly description?: string;
  /**
   * How much theming to scaffold.
   *
   * @default ScaffoldThemeType.DefaultCustom
   */
  readonly theme?: ScaffoldThemeType;
}

/**
 * Options to use when when creating the VitePress site.
 */
export interface VitepressProjectOptions extends TypeScriptProjectOptions {
  /**
   * The directory where the content for the VitePress project will be stored.
   *
   * @default: "content"
   */
  readonly contentDirectory?: string;

  /**
   * Options to use when scaffolding the VitePress project.
   *
   * @ default: {}
   */
  readonly scaffoldOptions?: ScaffoldOptions;

  /**
   * Version of VitePress to install.
   *
   * @default - Defaults to the latest version.
   */
  readonly vitepressVersion?: string;
}

export class VitepressProject extends TypeScriptAppProject {
  readonly contentDirectory: string;
  readonly scaffoldOptions: Required<ScaffoldOptions>;

  constructor(options: VitepressProjectOptions) {
    super({
      /**
       * Passthough all default options for typescript projects.
       */
      ...defaultTypescriptProjectOptions,

      /**
       * Passthrough all options to the TypeScriptAppProject constructor.
       * This allows overriding of any of the defaultTypescriptProjectOptions
       * if needed.
       */
      ...options,
    });

    /**
     * Add vitepress as a dependency. If a version is supplied, use it.
     * Otherwise we'll allow the package manager find the newest version.
     */
    const postfix = options.vitepressVersion
      ? `@${options.vitepressVersion}`
      : "";
    this.addDevDeps(`vitepress${postfix}`);

    /**
     * Set defaults, as needed.
     */
    this.contentDirectory = options.contentDirectory ?? "content";
    this.scaffoldOptions = {
      /**
       * Scaffold defaults
       */
      title: "My Awesome Project",
      description: "A VitePress Site",
      theme: ScaffoldThemeType.DefaultCustom,

      /**
       * Override defaults as needed.
       */
      ...options.scaffoldOptions,
    };

    /**
     * Workspace file for PNPM, if needed
     */
    if (this.package.packageManager === NodePackageManager.PNPM) {
      new PnpmWorkspace(this);
    }

    /**
     * Add VSCode config at the project level along with typescript support.
     */
    new VsCodeConfig(this, { typescript: true });

    /**
     * When you install vitepress using `vitepress init`, you're told to exclude
     * these two folders in your gitignore. Since we're using Projen we add them
     * here and Projen takes case of the rest.
     */
    this.gitignore.exclude(
      `${this.contentDirectory}/.vitepress/dist`,
      `${this.contentDirectory}/.vitepress/cache`,
    );

    /**
     * Add the typical 3 VitePress tasks, prefixed with the folder name where our
     * site content is located. We'll generate those in the package.json here.
     */
    ["dev", "build", "preview"].forEach((task) => {
      this.addTask(`${this.contentDirectory}:${task}`).exec(
        `vitepress ${task} ${this.contentDirectory}`,
      );
    });

    /**
     * By default, projen runs `tsc --build` as part of it's compile step. We don't
     * actually want to do that since vitepress will use vite for this instead. So
     * we reset the compile task to remove the default tsc build command.
     *
     * Then we add a new compile task that runs the VitePress build command.
     * This replaces the default tsc command with what we'd expect to see on a
     * standard VitePress site.
     */
    this.compileTask.reset();
    this.compileTask.exec(`npx projen ${this.contentDirectory}:build`);

    /***************************************************************************
     * Scaffolding
     **************************************************************************/

    /**
     * If we're choosing a custom scaffolding type, we also need to add vue as
     * a dev dependency.
     */
    if (
      this.scaffoldOptions.theme === ScaffoldThemeType.Custom ||
      this.scaffoldOptions.theme === ScaffoldThemeType.DefaultCustom
    ) {
      this.addDevDeps("vue");
    }

    /**
     * Now scaffold all the files we need to get the VitePress site up and running.
     */
    new ScaffoldVitePress(this);
  }
}

/**
 * Mimics the Vitepress init process that's defined here:
 * https://github.com/vuejs/vitepress/blob/main/src/node/init/init.ts
 *
 * A lof of the below taken directly from the VitePress Project.
 */

class ScaffoldVitePress extends Component {
  constructor(project: VitepressProject) {
    super(project);

    /**
     * We always scaffold these files.
     */
    const templatesToScaffold: Array<IVitepressTemplate> = [
      new ApiExamplesMd(project),
      new IndexMd(project),
      new MarkdownExamplesMd(project),
      new VitepressConfigJs(project),
    ];

    if (project.scaffoldOptions.theme === ScaffoldThemeType.DefaultCustom) {
      templatesToScaffold.push(
        new VitepressThemeIndexJs(project),
        new VitepressThemeStyleCss(project),
      );
    }

    if (project.scaffoldOptions.theme === ScaffoldThemeType.Custom) {
      templatesToScaffold.push(
        new VitepressThemeIndexJs(project),
        new VitepressThemeStyleCss(project),
        new VitepressThemeLayoutVue(project),
      );
    }

    /**
     * Generate the content directory content along with all of the files we
     * need to scaffold.
     */
    new SampleDir(project, project.contentDirectory, {
      files: templatesToScaffold.reduce(
        (acc, { fileName, fileContent }) => {
          return { ...acc, [fileName]: fileContent };
        },
        {} as Record<string, string>,
      ),
    });
  }
}
