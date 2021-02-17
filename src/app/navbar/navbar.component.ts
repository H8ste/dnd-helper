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
  loadAllSpells: boolean;
  constructor(private eventservice: EventsService) {
    this.loadAllSpells = eventservice.loadAllSpells;
  }



  ngOnInit(): void {
  }



  toggleLoadAllSpells() {
    this.eventservice.toggleLoadAllSpells();
  }

  playerHasBeenChosen() {
    return this.eventservice.PlayerCollection
  }

  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }

  getAmountOfSpells() {
    return Object.values(this.eventservice.PlayerCollection.spellbook).map(level => level !== this.eventservice.PlayerCollection.spellbook.cantrips ? level.length : 0).reduce((a, b) => a + b, 0)
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

  addNewSpell() {
    this.eventservice.addNewSpell();
  }
}
