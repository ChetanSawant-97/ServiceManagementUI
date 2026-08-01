import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { AppbarComponent } from '../appbar-component/appbar-component';

@Component({
  selector: 'app-app-shell',
  imports: [Sidebar, RouterOutlet,AppbarComponent], // <-- 2. Add it to your imports
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {

}
