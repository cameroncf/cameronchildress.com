import { expect, describe, it } from "vitest";
import { blogMenu, sidebar } from "./blog-menu";

describe("Sidebar", () => {
  it("should generate monthly lists", () => {
    console.log("sidebar:", JSON.stringify(sidebar, null, 2));
    console.log("blogMenu:", JSON.stringify(blogMenu, null, 2));
  });
});
