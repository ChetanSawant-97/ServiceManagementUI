import { Component, inject } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { AuthService } from '../../../auth/services/Authentication.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-appbar',
  standalone: true, 
  imports: [Toolbar,ButtonModule],
  templateUrl: './appbar-component.html',
  styleUrl: './appbar-component.scss',
})
export class AppbarComponent {
  authenticationService = inject(AuthService);

  logout(){
    this.authenticationService.logout();
  }
}