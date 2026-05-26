import { Component, OnInit, inject } from "@angular/core";
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
export class Tab1Page implements OnInit {
  private authService = inject(AuthService);
  private transaccionesService = inject(TransaccionesService);

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

  async ngOnInit() {
    const sesion = await this.authService.getSesionActual();
    if (sesion) {
      this.idUsuarioActual = sesion.user.id;
      this.nuevaTransaccion.usuario_id = sesion.user.id;
      await this.cargarDatos();
    } else {
      this.cargando = false;
    }
  }

  async cargarDatos() {
    try {
      this.cargando = true;
      this.listaTransacciones = await this.transaccionesService.getTransacciones();
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
      usuario_id: this.idUsuarioActual,
    };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  async guardarTransaccion() {
    try {
      this.cargando = true;
      this.mostrarModal = false;

      const payload = {
        monto: Number(this.nuevaTransaccion.monto),
        tipo: this.nuevaTransaccion.tipo,
        descripcion: this.nuevaTransaccion.descripcion,
        usuario_id: this.nuevaTransaccion.usuario_id,
        fecha: new Date().toISOString(),
      };

      await this.transaccionesService.crearTransaccion(payload);
      await this.cargarDatos();
    } catch (error) {
      console.error("Error definitivo al guardar:", error);
    } finally {
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