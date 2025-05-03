export interface User {
  id: string;
  email: string;
  name: string;
  birthDate: Date;
  password: string;
  country?: string;
  refreshTokens?: string[];
}
