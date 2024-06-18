import { Project } from "projen";
import { NodePackageManager, NodeProject } from "projen/lib/javascript";
import { PnpmWorkspace } from "./pnpm-workspace";
import { synthFiles } from "../test-utils";

describe("Success Conditions", () => {
  test("should generate a file for mutiproject repo", () => {
    const parent = new NodeProject({
      name: "parent-project",
      defaultReleaseBranch: "main",
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "9",
    });
    const project = new NodeProject({
      name: "child-project",
      defaultReleaseBranch: "main",
      outdir: "bar",
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "9",
      parent,
    });

    new PnpmWorkspace(project);
    new PnpmWorkspace(parent);
    const content = synthFiles(parent);

    // in root project
    expect(content["pnpm-workspace.yaml"]).toBeDefined();
    // not in subproject
    expect(content["bar/pnpm-workspace.yaml"]).toBeUndefined();
  });

  test("should not create file for single project repo", () => {
    const project = new NodeProject({
      name: "solo-project",
      defaultReleaseBranch: "main",
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "9",
    });

    new PnpmWorkspace(project);
    const content = synthFiles(project);

    expect(content["pnpm-workspace.yaml"]).toBeUndefined();
  });
});

describe("Failure Conditions", () => {
  test("should throw when using default of Yarn", () => {
    const project = new NodeProject({
      name: "bar",
      defaultReleaseBranch: "main",
      outdir: "bar",

      parent: new NodeProject({
        name: "foo",
        defaultReleaseBranch: "main",
      }),
    });

    expect(() => {
      new PnpmWorkspace(project);
    }).toThrow();
  });

  test("should throw when root project is not pnpm based", () => {
    const project = new NodeProject({
      name: "bar",
      defaultReleaseBranch: "main",
      outdir: "bar",

      parent: new Project({
        name: "foo",
      }),
    });

    expect(() => {
      new PnpmWorkspace(project);
    }).toThrow();
  });
});
