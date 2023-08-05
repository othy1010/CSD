export interface IApplication {
  id: number;
  name?: string | null;
  description?: string | null;
}

export type NewApplication = Omit<IApplication, 'id'> & { id: null };
