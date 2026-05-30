import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonProgressBar,
  IonSpinner
} from "@ionic/angular/standalone";
import { TransaccionesService } from "../services/transacciones";
import { AuthService } from "../services/auth";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonProgressBar,
    IonSpinner
  ],
})
export class Tab2Page implements OnInit {
  private transaccionesService = inject(TransaccionesService);
  private authService = inject(AuthService);

  public cargando: boolean = true;
  public totalIngresos: number = 0;
  public totalGastos: number = 0;
  public porcentajeGastos: number = 0;

  ngOnInit() {
    // Al iniciar la pestaña, mandamos a escuchar y cargar de inmediato
    this.escucharCambiosDeAutenticacion();
  }

  async ionViewWillEnter() {
    // Cuando el usuario navegue manualmente a esta pestaña, refrescamos los análisis en caliente
    try {
      await this.cargarAnalisis();
    } catch (e) {
      console.debug("Error pasivo al recalcular vista en Tab2:", e);
    }
  }

  private escucharCambiosDeAutenticacion() {
    this.cargando = true;
    
    // El setTimeout le da un respiro al ciclo de vida de Angular para renderizar el esqueleto inicial
    setTimeout(async () => {
      try {
        // Ejecutamos el análisis directamente. Nuestro servicio ya sabe cómo resolver el ID de desarrollo.
        await this.cargarAnalisis();
      } catch (error) {
        console.error("Error al inicializar datos en Tab2:", error);
        this.cargando = false;
      }
    }, 50);
  }

  async cargarAnalisis() {
    try {
      this.cargando = true;
      const transacciones = await this.transaccionesService.getTransacciones();
      
      this.totalIngresos = 0;
      this.totalGastos = 0;

      if (transacciones && transacciones.length > 0) {
        transacciones.forEach((t) => {
          const monto = Number(t.monto) || 0;
          if (t.tipo === "ingreso") {
            this.totalIngresos += monto;
          } else if (t.tipo === "gasto") {
            this.totalGastos += monto;
          }
        });
      }

      // Evitar divisiones por cero o desbordamientos en la barra de progreso
      if (this.totalIngresos > 0) {
        this.porcentajeGastos = Math.min(this.totalGastos / this.totalIngresos, 1);
      } else {
        this.porcentajeGastos = this.totalGastos > 0 ? 1 : 0;
      }

    } catch (error) {
      console.error("Error al procesar el análisis de transacciones:", error);
    } finally {
      this.cargando = false;
    }
  }
}