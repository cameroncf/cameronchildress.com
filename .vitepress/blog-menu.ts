import VitePressSidebar, { Sidebar, SidebarMultiItem } from "vitepress-sidebar";

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
]) as Sidebar;

export const blogMenu = Object.entries(sidebar).reduce(
  (
    acc,
    [key, value],
  ): { acc: any; f: Array<Record<string, SidebarMultiItem>> } => {
    console.log("key:", key);

    // years
    value.items.forEach((y) => {
      const year = y.text;

      y.items.forEach((m: string) => {
        const month = m.text;

        console.log("year/month:", year, month);
      });
    });

    acc[key] = {};

    return acc;
  },
  {},
);
