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
  //IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
} from "@ionic/angular/standalone";
import { AuthService } from "../../services/auth";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
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
    //IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
    IonText,
  ],
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  public email: string = "";
  public contrasena: string = "";
  public confirmarContrasena: string = "";
  public cargando: boolean = false;
  public errorMensaje: string = "";

  async clickRegistrar() {
    if (!this.email || !this.contrasena || !this.confirmarContrasena) {
      this.errorMensaje = "Por favor, rellena todos los campos.";
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      this.errorMensaje = "Las contraseñas no coinciden.";
      return;
    }

    try {
      this.cargando = true;
      this.errorMensaje = "";

      // Crear el usuario en Supabase
      //await this.authService.registrar(this.email, this.contrasena);
      await this.authService.registrar(this.email.trim(), this.contrasena.trim());

      // Una vez registrado, Supabase inicia sesión automáticamente. Redirige a la app.
      this.router.navigate(["/tabs/tab1"], { replaceUrl: true });
    } catch (error: any) {
      console.error("Error en el registro:", error);
      this.errorMensaje = error.message || "No se pudo crear la cuenta.";
    } finally {
      this.cargando = false;
    }
  }
}
