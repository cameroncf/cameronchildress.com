import { Project } from "projen";
import { synthSnapshot } from "projen/lib/util/synth";

/**
 *
 * Helper to generate and returning file content for snapshot testing.
 * Useful when trying to test the final output of generated files.
 *
 * This is more of less copied from Project's own testing utils.
 *
 * @param fracture
 * @param filepath
 * @returns collection of files starting with supplied filepath
 */
export const synthFiles = (project: Project, filepath: string = ""): any => {
  const snapshot = synthSnapshot(project);
  // console.log(Object.keys(snapshot));
  const filtered = Object.keys(snapshot)
    .filter((path) => path.startsWith(filepath))
    .reduce(
      (obj, key) => {
        return {
          ...obj,
          [key]: snapshot[key],
        };
      },
      {} as { [key: string]: any },
    );
  return filtered;
};
