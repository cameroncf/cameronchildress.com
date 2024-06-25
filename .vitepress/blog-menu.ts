import VitePressSidebar from "vitepress-sidebar";

export const sidebar = VitePressSidebar.generateSidebar([
  {
    documentRootPath: "src",
    scanStartPath: "posts",
    resolvePath: "/posts/",
    useTitleFromFrontmatter: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    sortMenusByFrontmatterDate: true,
  },
]);

export const blogMenu = Object.entries(sidebar).reduce((acc, [key, value]) => {
  console.log("key:", key);

  // years
  value.items.forEach((y) => {
    const year = y.text;

    y.items.forEach((m) => {
      const month = m.text;

      console.log("year:", year);
      console.log("month:", month);
    });
  });

  acc[key] = value;
  return acc;
}, {});
