import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TokenService } from '../../../auth/services/Token.service';

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
    Button,
    Ripple
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar implements OnInit {
  private router = inject(Router);
  private tokenService = inject(TokenService); // <-- Inject TokenService

  protected readonly expanded = signal<boolean>(true);
  
  // Dynamically initialize the signal with the role from the token. 
  // We use toLowerCase() to safely match the lowercase roles in the array below.
  protected readonly userRole = signal<string>(
    this.tokenService.getUserData()?.role?.toLowerCase() || ''
  );

  private readonly allNavigationModules: NavGroup[] = [
    {
      title: 'Workspace',
      roles: ['admin', 'sales', 'dealer'],
      items: [
        {
          name:"Configuration",
          route: '/config',
          icon: 'pi pi-cog',
          roles: ['admin'],
          subpages: [
            { name: 'Product Master', route: '/config/products', icon: 'pi pi-box', roles: ['admin'] },
            { name: 'Trip Master', route: '/config/tripDetails', icon: 'pi pi-calculator', roles: ['admin'] }
          ]
        },
        { 
          name: 'Sales', 
          route: '/sales', 
          icon: 'pi pi-chart-line', 
          roles: ['admin', 'sales'],
          subpages: [
            { name: 'Sales Personal', route: '/sales/personal', icon: 'pi pi-user', roles: ['admin', 'sales'] },
            { name: 'Designation', route: '/sales/designation', icon : 'pi pi-id-card', roles: ['admin', 'sales'] }
          ]
        },
        { name: 'Track Sales', route: '/trackSales', icon: 'pi pi-map-marker', roles: ['admin'] },
        { name: 'Dealer', route: '/dealer', icon: 'pi pi-shop', roles: ['admin', 'sales'] },
        { name: 'Orders', route: '/orders', icon: 'pi pi-box', roles: ['admin', 'sales', 'dealer'] }
      ]
    }
  ];

  ngOnInit() {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        this.expanded.set(false);
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        this.expanded.set(false);
      }
    });
  }

  // Corrected filtering logic to match a single role string against the arrays
  protected readonly filteredNavigation = computed(() => {
    const currentRole = this.userRole();

    // Safety check: if no role exists, show nothing
    if (!currentRole) return [];

    return this.allNavigationModules
      .filter(group => group.roles.includes(currentRole))
      .map(group => ({
        ...group,
        items: group.items
          .filter(item => item.roles.includes(currentRole))
          .map(item => ({
            ...item,
            subpages: item.subpages?.filter(sub => sub.roles.includes(currentRole))
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