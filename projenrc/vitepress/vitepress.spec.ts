import { ScaffoldThemeType, VitepressProject } from ".";
import { synthFiles } from "../test-utils";

describe("Templates", () => {
  it("should create the correct templates fur default custom theme", () => {
    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.DefaultCustom,
      },
    });

    const content = synthFiles(project);
    const d = project.contentDirectory;

    // matching content for all files that should be present
    expect(content[`${d}/.vitepress/config.mts`]).toBeDefined();
    expect(content[`${d}/.vitepress/theme/index.ts`]).toBeDefined();
    expect(content[`${d}/.vitepress/theme/style.css`]).toBeDefined();
    expect(content[`${d}/api-examples.md`]).toBeDefined();
    expect(content[`${d}/index.md`]).toBeDefined();
    expect(content[`${d}/markdown-examples.md`]).toBeDefined();

    // no layout file should exist
    expect(content[`${d}/.vitepress/theme/Layout.vue`]).toBeUndefined();
  });

  it("should create the correct templates fur custom theme", () => {
    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.Custom,
      },
    });

    const content = synthFiles(project);
    const d = project.contentDirectory;

    // matching content for all files that should be present
    expect(content[`${d}/.vitepress/config.mts`]).toBeDefined();
    expect(content[`${d}/.vitepress/theme/index.ts`]).toBeDefined();
    expect(content[`${d}/.vitepress/theme/style.css`]).toBeDefined();
    expect(content[`${d}/api-examples.md`]).toBeDefined();
    expect(content[`${d}/index.md`]).toBeDefined();
    expect(content[`${d}/markdown-examples.md`]).toBeDefined();
    expect(content[`${d}/.vitepress/theme/Layout.vue`]).toBeDefined();
  });

  it("should create the correct templates fur default theme", () => {
    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      scaffoldOptions: {
        theme: ScaffoldThemeType.Default,
      },
    });

    const content = synthFiles(project);
    const d = project.contentDirectory;

    // matching content for all files that should be present
    expect(content[`${d}/.vitepress/config.mts`]).toBeDefined();
    expect(content[`${d}/api-examples.md`]).toBeDefined();
    expect(content[`${d}/index.md`]).toBeDefined();
    expect(content[`${d}/markdown-examples.md`]).toBeDefined();

    // no layout or theme files should exist
    expect(content[`${d}/.vitepress/theme/index.ts`]).toBeUndefined();
    expect(content[`${d}/.vitepress/theme/style.css`]).toBeUndefined();
    expect(content[`${d}/.vitepress/theme/Layout.vue`]).toBeUndefined();
  });
});

describe("Dependencies", () => {
  it("should use default version of VitePress in package.json by default", () => {
    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
    });

    const content = synthFiles(project);
    expect(content["package.json"].devDependencies.vitepress).toBe("*");
  });

  it("should add the correct VitePress version to package.json", () => {
    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
      vitepressVersion: "0.0.1",
    });

    const content = synthFiles(project);
    expect(content["package.json"].devDependencies.vitepress).toBe("0.0.1");
  });
});
