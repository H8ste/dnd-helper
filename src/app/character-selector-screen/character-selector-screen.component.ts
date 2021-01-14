import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
  selector: 'character-selector-screen',
  templateUrl: './character-selector-screen.component.html',
  styleUrls: ['./character-selector-screen.component.css']
})
export class CharacterSelectorScreenComponent implements OnInit {
  @Output() OnPlayerChosen = new EventEmitter<boolean>();
  constructor(public events: EventsService) { }

  ngOnInit(): void {
  }

  playCharacter(characterToPlay){
    this.events.PlayerCollection = characterToPlay;
    this.OnPlayerChosen.emit(true);
  }

}
