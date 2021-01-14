import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from "@angular/router";

import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AuthenticationService } from './core/authentication.service';
import { UserService } from './core/user.service';
import { UserResolver } from './user/user.resolver';
import { AuthGuard } from './core/authentication.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeResolver } from './home/home.resolver';



import { AsModifierPipe } from './ability-modifier/ability-modifer.pipe'
import { LevelAsProficiencybonus } from './character-sheet-screen/level-as-proficiencybonus.pipe';
import { PlusIfNotNegative } from './character-sheet-screen/plus-of-not-negative.pipe';

import { AppComponent } from './app.component';
import { CharacterSheetScreenComponent } from './character-sheet-screen/character-sheet-screen.component';
import { SpellScreenComponent } from './spell-screen/spell-screen.component';
import { LoginComponent } from './login-component/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { AbilityModifierComponent } from './ability-modifier/ability-modifier.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpellComponent } from './spell/spell.component';
import { DialogHitpointsComponent } from './dialog-hitpoints/dialog-hitpoints.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';

import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CharacterSelectorScreenComponent } from './character-selector-screen/character-selector-screen.component'


var firebaseConfig = {
  apiKey: "AIzaSyCaZGpdXSOsQJZnddTUHtG5jOaLVx8edaA",
  authDomain: "dnd-helper-3370c.firebaseapp.com",
  databaseURL: "https://dnd-helper-3370c.firebaseio.com",
  projectId: "dnd-helper-3370c",
  storageBucket: "dnd-helper-3370c.appspot.com",
  messagingSenderId: "420008892561",
  appId: "1:420008892561:web:dba2df54b1ec494bc18730",
  measurementId: "G-33N3ZT64WM"
};


@NgModule({
  declarations: [
    AppComponent,
    CharacterSheetScreenComponent,
    SpellScreenComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    HomeComponent,
    NavbarComponent,
    AbilityModifierComponent,
    AsModifierPipe,
    LevelAsProficiencybonus,
    PlusIfNotNegative,
    SpellComponent,
    DialogHitpointsComponent,
    CharacterSelectorScreenComponent,
  ],
  entryComponents: [DialogHitpointsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatIconModule,
    FontAwesomeModule,
    MatTabsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  providers: [AuthenticationService, UserService, UserResolver, HomeResolver, AuthGuard, AsModifierPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
