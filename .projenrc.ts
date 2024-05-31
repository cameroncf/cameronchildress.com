import { Component, typescript } from "projen";
import { Job, JobPermission } from "projen/lib/github/workflows-model";
import { NodePackageManager } from "projen/lib/javascript";
import { VsCode, VsCodeSettings } from "projen/lib/vscode";

/*******************************************************************************
 *
 * VitePress Options
 *
 * Some options we'll use to configure vitepress in this project.
 *
 ******************************************************************************/

/**
 * The subdirectory where the VitePress site itself is located. This value is
 * used to generate lots of other configuration options, including CI workflows.
 */
const VITEPRESS_SITE_DIR = "content";

/*******************************************************************************
 *
 * Netlify Options
 *
 * These are the values required for github actions generated at the end of this
 * file.
 *
 ******************************************************************************/

/**
 * The Netlify Site ID is a unique identifier for your site. You can find this
 * value in the Netlify dashboard for your site and replace it with your own
 * Site ID.
 *
 * This is not considered a secret.
 */
const NETLIFY_SITE_ID = "7840347a-1605-469f-878f-bc76c7333db4";

/**
 * Notably, we aren't using Netlify to build the site. Instead we're using
 * GitHub Actions for our CI pipeline. The Netlify Auth Token is a secret that
 * you will need to create in your GitHub account and named as shown here.
 */
const NETLIFY_AUTH_TOKEN = "${{ secrets.NETLIFY_AUTH_TOKEN }}";

/**
 * The directory where the VitePress build artifacts are located. This is used
 * to tell various parts of Projen where to expect build outputs to be located.
 */
const NETLIFY_DEPLOY_DIR = `${VITEPRESS_SITE_DIR}/.vitepress/dist`;

/*******************************************************************************
 *
 * Projen Config
 *
 * We're using the default TypeScript project, but we're adding some additional
 * configuration to support VitePress. This configures the other app project
 * options. We will also be adding more VitePress specific configurations later
 * in this file.
 *
 ******************************************************************************/

const project = new typescript.TypeScriptAppProject({
  /**
   * The default branch that production deploys will come from. Historically
   * this was master but a more modern option is main. Projen requires this to
   * be manually set for historical backward compatibility reasons.
   */
  defaultReleaseBranch: "main",

  /**
   * This will become the name of the project in the package.json file.
   */
  name: "cameronchildress.com",

  /**
   * Enable the projenrc.ts file. Historically, Projen used a projenrc.js file,
   * so we set this manually to tell Projen we're really serious about using
   * Typescript.
   */
  projenrcTs: true,

  /**
   * Enable Prettier for code formatting. This keeps our code tight and
   * consistent.
   */
  prettier: true,

  /**
   * Use PNPM instead of the default of Yarn. This is a personal preference.
   */
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: "9",

  /**
   *
   * Projen generates a lot of configuration files for you. This is great but
   * to have deterministic builds, your don't want any of those generated files
   * to change during your CI process.
   *
   * Setting mutable builds to false means that if the build script causes any
   * changes, including to configuration files or snapshot tests, the CI build
   * will fail.
   *
   * This is a great safety net to prevent unexpected outcomes in your CI/CD
   * pipeline.
   */
  buildWorkflowOptions: {
    mutableBuild: false,
  },

  /**
   * This is the directory where Projen expects to find build artifacts. This
   * directory value is used in generated GitHub Actions and other CI
   * configurations as the artifact directory that gets bundled up and saved to
   * be used in future CI steps or stages.
   *
   * In the case of this particular configuration of VitePress, the build
   * artifacts are in the `content/.vitepress/dist`
   */
  artifactsDirectory: NETLIFY_DEPLOY_DIR,
});

/*******************************************************************************
 *
 * VitePress Config
 *
 * Some of these options could be specified in the above project configuration,
 * but I prefer to keep them separate for clarity so that I know which configs
 * are specific to VitePress and which might be useful in other types of
 * projects.
 *
 ******************************************************************************/

/**
 * Add vitepress as a dev dependency for the project. We aren't going to
 * specify a version here because we'll be using the auto-update workflow
 * features of Projen to keep packages all up to date.
 */
project.addDevDeps("vitepress");

