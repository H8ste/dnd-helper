import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FirebaseUserModel } from '../core/user.model';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() user: FirebaseUserModel;
  @Output() OnLogOut = new EventEmitter<boolean>();
  showNavbar = false;
  constructor() { }

  ngOnInit(): void {
  }


  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }

  logout() {
    this.OnLogOut.emit(true);
  }
}
