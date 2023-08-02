import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListCategoriesComponent} from "./components/list-categories/list-categories.component";
import {ListItemsComponent} from "./components/list-items/list-items.component";

const routes: Routes = [
  { path: 'categories', component: ListCategoriesComponent },
  { path: 'items', component: ListItemsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
