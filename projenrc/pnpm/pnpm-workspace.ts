import { relative } from "path";
import { Component, YamlFile } from "projen";
import { NodePackageManager, NodeProject } from "projen/lib/javascript";

/*******************************************************************************
 *
 * PNPM Workspace configuration file
 *
 * When in a monorepo, generates the woprkspaces file for PNPM.
 *
 ******************************************************************************/

export class PnpmWorkspace extends Component {
  constructor(project: NodeProject) {
    super(project);
    /**
     * Make sure that the root project is a NodeProject or node subtype.
     */
    if (project.root instanceof NodeProject === false) {
      throw new Error(
        "The root project must be of NodeProject type or subtype to use PNPM Workspaces.",
      );
    }

    /**
     * This is a PNPM specific construct and won't work on projects that are not
     * PNPM
     */
    if (project.root.package.packageManager !== NodePackageManager.PNPM) {
      throw new Error(
        `Unsupported package manager ${project.root.package.packageManager}. Use PNPM instead.`,
      );
    }
  }

  preSynthesize(): void {
    /**
     * Only generate if this is the root project and there are more than one subprojects
     */
    if (
      this.project === this.project.root &&
      this.project.root.subprojects.length > 0
    ) {
      /**
       * The name of the workspace file that PNPM typically expect for find
       * workspace definitions within.
       */
      const fileName: string = "pnpm-workspace.yaml";

      /**
       * Ensure that the workspace definition doesn't end up in a package
       * distribution.
       */
      this.project.addPackageIgnore(fileName);

      /**
       * The content of this YAML file will be resolved at synth time. By then,
       * any sub-projects will be defined and this will be a complete list.
       */
      new YamlFile(this.project, fileName, {
        obj: {
          packages: () => {
            const packages = new Array<string>();
            for (const subproject of this.project.subprojects) {
              // grab the relative out directory
              packages.push(relative(this.project.outdir, subproject.outdir));
            }
            return packages;
          },
        },
      });
    }

    super.preSynthesize();
  }
}
