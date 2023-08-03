import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListCategoriesComponent} from "./components/list-categories/list-categories.component";
import {ListItemsComponent} from "./components/list-items/list-items.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', component: ListCategoriesComponent },
  { path: 'items', component: ListItemsComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
