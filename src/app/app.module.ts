import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { FrontComponent } from './front/front.component';
import { AppStateModule } from './_state/app-state.module';
import { LlamaPageComponent } from './llama-page/llama-page.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES),
    AppStateModule,
  ],
  declarations: [AppComponent, FrontComponent, LlamaPageComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
