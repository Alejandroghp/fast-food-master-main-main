// supabase.service.ts

import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import { environment } from '../environments/environment';

export interface Profile {
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get user() {
    return this.supabase.auth.user();
  }

  get session() {
    return this.supabase.auth.session();
  }

  get profile() {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', this.user?.id)
      .single();
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    return this.supabase.auth.signIn({ email });
  }

  async signInWithEmailPassword(email: string, password: string) {
    try {
      const { data: userData, error } = await this.supabase.from('usuarios')
        .select('email, password')
        .eq('email', email)
        .single();

      if (error) {
        throw new Error('Hubo un error durante el inicio de sesión. Por favor, inténtalo de nuevo.');
      }

      if (!userData) {
        throw new Error('Credenciales incorrectas. Por favor, verifica tu correo electrónico y contraseña.');
      }

      const { email: storedEmail, password: storedHashedPassword } = userData;
      const passwordMatch = await this.comparePassword(password, storedHashedPassword);

      if (!passwordMatch) {
        throw new Error('Credenciales incorrectas. Por favor, verifica tu correo electrónico y contraseña.');
      }

      // Iniciar sesión utilizando el método signIn
      const signInResult = await this.supabase.auth.signIn({ email });

      // Devolver información específica de tu aplicación
      const { user, session } = signInResult;
      return { userId: user?.id, email: user?.email, session };
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw new Error('Hubo un error durante el inicio de sesión. Por favor, inténtalo de nuevo.');
    }
  }

  async signUp(email: string, password: string, nombre: string) {
    try {
      const hashedPassword = await this.hashPassword(password);

      const signUpResult = await this.supabase.auth.signUp({ email, password: hashedPassword });

      const userData = { email, nombre };
      const { data, error } = await this.supabase.from('usuarios').upsert([userData]);
      if (error) {
        if (error.code === '23505') {
          throw new Error('El correo electrónico ya está registrado. Por favor, utiliza otro.');
        } else {
          throw new Error('Hubo un error durante el registro. Por favor, inténtalo de nuevo.');
        }
      }

      // Devolver información específica de tu aplicación
      const { user, session } = signUpResult;
      return { userId: user?.id, email: user?.email, session };
    } catch (error) {
      console.error('Error en el registro:', error);
      throw new Error('Hubo un error durante el registro. Por favor, inténtalo de nuevo.');
    }
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      id: this.user?.id,
      updated_at: new Date(),
    };

    return this.supabase.from('profiles').upsert(update, {
      returning: 'minimal', // Don't return the value after inserting
    });
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }

  async createNotice(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 5000 });
    await toast.present();
  }

  createLoader() {
    return this.loadingCtrl.create();
  }

  insertRestaurant(restaurant: any) {
    return this.supabase.from('restaurantes').upsert([restaurant]);
  }

  async deleteRestaurantByName(restaurantName: string) {
    try {
      const { data, error } = await this.supabase.from('restaurantes')
        .delete()
        .eq('nombre', restaurantName);
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async insertUsuario(email: string, password: string, nombre: string) {
    try {
      const hashedPassword = await this.hashPassword(password);
      const userData = { email, password: hashedPassword, nombre };

      const { data, error } = await this.supabase.from('usuarios').upsert([userData]);
      if (error) {
        if (error.code === '23505') {
          throw new Error('El correo electrónico ya está registrado. Por favor, utiliza otro.');
        } else {
          throw new Error('Hubo un error al insertar el usuario. Por favor, inténtalo de nuevo.');
        }
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}