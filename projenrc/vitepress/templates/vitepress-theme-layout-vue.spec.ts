import { readFileSync } from "fs";
import path from "path";
import { VitepressThemeLayoutVue } from "./vitepress-theme-layout-vue";
import { ScaffoldThemeType, VitepressProject } from "../vitepress";

describe("VitepressThemeLayoutVue", () => {
  it("should create matching content for Custom theme", () => {
    const fixture = readFileSync(
      path.join(__dirname, "__fixtures__/custom/.vitepress/theme/Layout.vue"),
      "utf-8",
    );

    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.Custom,
      },
    });

    const vpConfigJs = new VitepressThemeLayoutVue(project);
    expect(vpConfigJs.fileContent).toBe(fixture);
  });
});
