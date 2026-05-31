import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Inicializar el cliente con las credenciales de environment
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Ordenar transacciones por fecha descendente
  async getTransacciones() {
    const { data, error } = await this.supabase
      .from('transacciones')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Crear nueva transaccion
  async createTransaccion(transaccion: { monto: number; descripcion: string; categoria: string; tipo: 'ingreso' | 'gasto' }) {
    const { data, error } = await this.supabase
      .from('transacciones')
      .insert([
        {
          monto: transaccion.monto,
          descripcion: transaccion.descripcion,
          categoria: transaccion.categoria,
          tipo: transaccion.tipo,
          fecha: new Date().toISOString().split('T')[0] // Guarda la fecha actual en formato YYYY-MM-DD
        }
      ])
      .select();

    if (error) throw error;
    return data;
  }

  // Eliminar transacciones
  async deleteTransaccion(id: string) {
    const { error } = await this.supabase
      .from('transacciones')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}