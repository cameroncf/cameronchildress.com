import { readFileSync } from "fs";
import path from "path";
import { ApiExamplesMd } from "./api-examples-md";
import { VitepressProject } from "../vitepress";

const fixture = readFileSync(
  path.join(__dirname, "__fixtures__/default/api-examples.md"),
  "utf-8",
);

describe("ApiExamplesMd", () => {
  it("should create matching content ", () => {
    const project = new VitepressProject({
      name: "foo",
      defaultReleaseBranch: "main",
    });

    const apiExamples = new ApiExamplesMd(project);
    expect(apiExamples.fileContent).toBe(fixture);
  });
});
