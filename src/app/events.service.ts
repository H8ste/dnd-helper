import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { AuthenticationService } from './core/authentication.service';
import * as interfaces from './home/player_collection'
import { SaveConfig } from './home/save_config';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(public authService: AuthenticationService, private db: AngularFirestore,) { }

  spellSlotsUsed = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  scholarPointsUsed = 0;

  PlayerCollection: interfaces.PlayerCollection;

  AvailableCharacters: interfaces.PlayerCollection[];

  shortRest() {
    // this.scholarPointsUsed = 0;

  }

  longRest() {
    this.spellSlotsUsed = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.scholarPointsUsed = 0;
    this.PlayerCollection.status.current_hitpoints = this.PlayerCollection.status.max_hitpoints;
    this.PlayerCollection.status.temp_hitpoints = 0;

    this.savePlayerCollection({ player: this.PlayerCollection, keyOfField: ["status"] });
  }

  addNewSpell() {
    
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

  async getDocument(docId: string) {
    let document = await this.db.collection("player_collection").doc(docId).get().toPromise();
    return document.data();
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
}
