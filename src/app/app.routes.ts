import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import { HelptextComponent } from './components/helptext/helptext.component';

export const routes: Routes = [
    {path:'helpadmin',component:HelptextComponent},
    {path:'home',component:HomeComponent},
    {path: 'login', component: LoginComponent},
    {path:'',redirectTo:'/home',pathMatch:'full'}
];
