import { GrantedAuthority } from './JwtPayload';

interface User {
  uid: string;
  name?: string;
  mail?: string;
  password?: string;
  authorities?: GrantedAuthority[];
}

interface UserLogin {
  name: string;
  password: string;
}

interface UserRegister {
  name: string;
  mail: string;
  password: string;
}

interface UserUpdate {
  name?: string;
  mail?: string;
  password?: string;
  authorities?: GrantedAuthority[];
}

export type { User, GrantedAuthority, UserLogin, UserRegister, UserUpdate };
