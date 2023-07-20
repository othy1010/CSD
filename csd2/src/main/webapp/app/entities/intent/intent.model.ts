export interface IIntent {
  id: number;
  name?: string | null;
  description?: string | null;
}

export type NewIntent = Omit<IIntent, 'id'> & { id: null };
