import { readFileSync } from "fs";
import path from "path";
import { VitepressThemeIndexJs } from "./vitepress-theme-index-js";
import { ScaffoldThemeType, VitepressProject } from "../vitepress";

describe("VitepressThemeIndexJs", () => {
  it("should create matching content for DefaultCustom theme", () => {
    const fixture = readFileSync(
      path.join(
        __dirname,
        "__fixtures__/default-custom/.vitepress/theme/index.ts",
      ),
      "utf-8",
    );

    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.DefaultCustom,
      },
    });

    const vpConfigJs = new VitepressThemeIndexJs(project);
    expect(vpConfigJs.fileContent).toBe(fixture);
  });

  it("should create matching content for Custom theme", () => {
    const fixture = readFileSync(
      path.join(__dirname, "__fixtures__/custom/.vitepress/theme/index.ts"),
      "utf-8",
    );

    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.Custom,
      },
    });

    const vpConfigJs = new VitepressThemeIndexJs(project);
    expect(vpConfigJs.fileContent).toBe(fixture);
  });
});
