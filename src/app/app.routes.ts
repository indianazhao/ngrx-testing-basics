import { Routes } from '@angular/router';
import { FrontComponent } from './front/front.component';
import { appRoutesNames } from './app.routes.names';
import { LlamaPageComponent } from './llama-page/llama-page.component';

export const APP_ROUTES: Routes = [
  { path: '', component: FrontComponent },
  {
    path: `${appRoutesNames.LLAMA_PAGE}/:${appRoutesNames.LLAMA_ID_PARAM}`,
    component: LlamaPageComponent,
  },
];
