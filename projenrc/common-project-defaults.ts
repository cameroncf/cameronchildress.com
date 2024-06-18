/**
 * All projects have these defaults unless overridden by exp[licitly set options.]
 */

import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptProjectOptions } from "projen/lib/typescript";

export const defaultTypescriptProjectOptions: Partial<TypeScriptProjectOptions> =
  {
    /**
     * Use PNPM instead of the default of Yarn.
     */
    packageManager: NodePackageManager.PNPM,
    pnpmVersion: "9",

    /**
     * Enable prettier for good linting and formatting. This configures the
     * standard ESLint (that Projen already configure by default) to use Prettier.
     */
    prettier: true,

    /**
     * We don't want projen to create sample files. Especially since we'll
     * co-locate test with the code they are testing and leaving this on will
     * annoyingly recreate the "/test" directory.
     */
    sampleCode: false,
  };
