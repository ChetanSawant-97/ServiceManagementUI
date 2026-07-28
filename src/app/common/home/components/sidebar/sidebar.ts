import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  TuiButton, 
  TuiDataList, 
  TuiDropdown, 
  TuiDropdownHover, 
  TuiHint,
  TuiHintManual,  
} from '@taiga-ui/core';
import { TuiNavigation} from '@taiga-ui/layout';
import { TuiChevron } from '@taiga-ui/kit';

export interface NavSubpage {
  name: string;
  route: string;
  roles: string[];
  icon : string;
}

export interface NavItem {
  name: string;
  route?: string;
  icon: string;
  roles: string[];
  subpages?: NavSubpage[];
}

export interface NavGroup {
  title: string;
  roles: string[];
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    TuiNavigation,  
    TuiHintManual,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiHint,
    TuiChevron,
    TuiNavigation
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {
  protected readonly expanded = signal<boolean>(true);
  protected readonly userRoles = signal<string[]>(['ADMIN', 'SALES']);

  private readonly allNavigationModules: NavGroup[] = [
    {
      title: 'Workspace',
      roles: ['ADMIN','SALES'],
      items: [
        { 
          name: 'Sales', 
          route: '/sales', 
          icon: '@tui.trending-up', 
          roles: ['ADMIN', 'SALES'],
          subpages: [
            { name: 'Sales Personal', 
              route: '/dashboard/overview', 
              icon: '@tui.user',
              roles: ['ADMIN'] 
            },
            { name: 'Designation', 
              route: '/dashboard/realtime',
              icon : '@tui.award',
              roles: ['ADMIN'] 
            },
            { name: 'Trip Details', 
              route: '/dashboard/realtime',
              icon : '@tui.map-pin',
              roles: ['ADMIN'] 
            }
          ]
        },
        { 
          name: 'Dealer', 
          route: '/dealer', 
          icon: '@tui.store', 
          roles: ['ADMIN', 'SALES'] 
        },
        { 
          name: 'Orders', 
          route: '/orders', 
          icon: '@tui.package', 
          roles: ['ADMIN', 'SALES','DEALER'] 
        }
      ]
    }
  ];

  protected readonly filteredNavigation = computed(() => {
    const currentRoles = this.userRoles();

    return this.allNavigationModules
      .filter(group => group.roles.some(role => currentRoles.includes(role)))
      .map(group => ({
        ...group,
        items: group.items
          .filter(item => item.roles.some(role => currentRoles.includes(role)))
          .map(item => ({
            ...item,
            subpages: item.subpages?.filter(sub => sub.roles.some(role => currentRoles.includes(role)))
          }))
      }));
  });

  protected handleToggle(): void {
    this.expanded.update(value => !value);
  }
  
  openSubmenu = signal<string | null>(null);

  // Add this method
  toggleSubmenu(itemName: string) {
      if (!this.expanded()) {
          // If sidebar is collapsed, open sidebar AND the submenu
          this.expanded.set(true);
          this.openSubmenu.set(itemName);
      } else {
          // If sidebar is already open, just toggle the submenu
          this.openSubmenu.update(current => current === itemName ? null : itemName);
      }
  }
}