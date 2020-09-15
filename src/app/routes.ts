import { Routes } from '@angular/router';
import { CharacterSheetScreenComponent } from './character-sheet-screen/character-sheet-screen.component';
import { SpellScreenComponent } from './spell-screen/spell-screen.component';
import { LoginComponent } from './login-component/login.component';
import { RegisterComponent } from './register/register.component';
import { UserResolver } from './user/user.resolver';
import { AuthGuard } from './core/authentication.guard';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { HomeResolver } from './home/home.resolver';

export const routeConfig: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, resolve: { data: UserResolver } },
    { path: 'home', component: HomeComponent, resolve: { data: HomeResolver } }
];