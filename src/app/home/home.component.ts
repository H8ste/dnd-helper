import { Component, OnInit, DebugElement } from '@angular/core';
import { UserService } from '../core/user.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import { AuthenticationService } from '../core/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import spells from '../../assets/spells.json'

import * as interfaces from './player_collection'

import * as table from './../character-sheet-screen/spell-table'

import { SaveConfig } from './save_config'
import { EventsService } from '../events.service';

@Component({
  selector: 'page-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;

  screenID = 0;



  private AllSpells: Array<Array<interfaces.Spell>>;

  characterRelevantSpells;

  wizardTable;

  constructor(
    public userService: UserService,
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private db: AngularFirestore,
    private events: EventsService
  ) {
    console.debug("home constructor called")

    this.wizardTable = table.table;

  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
        // this.makeNav(this.user.name);
      }
    })

    this.getDataForUser();





  }

  initialiseSpellSlots() {

  }

  loadKnownSpells: boolean = true;

  //database-call go brrr
  getDataForUser() {
    //gets userID from auth
    var idTokenResult = this.authService.angularFireAuth.idTokenResult.pipe(
      take(1)
    )

    //uses userID to fetch player
    idTokenResult.subscribe(idToken => {
      if (idToken) {
        var user_id = idToken.claims.user_id;
        var responseFromDatabase = this.db.collection(
          "player_collection").doc(user_id).valueChanges();

        responseFromDatabase.subscribe((result: interfaces.PlayerCollection) => {
          if (result) {
            //player was found
            this.events.PlayerCollection = result;
            // this.resultFromDatabase = result;
            console.debug("recieved results:")
            console.debug(this.events.PlayerCollection);

            this.AllSpells = new Array<Array<interfaces.Spell>>();
            for (let index = 0; index <= 9; index++) {
              var temp = new Array<interfaces.Spell>();
              this.AllSpells.push(temp)
            }

            if (this.loadKnownSpells) {

              for (let key in result.spellbook) {
                var convertedKey = key === "cantrips" ? 0 : +key;
                var spells = result.spellbook[key];
                spells.forEach(spell => {
                  console.log(convertedKey);
                  this.AllSpells[convertedKey].push(spell);
                });

                // Use `key` and `value`
              }

            } else {
              // initialise list with list containing 9 empty list


              var index = 0;
              spells.forEach((spell) => {
                var obj = spell as interfaces.Spell;
                var level = obj.level === "cantrip" ? 0 : (+obj.level);

                if (obj["classes"].some(this.isWizardClass) && level <= this.getMaxAvailableSpellLevel(result.level)) {
                  if (!this.AllSpells[level]) {
                    this.AllSpells[level] = new Array<interfaces.Spell>(spell)
                  } else {
                    this.AllSpells[level].push(spell);
                  }

                  //iterate over saved spells, and only 
                }
                index++
              })

            }



            console.debug(this.AllSpells);



          } else {
            //player was not found -> create new player
            console.debug("creating new character sheet")
          }
          this.initialiseSpellSlots();
        })
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

  // makeNav(name) {
  //   this.profileForm = this.fb.group({
  //     name: [name, Validators.required]
  //   });
  // }

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

  saveSpell(spellToSave: interfaces.Spell) {
    //refetch user id
    var idTokenResult = this.authService.angularFireAuth.idTokenResult.pipe(
      take(1)
    );

    idTokenResult.subscribe(idToken => {
      if (idToken) {
        var user_id = idToken.claims.user_id;
        this.getDocument(user_id).then((result: interfaces.PlayerCollection) => {
          console.debug(result);
          const levelIndex: string = spellToSave.level === "cantrip" ? "cantrips" : spellToSave.level
          if (this.isUnique(spellToSave.name, result.spellbook[levelIndex].map((elm) => {
            return elm.name
          }))) {
            console.log("unique");
            result.spellbook[levelIndex].push(spellToSave);
            this.db.collection("player_collection").doc(user_id).set({ spellbook: result.spellbook }, { merge: true })

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
          this.getDocument(user_id).then((result: interfaces.PlayerCollection) => {
            result[key] = character[key];
            this.variableSave(this.db, user_id, key, result[key]);


          });
        }
      });
    })
  }

  variableSave(db, user_id, key, result) {
    switch (key) {
      case "spells_prepared":
        console.log("saving: spells_prepared")
        db.collection("player_collection").doc(user_id).set({ spells_prepared: result }, { merge: true })
        break;
      case "status":
        console.log("saving: status")
        db.collection("player_collection").doc(user_id).set({ status: result }, { merge: true })
        break;

      default:
        break;
    }
  }

  saveCharacter(characterToSave: interfaces.PlayerCollection) {
    var idTokenResult = this.authService.angularFireAuth.idTokenResult.pipe(
      take(1)
    );

    idTokenResult.subscribe(idToken => {
      console.debug("saving character" + characterToSave.status);
      if (idToken) {
        var user_id = idToken.claims.user_id;
        this.getDocument(user_id).then((result: interfaces.PlayerCollection) => {
          result.status = characterToSave.status;
          this.db.collection("player_collection").doc(user_id).set({ status: result.status }, { merge: true })
        });
      }
    })
  }

  isUnique(elementRef, arrayRef) {
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

  }

  shortRest() {

  }

}
