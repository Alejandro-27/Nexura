import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton,
  IonButtons,
  IonLabel,
  IonList,
  IonItem,
  IonNote,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  notificationsOutline,
  arrowUpCircleOutline,
  arrowDownCircleOutline,
  addOutline,
  removeOutline,
  pieChartOutline,
  walletOutline,
  fastFoodOutline,
  serverOutline,
  briefcaseOutline, 
} from "ionicons/icons";
import { AuthService } from "../services/auth";
import { TransaccionesService } from "../services/transacciones";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton,
    IonButtons,
    IonLabel,
    IonList,
    IonItem,
    IonNote,
  ],
})
export class Tab1Page implements OnInit {
  private authService = inject(AuthService);
  private transaccionesService = inject(TransaccionesService);

  transacciones: any[] = [];
  balanceTotal = 0;
  totalIngresos = 0;
  totalGastos = 0;

  constructor() {
    addIcons({
      notificationsOutline,
      arrowUpCircleOutline,
      arrowDownCircleOutline,
      addOutline,
      removeOutline,
      pieChartOutline,
      walletOutline,
      fastFoodOutline,
      briefcaseOutline,
      serverOutline,
    });
  }

  async ngOnInit() {
    try {
      // 1. Verificar si ya existe una sesión activa guardada por Supabase
      const sesionActiva = await this.authService.getSesionActual();

      if (!sesionActiva) {
        // Solo si no hay sesión, se intenta el inicio de sesión automático
        await this.authService.iniciarSesion("test@nexura.com", "gomez");
        console.log("Sesión nueva iniciada correctamente en Nexura");
      } else {
        console.log("Sesión existente recuperada de forma segura");
      }

      // 2. Cargar los movimientos financieros del usuario
      await this.cargarDatos();
    } catch (error) {
      console.error(
        "Error en el flujo de inicialización del Dashboard:",
        error,
      );
    }
  }

  async cargarDatos() {
    try {
      this.transacciones = await this.transaccionesService.getTransacciones();
      this.calcularTotales();
    } catch (error) {
      console.error("Error cargando transacciones de Supabase:", error);
    }
  }

  calcularTotales() {
    this.totalIngresos = this.transacciones
      .filter((t) => t.tipo === "ingreso")
      .reduce((sum, current) => sum + Number(current.monto), 0);

    this.totalGastos = this.transacciones
      .filter((t) => t.tipo === "gasto")
      .reduce((sum, current) => sum + Number(current.monto), 0);

    this.balanceTotal = this.totalIngresos - this.totalGastos;
  }
}