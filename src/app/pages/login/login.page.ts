import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
} from "@ionic/angular/standalone";
import { AuthService } from "../../services/auth";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
    IonText,
  ],
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  public email: string = "";
  public contrasena: string = "";
  public cargando: boolean = false;
  public errorMensaje: string = "";

  async clickLogin() {
    if (!this.email || !this.contrasena) {
      this.errorMensaje = "Por favor, rellena todos los campos.";
      return;
    }

    try {
      this.cargando = true;
      this.errorMensaje = "";

      // Llamada real a Supabase
      await this.authService.iniciarSesion(this.email, this.contrasena);

      // Login exitoso -> Redireccionamiento al Dashboard principal reemplazando la ruta
      this.router.navigate(["/tabs/tab1"], { replaceUrl: true });
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      this.errorMensaje = error.message || "Credenciales incorrectas.";
    } finally {
      this.cargando = false;
    }
  }
}
