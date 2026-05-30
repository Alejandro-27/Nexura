import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonAvatar,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { logOutOutline, personOutline, mailOutline } from "ionicons/icons";
import { AuthService } from "../services/auth";
import { Router } from "@angular/router";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonAvatar,
  ],
})
export class Tab3Page implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  public emailUsuario: string = "";

  constructor() {
    addIcons({ logOutOutline, personOutline, mailOutline });
  }

  async ngOnInit() {
    const sesion = await this.authService.getSesionActual();
    if (sesion && sesion.user) {
      this.emailUsuario = sesion.user.email || "Usuario sin correo";
    } else {
      // Texto informativo para desarrollo local
      this.emailUsuario = "modo.desarrollo@nexura.local";
    }
  }

  async cerrarSesion() {
    try {
      await this.authService.cerrarSesion();
      console.log("Sesión destruida en Supabase.");

      // Solo redirige si ya exite la ruta de login en app.routes.ts
      // this.router.navigate(["/login"], { replaceUrl: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
}
