import { inject, Injectable } from "@angular/core";
import { SupabaseClient } from "@supabase/supabase-js";
import { AuthService } from "./auth";

@Injectable({
  providedIn: "root",
})
export class TransaccionesService {
  private authService = inject(AuthService);
  private supabase: SupabaseClient = this.authService.supabase;

  private readonly ID_DESARROLLO = "00000000-0000-0000-0000-000000000000";

  constructor() {}

  async crearTransaccion(transaccion: any) {
    let userId = transaccion.usuario_id || this.authService.usuarioActual?.id;
    if (!userId) userId = this.ID_DESARROLLO;

    const payload = { ...transaccion, usuario_id: userId };

    const { data, error } = await this.supabase
      .from("transacciones")
      .insert([payload])
      .select();

    if (error) throw error;
    return data;
  }

  async getTransacciones() {
    let userId = this.authService.usuarioActual?.id || this.ID_DESARROLLO;

    const { data, error } = await this.supabase
      .from("transacciones")
      .select(
        `
        id,
        monto,
        tipo,
        descripcion,
        categoria,
        fecha
      `,
      )
      .eq("usuario_id", userId)
      .order("fecha", { ascending: false });

    if (error) throw error;
    return data;
  }

  // Método para borrar de la base de datos
  async eliminarTransaccion(id: string) {
    const { data, error } = await this.supabase
      .from("transacciones")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return data;
  }
}
