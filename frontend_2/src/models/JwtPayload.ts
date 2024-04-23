import { Role } from './Role';

interface JwtPayload {
  authorities: GrantedAuthority[];
  sub: string;
  iat: number;
  exp: number;
}

interface GrantedAuthority {
  authority: Role;
}

export type { JwtPayload, GrantedAuthority };
