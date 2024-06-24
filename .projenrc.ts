
import { NetlifyDeploy, VitepressProject } from "@sumoc/breeze";

/**
 * The Netlify Site ID is a unique identifier for your site. You can find this
 * value in the Netlify dashboard for your site and replace it with your own
 * Site ID.
 *
 * This is not considered a secret.
 */
const NETLIFY_SITE_ID = "7840347a-1605-469f-878f-bc76c7333db4";

/**
 * This component generates a default Vitepress project using Breeze.
 */
const project = new VitepressProject({
  name: "cameronchildress.com",
  devDeps: ["@sumoc/breeze@^0.0.29", "vitepress-sidebar"],
});

/**
 * Add a Netlify deployment task for the site..
 */
new NetlifyDeploy(project, { siteId: NETLIFY_SITE_ID });

/**
 * Generate the project
 */
project.synth();
