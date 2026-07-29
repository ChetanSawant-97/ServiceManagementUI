import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

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
    RouterLink,
    RouterLinkActive,
    FormsModule,
    Button,     // For the toggle button
    Ripple      // For the material click effect on links
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {
  protected readonly expanded = signal<boolean>(true);
  protected readonly userRoles = signal<string[]>(['ADMIN', 'SALES']);

  // Updated icons to use PrimeIcons (pi pi-*)
  private readonly allNavigationModules: NavGroup[] = [
    {
      title: 'Workspace',
      roles: ['ADMIN','SALES'],
      items: [
        { 
          name: 'Sales', 
          route: '/sales', 
          icon: 'pi pi-chart-line', 
          roles: ['ADMIN', 'SALES'],
          subpages: [
            { name: 'Sales Personal', route: '/dashboard/overview', icon: 'pi pi-user', roles: ['ADMIN'] },
            { name: 'Designation', route: '/dashboard/realtime', icon : 'pi pi-id-card', roles: ['ADMIN'] },
            { name: 'Trip Details', route: '/dashboard/realtime', icon : 'pi pi-map-marker', roles: ['ADMIN'] }
          ]
        },
        { name: 'Dealer', route: '/dealer', icon: 'pi pi-shop', roles: ['ADMIN', 'SALES'] },
        { name: 'Orders', route: '/orders', icon: 'pi pi-box', roles: ['ADMIN', 'SALES','DEALER'] }
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

  toggleSubmenu(itemName: string) {
      if (!this.expanded()) {
          this.expanded.set(true);
          this.openSubmenu.set(itemName);
      } else {
          this.openSubmenu.update(current => current === itemName ? null : itemName);
      }
  }
}