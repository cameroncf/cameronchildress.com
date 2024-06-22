import { NetlifyDeploy, VitepressProject } from "@sumoc/breeze";

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
// const VITEPRESS_SITE_DIR = "content";

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
// const NETLIFY_AUTH_TOKEN = "${{ secrets.NETLIFY_AUTH_TOKEN }}";

/**
 * The directory where the VitePress build artifacts are located. This is used
 * to tell various parts of Projen where to expect build outputs to be located.
 */
// const NETLIFY_DEPLOY_DIR = `${VITEPRESS_SITE_DIR}/.vitepress/dist`;

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
   * This will become the name of the project in the package.json file.
   */
  name: "cameronchildress.com",

  devDeps: ["@sumoc/breeze", "vitepress-sidebar"],
});

new NetlifyDeploy(project, { siteId: NETLIFY_SITE_ID });

/**
 * Generate the project
 */
project.synth();
