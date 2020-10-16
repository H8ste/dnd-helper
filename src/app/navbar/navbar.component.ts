import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FirebaseUserModel } from '../core/user.model';
import { EventsService } from '../events.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() user: FirebaseUserModel;
  @Output() OnLogOut = new EventEmitter<boolean>();
  showNavbar = false;
  constructor(private eventservice: EventsService) { }

  ngOnInit(): void {
  }


  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }

  logout() {
    this.OnLogOut.emit(true);
  }

  shortRest() {
    this.eventservice.shortRest();
  }

  longRest() {
    this.eventservice.longRest();
  }
}
