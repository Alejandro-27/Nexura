import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public supabase: SupabaseClient;
  private _usuarioActual: User | null = null;

  constructor() {
    // Inicialización limpia con almacenamiento global seguro
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        storage: globalThis.localStorage,
        autoRefreshToken: true,
        persistSession: true
      }
    });

    // Escuchar cambios en el estado de la sesión
    this.supabase.auth.onAuthStateChange((event, session) => {
      this._usuarioActual = session?.user ?? null;
    });
  }

  // Obtener el usuario almacenado en memoria
  get usuarioActual(): User | null {
    return this._usuarioActual;
  }

  // Verificar de forma asíncrona y segura la sesión real en Supabase
  async getSesionActual() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) throw error;
      
      this._usuarioActual = session?.user ?? null;
      return session;
    } catch (error) {
      console.error('Error al recuperar la sesión de Supabase:', error);
      this._usuarioActual = null;
      return null;
    }
  }

  // Método listo para cuando implementemos el formulario manual
  async iniciarSesion(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async cerrarSesion() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this._usuarioActual = null;
  }
}