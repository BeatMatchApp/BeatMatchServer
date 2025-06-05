export interface User {
  id: string;
  email: string;
  name: string;
  birthDate: Date;
  password: string;
  country?: string;
}

export interface UpdateUserInput {
  name: string;
  email: string;
  birthDate: Date;
}
