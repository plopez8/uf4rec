import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JocComponent } from './projecte/components/joc/joc.component';

const routes: Routes = [
  {
    path: '',
    component: JocComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
