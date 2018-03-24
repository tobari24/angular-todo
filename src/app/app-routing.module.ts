import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { LoginComponent } from './users/login/login.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {path: '', component: TodoComponent, canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
