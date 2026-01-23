export type UserStatus = 'active' | 'inactive';
export type UserGender = 'male' | 'female';

export interface User {
  id: number;
  name: string;
  email: string;
  gender?: UserGender;
  status?: UserStatus;
}
