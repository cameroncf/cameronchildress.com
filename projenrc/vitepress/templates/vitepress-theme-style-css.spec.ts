import { readFileSync } from "fs";
import path from "path";
import { VitepressThemeStyleCss } from "./vitepress-theme-style-css";
import { ScaffoldThemeType, VitepressProject } from "../vitepress";

describe("VitepressThemeStyleCss", () => {
  it("should create matching content for Custom theme", () => {
    const fixture = readFileSync(
      path.join(__dirname, "__fixtures__/custom/.vitepress/theme/style.css"),
      "utf-8",
    );

    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.Custom,
      },
    });

    const vpConfigJs = new VitepressThemeStyleCss(project);
    expect(vpConfigJs.fileContent).toBe(fixture);
  });

  it("should create matching content for DefaultCustom theme", () => {
    const fixture = readFileSync(
      path.join(
        __dirname,
        "__fixtures__/default-custom/.vitepress/theme/style.css",
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

    const vpConfigJs = new VitepressThemeStyleCss(project);
    expect(vpConfigJs.fileContent).toBe(fixture);
  });
});
