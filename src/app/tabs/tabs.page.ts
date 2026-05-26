import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pieChartOutline, briefcaseOutline, serverOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  constructor() {
    // Registramos los iconos que usa la barra de navegación de pestañas
    addIcons({ 
      'pie-chart-outline': pieChartOutline, 
      'briefcase-outline': briefcaseOutline, 
      'server-outline': serverOutline 
    });
  }
}