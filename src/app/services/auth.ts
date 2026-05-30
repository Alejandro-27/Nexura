import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public supabase: SupabaseClient;
  private _usuarioActual = new BehaviorSubject<User | null>(null); 
  
  // Exponer el observable para que el componente se suscriba
  public usuarioActual$ = this._usuarioActual.asObservable();

  constructor() {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
        auth: {
          storage: globalThis.localStorage,
          autoRefreshToken: true,
          persistSession: true,

          ...({
            getLock: async () => {
              return () => {};
            }
          } as any)
        }
      });
  
      // Leer la sesión inmediatamente al arrancar el servicio
      this.sincronizarSesionInicial();
  
      // Escuchar cambios de estado en tiempo real
      this.supabase.auth.onAuthStateChange((event, session) => {
        console.log('Cambio de estado Auth Supabase:', event);
        this._usuarioActual.next(session?.user ?? null);
      });
  }
  
  private async sincronizarSesionInicial() {
    const session = await this.getSesionActual();
    if (session?.user) {
      this._usuarioActual.next(session.user);
    }
  }

  // Obtener el valor instantáneo actual
  get usuarioActual(): User | null {
    return this._usuarioActual.getValue();
  }

  async getSesionActual() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) throw error;
      if (session?.user) {
        this._usuarioActual.next(session.user);
      }
      return session;
    } catch (error) {
      console.error('Error al recuperar la sesión de Supabase:', error);
      this._usuarioActual.next(null);
      return null;
    }
  }

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
    this._usuarioActual.next(null);
  }
}