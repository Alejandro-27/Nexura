import { Component, OnInit, inject, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonLabel,
  IonList,
  IonItem,
  IonNote,
  IonSpinner,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  addCircleOutline,
  removeCircleOutline,
  arrowUpCircle,
  arrowDownCircle,
} from "ionicons/icons";
import { AuthService } from "../services/auth";
import { TransaccionesService } from "../services/transacciones";

interface TransaccionForm {
  monto: number | null;
  tipo: "ingreso" | "gasto";
  descripcion: string;
  fecha: Date;
  usuario_id: string | null;
}

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardContent,
    IonLabel,
    IonList,
    IonItem,
    IonNote,
    IonSpinner,
    IonModal,
    IonInput,
    IonSelect,
    IonSelectOption,
  ],
})
export class Tab1Page implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private transaccionesService = inject(TransaccionesService);
  private authSubscription!: Subscription; 

  public listaTransacciones: any[] = [];
  public cargando: boolean = true;
  public balanceTotal: number = 0;
  public totalIngresos: number = 0;
  public totalGastos: number = 0;
  public mostrarModal: boolean = false;
  public idUsuarioActual: string = "";

  public nuevaTransaccion: TransaccionForm = {
    monto: null,
    tipo: "gasto",
    descripcion: "",
    fecha: new Date(),
    usuario_id: null,
  };

  constructor() {
    addIcons({
      addCircleOutline,
      removeCircleOutline,
      arrowUpCircle,
      arrowDownCircle,
    });
  }

  ngOnInit() {
    // Escuchar el canal de autenticación de forma reactiva
    this.authSubscription = this.authService.usuarioActual$.subscribe(
      async (user) => {
        if (user) {
          this.idUsuarioActual = user.id;
          this.nuevaTransaccion.usuario_id = user.id;
        } else {
          // MODO CONTINGENCIA: Si no hay login real, preparamos el entorno de desarrollo
          console.warn(
            "Nexura ejecutándose en modo desarrollo (Sin sesión activa).",
          );
          this.idUsuarioActual = "00000000-0000-0000-0000-000000000000";
          this.nuevaTransaccion.usuario_id = this.idUsuarioActual;
        }

        // Se ejecutan los datos pase lo que pase
        await this.cargarDatos();
      },
    );
  }

  ngOnDestroy() {
    // Limpieza de hilos al salir de la página
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async cargarDatos() {
    try {
      this.cargando = true;
      this.listaTransacciones =
        await this.transaccionesService.getTransacciones();
      this.calcularTotales();
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      this.cargando = false;
    }
  }

  abrirModalNuevaTransaccion(tipo: "ingreso" | "gasto") {
    this.nuevaTransaccion = {
      monto: null,
      tipo: tipo,
      descripcion: "",
      fecha: new Date(),
      usuario_id: this.idUsuarioActual, // Aquí ya estará cargado gracias al BehaviorSubject
    };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  async guardarTransaccion() {
    if (!this.nuevaTransaccion.monto || this.nuevaTransaccion.monto <= 0) {
      console.warn("El monto no es válido.");
      return;
    }

    // Intentamos obtener el ID real
    let idUsuarioSeguro =
      this.idUsuarioActual || this.authService.usuarioActual?.id;

    // MODO CONTINGENCIA: Si está en desarrollo y no hay sesión, inyectamos un ID mock
    if (!idUsuarioSeguro) {
      console.warn(
        "¡Aviso! No se detectó sesión real de Supabase. Usando ID de pruebas para desarrollo.",
      );
      idUsuarioSeguro = "00000000-0000-0000-0000-000000000000"; // Cambio por un ID real de tu DB si usas RLS estricto

      // Descomentar la línea de abajo para producción:
      // console.error("Error local crítico: El ID del usuario sigue sin resolverse."); return;
    }

    try {
      this.mostrarModal = false;
      this.cargando = true;

      const payload = {
        monto: Number(this.nuevaTransaccion.monto),
        tipo: this.nuevaTransaccion.tipo,
        descripcion: this.nuevaTransaccion.descripcion.trim(),
        usuario_id: idUsuarioSeguro,
        fecha: new Date().toISOString(),
      };

      setTimeout(async () => {
        try {
          await this.transaccionesService.crearTransaccion(payload);
          await this.cargarDatos();
        } catch (error) {
          console.error("Error definitivo al guardar en el servidor:", error);
        } finally {
          this.cargando = false;
        }
      }, 60);
    } catch (error) {
      console.error("Error en el flujo de guardado:", error);
      this.cargando = false;
    }
  }
  private calcularTotales() {
    this.totalIngresos = 0;
    this.totalGastos = 0;

    this.listaTransacciones.forEach((t) => {
      const monto = Number(t.monto) || 0;
      if (t.tipo === "ingreso") {
        this.totalIngresos += monto;
      } else if (t.tipo === "gasto") {
        this.totalGastos += monto;
      }
    });

    this.balanceTotal = this.totalIngresos - this.totalGastos;
  }
}
