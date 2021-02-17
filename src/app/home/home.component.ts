import { Component, OnInit, DebugElement } from '@angular/core';
import { UserService } from '../core/user.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import { AuthenticationService } from '../core/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { SaveConfig } from './save_config'
import { EventsService } from '../events.service';

import loadedSpells from '../../assets/spells.json'
import * as interfaces from './player_collection'
import * as table from './../character-sheet-screen/spell-table'



@Component({
  selector: 'page-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  characterRelevantSpells;
  wizardTable;
  private AllSpells: Array<Array<interfaces.Spell>>;

  screenID = 0;

  private eventService = null;
  constructor(
    public userService: UserService,
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private db: AngularFirestore,
    private events: EventsService
  ) {
    this.wizardTable = table.table;
    this.events.loadAllSpellsChange.subscribe((value) => this.loadSpells())
  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
      }
    })

    this.getAvailableCharactersForUser();

  }

  get loadAllSpells(): boolean {
    console.log("loadAllSpells Changed");
    return this.events.loadAllSpells;
  }



  initialiseSpellSlots() {
    /// TODO
  }

  loadKnownSpells;

  characterHasBeenChosen() {

    console.debug("recieved results:")
    console.debug(this.events.PlayerCollection);


    this.loadSpells();

    console.debug(this.AllSpells);

    this.screenID = 1;
  }

  loadSpells() {

    this.AllSpells = new Array<Array<interfaces.Spell>>();
    for (let index = 0; index <= 9; index++) {
      var temp = new Array<interfaces.Spell>();
      this.AllSpells.push(temp)
    }

    if (!this.events.loadAllSpells) {
      for (let key in this.events.PlayerCollection.spellbook) {
        var convertedKey = key === "cantrips" ? 0 : +key;
        var spells = this.events.PlayerCollection.spellbook[key];
        spells.forEach(spell => {
          this.AllSpells[convertedKey].push(spell);
        });
      }

    } else {
      // initialise list with list containing 9 empty list
      loadedSpells.forEach(spell => {
        var obj = spell as interfaces.Spell;
        var level = obj.level === "cantrip" ? 0 : (+obj.level);
        var spellNames = []
        if ((obj["classes"].some(this.isWizardClass) && level <= this.getMaxAvailableSpellLevel(this.events.PlayerCollection.level)) || spellNames.includes(obj.name.toLowerCase())) {
          if (!this.AllSpells[level]) {
            this.AllSpells[level] = new Array<interfaces.Spell>(spell)
          } else {
            this.AllSpells[level].push(spell);
          }
        }
      })
    }
  }

  getAvailableCharactersForUser() {
    var idTokenResult = this.authService.angularFireAuth.idTokenResult.pipe(
      take(1)
    )

    // uses userID to fetch player
    idTokenResult.subscribe(idToken => {
      if (idToken) {
        var user_id = idToken.claims.user_id;
        var responseFromDatabase = this.db.collection("player_collection").doc(user_id).collection("character_collection").valueChanges();

        responseFromDatabase.subscribe((result: interfaces.PlayerCollection[]) => {
          this.events.AvailableCharacters = result;
        });
      }
    })
  }


  getMaxAvailableSpellLevel(level: number) {
    var highestlvl = 0;
    for (let spellLevel = 0; spellLevel < this.wizardTable[level - 1].length; spellLevel++) {
      if (this.wizardTable[level - 1][spellLevel] > 0) {
        highestlvl = spellLevel + 1;
      }
    }
    return highestlvl;
  }

  isWizardClass(element, index, array) {
    return element === "wizard"
  }

  save(value) {
    this.userService.updateCurrentUser(value)
      .then(res => {
        console.log(res);
      }, err => console.log(err))
  }

  SwitchScreen(event: number) {
    this.screenID = event
  }

  logout() {
    this.authService.doLogout()
      .then((res) => {
        this.location.back();
      }, (error) => {
        console.log("Logout error", error);
      });
  }

  saveSpell(event) {
    var idTokenResult = this.authService.angularFireAuth.idTokenResult.pipe(
      take(1)
    );

    idTokenResult.subscribe(idToken => {
      if (idToken) {
        var user_id = idToken.claims.user_id;
        this.getDocument(user_id + '/character_collection/' + event.playerCollection).then((result: interfaces.PlayerCollection) => {
          console.debug(result);
          const levelIndex: string = event.spell.level === "cantrip" ? "cantrips" : event.spell.level
          if (this.isUnique(event.spell.name, levelIndex in result.spellbook ? result.spellbook[levelIndex]?.map((elm) => {
            return elm.name
          }) : undefined)) {
            console.log("unique");
            if (!(levelIndex in result.spellbook)) {
              result.spellbook[levelIndex] = []
            }
            result.spellbook[levelIndex].push(event.spell);
            this.db.collection("player_collection").doc(user_id).collection("character_collection").doc(event.playerCollection).set({ spellbook: result.spellbook }, { merge: true })
          } else {
            console.log("not unique");
          }
        });
      }
    })
  }

  savePlayerCollection(saveConfig: SaveConfig) {
    var idTokenResult = this.authService.angularFireAuth.idTokenResult.pipe(
      take(1)
    );

    idTokenResult.subscribe(idToken => {
      let character = saveConfig.player;
      let keyArray = saveConfig.keyOfField;
      keyArray.forEach(key => {
        console.debug("saving character" + character[key]);
        if (idToken) {
          var user_id = idToken.claims.user_id;
          this.getDocument(user_id + '/character_collection/' + saveConfig.player.collection).then((result: interfaces.PlayerCollection) => {
            result[key] = character[key];
            this.variableSave(this.db, user_id, key, result[key], saveConfig.player.collection);
          });
        }
      });
    })
  }

  variableSave(db: AngularFirestore, user_id, key, result, collection: string) {
    switch (key) {
      case "spells_prepared":
        console.log("saving: spells_prepared")
        db.collection("player_collection").doc(user_id).collection("character_collection").doc(collection).set({ spells_prepared: result }, { merge: true })
        break;
      case "status":
        console.log("saving: status")
        db.collection("player_collection").doc(user_id).collection("character_collection").doc(collection).set({ status: result }, { merge: true })
        break;

      default:
        break;
    }
  }


  isUnique(elementRef, arrayRef) {
    // if database-map isn't intialised it must be unique
    if (!arrayRef) {
      return true;
    }
    var unique = true;
    arrayRef.forEach(element => {
      if (element === elementRef) {
        unique = false;
      }
    });
    console.log(arrayRef);
    console.log('isUnique: ' + unique)
    return unique
  }

  async getDocument(docId: string) {
    let document = await this.db.collection("player_collection").doc(docId).get().toPromise();
    return document.data();
  }

  longRest() {
    ///TODO
  }

  shortRest() {
    ///TODO
  }

}
