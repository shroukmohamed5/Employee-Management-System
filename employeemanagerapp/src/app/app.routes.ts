import { Routes } from '@angular/router';
import { App } from './app';
import { LoginComponent } from '../login.component';

export const routes: Routes = [
  { path: '', component: App },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' }
];