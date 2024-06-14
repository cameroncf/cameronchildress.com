import { VitepressProject } from "@sumoc/breeze";
import { Component, typescript } from "projen";
import { Job, JobPermission } from "projen/lib/github/workflows-model";

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

const project = new VitepressProject({
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
   * Defined the GitHub Action triggers for the project. In this case we want
   * CI workflows to be triggered when:
   *
   * - A PR is opened
   * - A manual workflow is triggered in GitHub's UI
   * - When code is pushed to the main branch (a production deploy)
   */
  buildWorkflowTriggers: {
    pullRequest: {},
    workflowDispatch: {},
    push: { branches: ["main"] },
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

  /**
   * Add breeze
   */
  devDeps: ["@sumoc/breeze"],
});

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

interface NetlifyJobOptions {
  jobName: string;
  jobFilter: string;
  cliOptions: string;
}

class NetlifyDeploy extends Component {
  constructor(
    scope: typescript.TypeScriptAppProject,
    options: NetlifyDeployOptions,
  ) {
    super(scope);

    const makeJob = (jobOptions: NetlifyJobOptions): Job => {
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
              `DEPLOY_URL=$(netlify deploy --dir=$NETLIFY_DEPLOY_DIR ${jobOptions.cliOptions} --json | jq -r '.deploy_url')`,
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
        cliOptions: "--alias=pr-${{ github.event.number }}",
      },
      {
        jobName: "netlify-publish",
        jobFilter: "startsWith( github.ref, 'refs/heads/main' )",
        cliOptions: "--prod",
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
