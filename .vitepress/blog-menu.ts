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
    excludeFilesByFrontmatterFieldName: "draft",
  },
]) as SidebarMulti;

export const blogMenu = Object.entries(sidebar).reduce(
  (acc, [key, value]) => {
    const items: Array<SidebarItem> = [];

    value.items.forEach((year) => {
      year.items?.forEach((month) => {
        const monthRoll: Array<SidebarItem> = [];

        month.items?.forEach((day) => {
          day.items?.forEach((post) => {
            //const d = formatDayWithSuffix(Number(day.text));
            monthRoll.push({ ...post });
          });
        });

        // build the month's list of posts
        items.push({
          text: formatDate(`1-${month.text}-${year.text}`),
          items: monthRoll,
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
/*
function formatDayWithSuffix(day: number): string {
  const j = day % 10,
        k = day % 100;
  if (j == 1 && k != 11) {
    return day + "st";
  }
  if (j == 2 && k != 12) {
    return day + "nd";
  }
  if (j == 3 && k != 13) {
    return day + "rd";
  }
  return day + "th";
}
  */
