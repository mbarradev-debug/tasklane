// Forma de la respuesta de GET /users/by-email en auth-service.
export interface UserSummary {
  id: string;
  email: string;
  name: string;
}
