import { inject, Injectable } from "@angular/core";
import { SupabaseClient } from "@supabase/supabase-js";
import { AuthService } from "./auth";

@Injectable({
  providedIn: "root",
})
export class TransaccionesService {
  private authService = inject(AuthService);
  private supabase: SupabaseClient = this.authService.supabase;

  // ID global de contingencia para desarrollo local
  private readonly ID_DESARROLLO = "00000000-0000-0000-0000-000000000000";

  constructor() {}

  async crearTransaccion(transaccion: any) {
    // Buscamos un ID (del payload, del servicio o de la sesión)
    let userId = transaccion.usuario_id || this.authService.usuarioActual?.id;

    if (!userId) {
      const session = await this.authService.getSesionActual();
      userId = session?.user?.id;
    }

    // Si sigue siendo null, asignamos el ID fallback de desarrollo
    if (!userId) {
      userId = this.ID_DESARROLLO;
    }

    const payload = {
      ...transaccion,
      usuario_id: userId,
    };

    const { data, error } = await this.supabase
      .from("transacciones")
      .insert([payload])
      .select();

    if (error) throw error;
    return data;
  }

  async getTransacciones() {
    let userId = this.authService.usuarioActual?.id;

    if (!userId) {
      const session = await this.authService.getSesionActual();
      userId = session?.user?.id;
    }

    // Si no hay sesión, buscamos las transacciones asociadas al ID de pruebas
    if (!userId) {
      userId = this.ID_DESARROLLO;
    }

    const { data, error } = await this.supabase
      .from("transacciones")
      .select(
        `
        id,
        monto,
        tipo,
        descripcion,
        fecha
      `,
      )
      .eq("usuario_id", userId)
      .order("fecha", { ascending: false });

    if (error) throw error;
    return data;
  }
}
