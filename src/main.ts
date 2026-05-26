import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// importar  la utilidad y los iconos que usa TODA la app
import { addIcons } from 'ionicons';
import { 
  pieChartOutline, briefcaseOutline, serverOutline,
  notificationsOutline, arrowUpCircleOutline, arrowDownCircleOutline, 
  addOutline, removeOutline, fastFoodOutline 
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// registrar el diccionario completo de iconos globalmente aquí
addIcons({
  'pie-chart-outline': pieChartOutline,
  'briefcase-outline': briefcaseOutline,
  'server-outline': serverOutline,
  'notifications-outline': notificationsOutline,
  'arrow-up-circle-outline': arrowUpCircleOutline,
  'arrow-down-circle-outline': arrowDownCircleOutline,
  'add-outline': addOutline,
  'remove-outline': removeOutline,
  'fast-food-outline': fastFoodOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});