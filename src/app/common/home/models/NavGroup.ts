import { NavItem } from "./NavItem";

export interface NavGroup {
    title: string;
    roles: string[];
    items: NavItem[];
  }