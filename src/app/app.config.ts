import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { QuillModule } from 'ngx-quill';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
      importProvidersFrom(
        QuillModule.forRoot(),
        
      ),provideHttpClient(), provideClientHydration(), provideAnimations()]
};
