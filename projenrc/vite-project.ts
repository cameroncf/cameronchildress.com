import { Project, ProjectOptions } from "projen";

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
      this.defaultTask?.exec(["npx", "vite-node", ".projenrc.ts"].join(" "));
    }
  }
}