/**
 * When you install vitepress using `vitepress init`, you're told to exclude
 * these two folders in your gitignore. Since we're using Projen we add them
 * here and Projen takes case of the rest.
 */
project.gitignore.exclude(
  `${VITEPRESS_SITE_DIR}/.vitepress/dist`,
  `${VITEPRESS_SITE_DIR}/.vitepress/cache`,
);

/**
 * Add the typical 3 VitePress tasks, prefixed with the folder name where our
 * site content is located.
 */
["dev", "build", "preview"].forEach((task) => {
  project
    .addTask(`${VITEPRESS_SITE_DIR}:${task}`)
    .exec(`vitepress ${task} ${VITEPRESS_SITE_DIR}`);
});

/*******************************************************************************
 *
 * VS Code Config
 *
 * We've configured Prettier and ESLint for this project, but to get the full
 * benefit we also need to tell VS Code to lint our code as we do our work. This
 * section builds aVS Code configuration files that will be generated by Projen
 * into the project's .vscode directory.
 *
 ******************************************************************************/

/**
 * Projen includes a VSCode component that does most of the heavy listing. We
 * access it here.
 */
const vscode = new VsCode(project);

/**
 * Add som basic configuration settings to the VS Code settings file:
 *
 * - Set the tab size to 2 spaces
 * - Enable bracket pair colorization
 * - Highlight active bracket pairs
 * - Add rulers at 80 and 120 characters
 */
const vsSettings = new VsCodeSettings(vscode);
vsSettings.addSetting("editor.tabSize", 2);
vsSettings.addSetting("editor.bracketPairColorization.enabled", true);
vsSettings.addSetting("editor.guides.bracketPairs", "active");
vsSettings.addSetting("editor.rulers", [80, 120]);

/**
 * Add some ESLint specific settings to the VS Code settings file. Here we
 * set the ESLint code actions to run on save and also make sure we're only
 * linting typescript files to speed up eslint. Without this specificity, eslint
 * would lint all files in the project and feel super sluggish.
 */
vsSettings.addSetting(
  "editor.codeActionsOnSave",
  { "source.fixAll.eslint": "explicit" },
  "typescript",
);

/*******************************************************************************
 *
 * Build Workflow
 *
 * Projen does not support VitePress out of the box, so we need to add the build
 * command here as part of Projen's compile process. We'll add it as part of the
 * compile process.
 *
 ******************************************************************************/

/**
 * By default, projen runs `tsc --build` as part of it's compile step. We don't
 * actually want to do that since vitepress will use vite for this instead. So
 * we reset the compile task to remove the default tsc build command.
 */
project.compileTask.reset();

/**
 * Add a new compile task that runs the VitePress build command. This replaces
 * the default tsc command with what we'd expect to see on a VitePress site.
 */
project.compileTask.exec(`npx projen ${VITEPRESS_SITE_DIR}:build`);

/*******************************************************************************
 *
 * Netlify Workflow
 *
 ******************************************************************************/

interface NetlifyOptions {
  deployDir: string;
  authToken: string;
  siteId: string;
}

interface NetlifyDeployOptions {
  netlify: NetlifyOptions;
  lighthouse?: boolean;
}

interface NetlifyCliOptions {
  alias?: string;
  prod?: boolean;
}

interface NetlifyJobOptions {
  jobName: string;
  jobFilter: string;
  cliOptions: NetlifyCliOptions;
}
// ? `netlify deploy --dir=${NETLIFY_DEPLOY_DIR} --alias=${prAlias} --json`
// : `netlify deploy --dir=${NETLIFY_DEPLOY_DIR} --prod`,

