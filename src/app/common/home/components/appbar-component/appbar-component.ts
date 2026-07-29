import { Component } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { Avatar } from 'primeng/avatar';
import { TopbarComponent } from '../topbar-component/topbar-component';

@Component({
  selector: 'app-appbar',
  standalone: true, 
  imports: [Toolbar,TopbarComponent],
  templateUrl: './appbar-component.html',
  styleUrl: './appbar-component.scss',
})
export class AppbarComponent {}