import { typescript } from "projen";
import { Job, JobPermission } from "projen/lib/github/workflows-model";
import { NodePackageManager } from "projen/lib/javascript";
import {
  VsCode,
  VsCodeRecommendedExtensions,
  VsCodeSettings,
} from "projen/lib/vscode";

/*******************************************************************************
 * Netlify Config
 ******************************************************************************/

const NETLIFY_SITE_ID = "7840347a-1605-469f-878f-bc76c7333db4";
const NETLIFY_AUTH_TOKEN = "${{ secrets.NETLIFY_AUTH_TOKEN }}";
const NETLIFY_DEPLOY_DIR = ".vitepress/dist";

/**
 * Projen Config
 */
const project = new typescript.TypeScriptAppProject({
  defaultReleaseBranch: "main",
  name: "cameronchildress.com",
  projenrcTs: true,

  prettier: true,

  packageManager: NodePackageManager.PNPM,
  pnpmVersion: "9",

  devDeps: ["vitepress"],

  buildWorkflowOptions: {
    mutableBuild: false,
  },

  artifactsDirectory: NETLIFY_DEPLOY_DIR,

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

/*******************************************************************************
 *
 * Deploy Workflow
 *
 * Add a deploy jobs for Netlify. We'll setup a preview deploy for PRs and a
 * production deploy for the main branch.
 *
 ******************************************************************************/

interface DeployJobOptions {
  isPr?: boolean;
  jobName?: string;
  /**
   * @default "main"
   */
  productionBranch?: string;
}

const deployJob = (options: DeployJobOptions): Job => {
  /**
   * Set Defaults
   */
  const isPr = options.isPr ?? true;
  const jobName =
    options.jobName ?? options.isPr ? "deploy-preview" : "deploy-main";
  const productionBranch = options.productionBranch ?? "main";
  const netlifyPreviewUrl = isPr
    ? "${{ steps.netlify-deploy.outputs.NETLIFY_URL }}"
    : "${{ steps.netlify-deploy.outputs.NETLIFY_LIVE_URL }}";
  const prAlias = "pr-${{ github.sha }} ";

  return {
    name: jobName,
    needs: ["build"],
    runsOn: ["ubuntu-latest"],
    env: {
      CI: "true",
    },
    if: isPr
      ? `startsWith( github.ref, 'refs/pull/' )`
      : `startsWith( github.ref, 'refs/heads/${productionBranch}' )`,
    concurrency: jobName,
    permissions: {
      contents: JobPermission.READ,
    },
    steps: [
      {
        name: "Setup pnpm",
        uses: "pnpm/action-setup@v3",
        with: {
          version: "9",
        },
      },
      {
        name: "Install Netlify CLI",
        run: "pnpm add netlify-cli",
      },
      {
        name: "Deploy to Netlify",
        id: "netlify-deploy",
        run: isPr
          ? `netlify deploy --dir=${NETLIFY_DEPLOY_DIR} --alias=${prAlias} --json`
          : `netlify deploy --dir=${NETLIFY_DEPLOY_DIR} --prod`,
        env: {
          NETLIFY_AUTH_TOKEN,
          NETLIFY_SITE_ID,
        },
      },
      /*
      {
        name: "Deploy to Netlify",
        id: "netlify-deploy",
        uses: "netlify/actions/cli@master",
        with: {
          args: isPr
            ? `deploy --dir=${NETLIFY_DEPLOY_DIR}`
            : `deploy --dir=${NETLIFY_DEPLOY_DIR} --prod`,
        },
        env: {
          NETLIFY_AUTH_TOKEN,
          NETLIFY_SITE_ID,
        },
      },
      */
      {
        name: "Audit URL(s) using Lighthouse",
        uses: "treosh/lighthouse-ci-action@v11",
        with: {
          urls: [netlifyPreviewUrl].join("\n"),
          uploadArtifacts: true,
          temporaryPublicStorage: true,
          runs: 3,
        },
        // see: https://github.com/treosh/lighthouse-ci-action/issues/21
        /*
        env: {
          LHCI_BUILD_CONTEXT__CURRENT_HASH: "${{ github.sha }}",
        },
        */
      },
      {
        name: "Publish Summary",
        run: [
          `echo "### Deploy Complete! :rocket:" >> $GITHUB_STEP_SUMMARY`,
          `echo "- Netlify URL: $NETLIFY_URL" >> $GITHUB_STEP_SUMMARY`,
        ].join("\n"),
        env: {
          NETLIFY_URL: netlifyPreviewUrl,
        },
      },
    ],
  };
};

// add deploy jobs to the github script
project.buildWorkflow?.addPostBuildJob(
  "pr-preview-deploy",
  deployJob({ isPr: true }),
);
project.buildWorkflow?.addPostBuildJob(
  "production-deploy",
  deployJob({ isPr: false }),
);

/**
 * Generate the project
 */
project.synth();