class NetlifyDeploy extends Component {
  constructor(
    scope: typescript.TypeScriptAppProject,
    options: NetlifyDeployOptions,
  ) {
    super(scope);

    const makeJob = (jobOptions: NetlifyJobOptions): Job => {
      const cliArgs = Object.entries(jobOptions.cliOptions)
        .map((item) => {
          return `--${item[0]}=${item[1]}`;
        })
        .join(" ");

      /**
       * Build the deploy job
       */
      const job: Job = {
        name: jobOptions.jobName,
        concurrency: jobOptions.jobName,
        if: jobOptions.jobFilter,
        needs: ["build"],
        runsOn: ["ubuntu-latest"],
        env: {
          CI: "true",
        },
        permissions: {
          contents: JobPermission.READ,
        },
        outputs: {
          DEPLOY_URL: {
            stepId: "deploy-step",
            outputName: "DEPLOY_URL",
          },
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
            id: "deploy-step",
            run: [
              `DEPLOY_URL=$(netlify deploy --dir=$NETLIFY_DEPLOY_DIR ${cliArgs} --json | jq -r '.deploy_url')`,
              `echo "DEPLOY_URL=$DEPLOY_URL" >> "$GITHUB_OUTPUT"`,
            ].join("\n"),
            env: {
              NETLIFY_DEPLOY_DIR: options.netlify.deployDir,
              NETLIFY_AUTH_TOKEN: options.netlify.authToken,
              NETLIFY_SITE_ID: options.netlify.siteId,
            },
          },
          {
            name: "Publish Summary",
            run: [
              `echo "### Deploy Complete! :rocket:" >> $GITHUB_STEP_SUMMARY`,
              `echo "- Netlify Preview URL: $DEPLOY_URL" >> $GITHUB_STEP_SUMMARY`,
            ].join("\n"),
            env: {
              DEPLOY_URL: "${{ steps.deploy-step.outputs.DEPLOY_URL }}",
            },
          },
        ],
      };

      return job;
    };

    /**
     * Add build jobs
     */
    [
      {
        jobName: "netlify-preview",
        jobFilter: "startsWith( github.ref, 'refs/pull/' )",
        cliOptions: { alias: "pr-${{ github.event.number }}" },
      },
      {
        jobName: "netlify-publish",
        jobFilter: "startsWith( github.ref, 'refs/heads/main' )",
        cliOptions: { prod: true },
      },
    ].forEach((o) => {
      const deployJob = makeJob({ ...o });
      project.buildWorkflow?.addPostBuildJob(deployJob.name!, deployJob);

      /**
       * Add lighthouse audit?
       */
      if (options.lighthouse) {
        const lhRelease = new LightHouseAudit(scope, {
          inputs: { jobName: deployJob.name!, outputName: "DEPLOY_URL" },
        });
        project.buildWorkflow?.addPostBuildJob(
          lhRelease.job.name!,
          lhRelease.job,
        );
      }
    });
  }
}

interface LightHouseAuditOptions {
  inputs: {
    /**
     * The name of the build job that will run before lighthouse.
     */
    jobName: string;

    /**
     * The name of the output from the needsJob that will supply the Audit URL
     * for lighthouse to use
     */
    outputName: string;
  };
}

/**
 * Run Lighthouse audits on a previously deployed site.
 */
export class LightHouseAudit extends Component {
  readonly job: Job;

  constructor(
    scope: typescript.TypeScriptAppProject,
    options: LightHouseAuditOptions,
  ) {
    super(scope);

    const jobName = `lh-${options.inputs.jobName}`;

    /**
     * Build lighthouse job
     */
    this.job = {
      name: jobName,
      concurrency: jobName,
      needs: [options.inputs.jobName],
      runsOn: ["ubuntu-latest"],
      env: {
        CI: "true",
      },
      permissions: {},
      steps: [
        {
          name: "Audit URL(s) using Lighthouse",
          uses: "treosh/lighthouse-ci-action@v11",
          with: {
            urls: ["$DEPLOY_URL"].join("\n"),
            uploadArtifacts: true,
            temporaryPublicStorage: true,
            runs: 3,
          },
          env: {
            DEPLOY_URL:
              "${{ " +
              [
                "needs",
                options.inputs.jobName,
                "outputs",
                options.inputs.outputName,
              ].join(".") +
              " }}",
            // see: https://github.com/treosh/lighthouse-ci-action/issues/21
            LHCI_BUILD_CONTEXT__CURRENT_HASH: "${{ github.sha }}",
          },
        },
      ],
    };
  }
}

/**
 * Add both preview deploy and production release to the proper workflows.
 *
 * We also ask the deploy job to add lighthouse audits on the deployed site.
 */
new NetlifyDeploy(project, {
  netlify: {
    deployDir: NETLIFY_DEPLOY_DIR,
    authToken: NETLIFY_AUTH_TOKEN,
    siteId: NETLIFY_SITE_ID,
  },
  lighthouse: true,
});

/**
 * Generate the project
 */
project.synth();
