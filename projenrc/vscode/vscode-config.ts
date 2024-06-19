import { Component, Project, vscode } from "projen";

/*******************************************************************************
 *
 * VS Code Config
 *
 * Configure VS Code at the folder level inside the project. In the case of a
 * monorepo, this allows each sub-project to have it's own VSCode configuration.
 *
 ******************************************************************************/

export interface VsCodeConfigOptions {
  /**
   * Enable Typescript support rules for VS Code
   */
  readonly typescript?: boolean;
}

export class VsCodeConfig extends Component {
  private vscode: vscode.VsCode;

  constructor(
    public readonly project: Project,
    options: VsCodeConfigOptions = {},
  ) {
    super(project);

    this.vscode = new vscode.VsCode(project);

    /**
     * Add some basic configuration settings to the VS Code settings file:
     *
     * - Set the tab size to 2 spaces
     * - Enable bracket pair colorization
     * - Highlight active bracket pairs
     * - Add rulers at 80 and 120 characters
     */
    const vsSettings = new vscode.VsCodeSettings(this.vscode);
    vsSettings.addSetting("editor.tabSize", 2);
    vsSettings.addSetting("editor.bracketPairColorization.enabled", true);
    vsSettings.addSetting("editor.guides.bracketPairs", "active");
    vsSettings.addSetting("editor.rulers", [80, 120]);

    /**
     * Add some ESLint specific settings to the VS Code settings file. Here we
     * set the ESLint code actions to run on save and also make sure we're only
     * linting typescript files to speed up eslint. Without this specificity,
     * eslint would lint all files in the project and feel super sluggish.
     */
    if (options.typescript) {
      vsSettings.addSetting(
        "editor.codeActionsOnSave",
        { "source.fixAll.eslint": "explicit" },
        "typescript",
      );
    }
  }
}
