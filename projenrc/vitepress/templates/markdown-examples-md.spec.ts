import { readFileSync } from "fs";
import path from "path";
import { MarkdownExamplesMd } from "./markdown-examples-md";
import { VitepressProject } from "../vitepress";

const fixture = readFileSync(
  path.join(__dirname, "__fixtures__/default/markdown-examples.md"),
  "utf-8",
);

describe("MarkdownExamplesMd", () => {
  it("should create matching content ", () => {
    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
    });

    const apiExamples = new MarkdownExamplesMd(project);
    expect(apiExamples.fileContent).toBe(fixture);
  });
});
