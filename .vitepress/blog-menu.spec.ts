import { describe, expect, it } from "vitest";
import { blogMenu } from "./blog-menu";

describe("Sidebar", () => {
  it("should generate monthly lists", () => {
    expect(blogMenu).toBeDefined();
    // console.log(JSON.stringify(blogMenu, null, 2));
  });
});
