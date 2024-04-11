import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MintComponent } from './mint/mint.component';
import { PlotComponent } from './plot/plot.component';

const routes: Routes = [
  { path: "mint", component: MintComponent },
  { path: "plot", component: PlotComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
