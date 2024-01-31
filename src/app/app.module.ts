import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphViewComponent } from './graph-view/graph-view.component';
import { ColorGenService } from './services/color-gen.service';

@NgModule({
  declarations: [
    AppComponent,
    GraphViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
