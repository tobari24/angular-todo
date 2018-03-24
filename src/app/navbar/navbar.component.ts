import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/core/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: Observable<User | null>;
  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  logOut() {
    this.authService.logOut();
  }
}
