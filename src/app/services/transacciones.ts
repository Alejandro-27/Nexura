import { inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {
  // Inyección moderna de dependencias
  private authService = inject(AuthService);
  
  // Reutilizar la instancia original de Supabase del AuthService
  private supabase: SupabaseClient = this.authService.supabase;

  constructor() {}

  async crearTransaccion(transaccion: any) {
    const { data, error } = await this.supabase
      .from('transacciones')
      .insert([transaccion])
      .select();
  
    if (error) throw error;
    return data;
  }
  
  // leer las transacciones del usuario autenticado
  async getTransacciones() {
    const userId = this.authService.usuarioActual?.id;
    if (!userId) throw new Error('Usuario no autenticado en Nexura');

    const { data, error } = await this.supabase
      .from('transacciones')
      .select(`
        id,
        monto,
        tipo,
        descripcion,
        fecha
      `)
      .eq('usuario_id', userId); // Filtrar para que solo traiga lo del usuario logueado

    if (error) throw error;
    return data;
  }
}