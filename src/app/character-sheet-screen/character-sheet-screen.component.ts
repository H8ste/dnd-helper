import { Component, OnInit, Input, DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AngularFirestore } from '@angular/fire/firestore';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog'

import { Output, EventEmitter } from '@angular/core';

import * as table from './spell-table'

import * as interfaces from '../home/player_collection'

import { SaveConfig } from '../home/save_config'

import { faCircle as fasCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { DialogHitpointsComponent } from '../dialog-hitpoints/dialog-hitpoints.component';

import { AsModifierPipe } from './../ability-modifier/ability-modifer.pipe'
import { EventsService } from '../events.service';

@Component({
  selector: 'character-sheet-screen',
  templateUrl: './character-sheet-screen.component.html',
  styleUrls: ['./character-sheet-screen.component.css',],
})


export class CharacterSheetScreenComponent implements OnInit {
  Console = console;

  @Input() AvailableSpells: interfaces.Spell[]
  @Input() SpellsPrepared: string[]
  // @Input() PlayerSpellSlots
  @Output() OnSwitchScreen = new EventEmitter<number>();
  @Output() spellSave = new EventEmitter<interfaces.Spell>();
  @Output() PlayerCollectionSave = new EventEmitter<SaveConfig>();


  farCircle = farCircle;
  fasCircle = fasCircle;
  wizardTable;
  isSmallScreen;
  savingthrowsShowCombined = false;
  skillsShowCombined = false;

  onlyShowPrepared = false;



  constructor(
    private router: Router,
    breakpointObserver: BreakpointObserver,
    private db: AngularFirestore,
    public hitpointsDialog: MatDialog,
    private asModifierPipe: AsModifierPipe,
    public events: EventsService) {
    this.wizardTable = table.table;

  }

  toggleShownApproach(i: number) {
    if (i == 0) this.savingthrowsShowCombined = !this.savingthrowsShowCombined;
    if (i == 1) this.skillsShowCombined = !this.skillsShowCombined;

  }

  getAbilityScoresIterator() {
    return this.events.PlayerCollection ? Object.values(this.events.PlayerCollection.ability_scores) : null
  }

  updateMyLayoutForScreenSizeChange(result): void {
    this.isSmallScreen = result.matches
  }

  ngOnInit(): void {
  }

  onClick(): void {
    this.router.navigate(["/spells"]);
  }

  isVisibleOnMobile(): void {
    console.log("oof")
  }

  switchScreen() {
    this.OnSwitchScreen.emit(1);
  }

  openSpellHelper() {

  }

  getEnumaratorFromInt(int: number) {
    var list = [];
    for (var i = 1; i <= int; i++) {
      list.push(i);
    }
    return list
  }

  getEnumaratorFromLevelAndSpellSlot(level: number, spellSlot: number) {

    const int = this.wizardTable[level - 1][spellSlot - 1]
    var list = [];
    for (var i = 0; i < int; i++) {
      list.push(i);
    }
    return list
  }

  toggleSpellSlot(spellLevel: number, spellSlot: number, wasNotFilled: boolean) {
    if (wasNotFilled) {
      this.events.spellSlotsUsed[spellLevel]++;
    } else {
      this.events.spellSlotsUsed[spellLevel]--;
    }
    console.debug(spellLevel + " " + spellSlot + " " + wasNotFilled)
  }

  toggleScholarLevel(wasNotFilled: boolean) {
    if (wasNotFilled) {
      this.events.scholarPointsUsed++;
    } else {
      this.events.scholarPointsUsed--;
    }
    // console.debug(spellLevel + " " + spellSlot + " " + wasNotFilled)
  }

  saveSpell(spellToSave: interfaces.Spell) {
    this.spellSave.emit(spellToSave);
  }

  heartClicked() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      current_hitpoints: this.events.PlayerCollection.status.current_hitpoints,
      max_hitpoints: this.events.PlayerCollection.status.max_hitpoints,
      temp_hitpoints: this.events.PlayerCollection.status.temp_hitpoints,
    }
    let dialogRef = this.hitpointsDialog.open(DialogHitpointsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((newHitpoints) => {
      console.debug(newHitpoints);
      if (newHitpoints) {
        console.debug(newHitpoints);
        this.events.PlayerCollection.status.current_hitpoints = newHitpoints.current_hitpoints;
        this.events.PlayerCollection.status.max_hitpoints = newHitpoints.max_hitpoints;
        this.events.PlayerCollection.status.temp_hitpoints = newHitpoints.temp_hitpoints;

        //save
        this.PlayerCollectionSave.emit({ player: this.events.PlayerCollection, keyOfField: ["status"] })


      }
    })
    // this.hitpointsDialog.afterAllClosed.
  }

  prepareSpell(spell: interfaces.Spell) {
    if (spell) {
      //check if player already has too many spells prepared

      //check if player doesn't already has this spell prepared
      if (this.events.PlayerCollection.spells_prepared.some((spellPreparedName) => {
        return spellPreparedName === spell.name
      })) {
        for (var i = 0; i < this.events.PlayerCollection.spells_prepared.length; i++) {
          if (this.events.PlayerCollection.spells_prepared[i] === spell.name) {
            this.events.PlayerCollection.spells_prepared.splice(i, 1);
          }
        }
        console.debug("already has this spell prepared - unpreparing it")

      } else {
        if (this.canPrepare()) {
          this.events.PlayerCollection.spells_prepared.push(spell.name);
          console.debug("preparing spell")
        }
        else {
          console.debug("can't prepare any more spells")
        }
      }

      this.PlayerCollectionSave.emit({ player: this.events.PlayerCollection, keyOfField: ["spells_prepared"] })

    }

  }

  alreadyPrepared(spell: interfaces.Spell) {
    if (spell.level === 'cantrip') {
      return true;
    }
    return this.events.PlayerCollection.spells_prepared.some((spellPreparedName) => {
      return spellPreparedName === spell.name
    });
  }

  canPrepare() {
    return this.events.PlayerCollection.spells_prepared.length < this.events.PlayerCollection.level + this.asModifierPipe.transform(this.events.PlayerCollection.ability_scores.int)
  }

  nonCantripSpellsPrepared() {
    var counter = 0;

    return counter;
  }
  Ceil(input: number) {
    return Math.ceil(input)
  }
}
