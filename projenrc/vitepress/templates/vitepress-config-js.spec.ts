import { readFileSync } from "fs";
import path from "path";
import { VitepressConfigJs } from "./vitepress-config-js";
import { ScaffoldThemeType, VitepressProject } from "../vitepress";

describe("VitepressConfigJs", () => {
  it("should create matching content for DefaultCustom theme", () => {
    const fixture = readFileSync(
      path.join(__dirname, "__fixtures__/default-custom/.vitepress/config.mts"),
      "utf-8",
    );

    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.DefaultCustom,
      },
    });

    const vpConfigJs = new VitepressConfigJs(project);
    expect(vpConfigJs.fileContent).toBe(fixture);
  });

  it("should create matching content for Default theme", () => {
    const fixture = readFileSync(
      path.join(__dirname, "__fixtures__/default/.vitepress/config.mts"),
      "utf-8",
    );

    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.Default,
      },
    });

    const vpConfigJs = new VitepressConfigJs(project);
    expect(vpConfigJs.fileContent).toBe(fixture);
  });

  it("should create matching content for Custom theme", () => {
    const fixture = readFileSync(
      path.join(__dirname, "__fixtures__/custom/.vitepress/config.mts"),
      "utf-8",
    );
    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.Custom,
      },
    });

    const vpConfigJs = new VitepressConfigJs(project);
    expect(vpConfigJs.fileContent).toBe(fixture);
  });
});
