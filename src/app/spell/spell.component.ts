import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as interfaces from '../home/player_collection'

import { faCircle as fasCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'spell',
  templateUrl: './spell.component.html',
  styleUrls: ['./spell.component.css']
})
export class SpellComponent implements OnInit {
  @Input() spellInput: interfaces.Spell;
  @Input() alreadyPrepared: boolean;
  @Output() spellSave = new EventEmitter<interfaces.Spell>();
  @Output() prepareSpell = new EventEmitter<interfaces.Spell>();

  constructor() { }

  farCircle = farCircle;
  fasCircle = fasCircle;

  selectedIcon = faCheckCircle;


  ngOnInit(): void {
  }

  saveSpell(spellToSave: interfaces.Spell) {
    // this.spellSave.emit(spellToSave);
  }

  doubleClick(spellToPrepare: interfaces.Spell) {
    this.prepareSpell.emit(spellToPrepare);
  }

}
