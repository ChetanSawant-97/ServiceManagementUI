import { Component, inject } from '@angular/core';
import { Menu } from 'primeng/menu';
import { Avatar } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-topbar-component',
  imports: [Menu, Avatar,ButtonModule],
  templateUrl: './topbar-component.html',
  styleUrl: './topbar-component.scss',
})
export class TopbarComponent {
  // Define your menu options
  profileMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {
        
      }
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => {
        console.log('Navigate to settings');
      }
    },
    { 
      separator: true // Adds a nice dividing line before Logout
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        
      }
    }
  ];
}
