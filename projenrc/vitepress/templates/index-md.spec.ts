import { readFileSync } from "fs";
import path from "path";
import { IndexMd } from "./index-md";
import { ScaffoldThemeType, VitepressProject } from "../vitepress";

describe("IndexMd", () => {
  it("should create matching content for DefaultCustom theme", () => {
    const fixture = readFileSync(
      path.join(__dirname, "__fixtures__/default-custom/index.md"),
      "utf-8",
    );

    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.DefaultCustom,
      },
    });

    const indexMd = new IndexMd(project);
    expect(indexMd.fileContent).toBe(fixture);
  });

  it("should create matching content for Default theme", () => {
    const fixture = readFileSync(
      path.join(__dirname, "__fixtures__/default/index.md"),
      "utf-8",
    );

    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.Default,
      },
    });

    const indexMd = new IndexMd(project);
    expect(indexMd.fileContent).toBe(fixture);
  });

  it("should create matching content for Custom theme", () => {
    const fixture = readFileSync(
      path.join(__dirname, "__fixtures__/custom/index.md"),
      "utf-8",
    );

    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.Custom,
      },
    });

    const indexMd = new IndexMd(project);
    expect(indexMd.fileContent).toBe(fixture);
  });
});
