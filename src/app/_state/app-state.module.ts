import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { llamaReducer } from './llamas/llamas.reducer';
import { EffectsModule } from '@ngrx/effects';
import { LlamasEffects } from './llamas/llamas.effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(
      {
        router: routerReducer,
        llamas: llamaReducer,
      },
      {},
    ),
    EffectsModule.forRoot([LlamasEffects]),
    StoreRouterConnectingModule.forRoot(),
  ],
})
export class AppStateModule {}
