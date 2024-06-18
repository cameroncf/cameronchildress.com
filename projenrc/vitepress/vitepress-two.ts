import {
  NodePackageManager,
  NodeProject,
  NodeProjectOptions,
} from "projen/lib/javascript";

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
export interface VitepressProjectOptionsTwo extends NodeProjectOptions {
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

export class VitepressProjectTwo extends NodeProject {
  readonly contentDirectory: string;
  readonly artifactsDirectory: string;
  readonly cacheDirectory: string;
  readonly scaffoldOptions: Required<ScaffoldOptions>;

  constructor(options: VitepressProjectOptionsTwo) {
    super({
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "9",
      prettier: true,
      licensed: false,
      jest: false,
      mergify: false,
      package: false,

      // passthrough options
      ...options,
    });

    /**
     * Add the package file for the project.
     */
    const postfix = options.vitepressVersion
      ? `@${options.vitepressVersion}`
      : "";
    this.addDevDeps(`vitepress${postfix}`);

    /**
     * Set defaults, as needed.
     */
    this.contentDirectory = options.contentDirectory ?? "content";
    this.artifactsDirectory = `${this.contentDirectory}/.vitepress/dist`;
    this.cacheDirectory = `${this.contentDirectory}/.vitepress/cache`;
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

    /***************************************************************************
     * Package File (package.json)
     **************************************************************************/

    /**
     * Workspace file for PNPM, if needed
     */
    /*
    if (this.package.packageManager === NodePackageManager.PNPM) {
      new PnpmWorkspace(this);
    }
      */

    /**
     * Add VSCode config at the project level along with typescript support.
     */
    // new VsCodeConfig(this, { typescript: true });

    /**
     * Ignore the two working directories that vitepress uses to store cache
     * and final artifact outputs.
     */
    this.gitignore.exclude(this.artifactsDirectory, this.cacheDirectory);

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
    // this.compileTask.reset();
    // this.compileTask.exec(`npx projen ${this.contentDirectory}:build`);

    /***************************************************************************
     * Scaffolding
     **************************************************************************/

    /**
     * If we're choosing a custom scaffolding type, we also need to add vue as
     * a dev dependency.
     */
    /*
    if (
      this.scaffoldOptions.theme === ScaffoldThemeType.Custom ||
      this.scaffoldOptions.theme === ScaffoldThemeType.DefaultCustom
    ) {
      this.addDevDeps("vue");
    }
    */

    /**
     * Now scaffold all the files we need to get the VitePress site up and running.
     */
    // new ScaffoldVitePress(this);
  }
}
