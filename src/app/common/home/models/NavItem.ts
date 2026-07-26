export interface NavItem {
    name: string;
    route?: string;
    icon: string;
    roles: string[]; // Allowed roles for this item
    subpages?: { name: string; route: string; roles: string[] }[];
  }