import {
  canAccessRoute,
  type AppRole,
} from "@/lib/access-control/role-access.data";
import type { NavGroup, NavMainItem } from "@/navigation/sidebar/sidebar-items";

function filterNavigationItem(
  item: NavMainItem,
  role: AppRole,
): NavMainItem | null {
  if ("url" in item) {
    return canAccessRoute(role, item.url) ? item : null;
  }

  const permittedSubItems = item.subItems.filter((subItem) =>
    canAccessRoute(role, subItem.url),
  );

  if (permittedSubItems.length === 0) {
    return null;
  }

  return {
    ...item,
    subItems: permittedSubItems,
  };
}

export function filterSidebarItems(
  groups: readonly NavGroup[],
  role: AppRole,
): NavGroup[] {
  return groups.flatMap((group) => {
    const permittedItems = group.items
      .map((item) => filterNavigationItem(item, role))
      .filter((item): item is NavMainItem => item !== null);

    if (permittedItems.length === 0) {
      return [];
    }

    return [
      {
        ...group,
        items: permittedItems,
      },
    ];
  });
}
