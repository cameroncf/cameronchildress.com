import VitePressSidebar, {
  SidebarItem,
  SidebarMulti,
  SidebarMultiItem,
} from "vitepress-sidebar";

export const sidebar = VitePressSidebar.generateSidebar([
  {
    documentRootPath: "src",
    scanStartPath: "posts",
    resolvePath: "/posts/",
    useTitleFromFrontmatter: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: true,
  },
]) as SidebarMulti;

export const blogMenu = Object.entries(sidebar).reduce(
  (acc, [key, value]) => {
    const items: Array<SidebarItem> = [];

    value.items.forEach((year) => {
      year.items?.forEach((month) => {
      
        items.push({
          text: formatDate(`1-${month.text}-${year.text}`),
          items: month.items?.reduce((acc, post) => {
            acc.push({ ...post });
            return acc;
          }, [] as Array<SidebarItem>),
        });
      });
    });

    acc[key] = { base: value.base, items };
    return acc;
  },
  {} as Record<string, SidebarMultiItem>,
);

function formatDate(raw: string): string {
  const date = new Date(raw);
  date.setUTCHours(12);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}
