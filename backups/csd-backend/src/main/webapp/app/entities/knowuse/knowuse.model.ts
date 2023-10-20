export interface IKnowuse {
  id: number;
  name?: string | null;
  description?: string | null;
}

export type NewKnowuse = Omit<IKnowuse, 'id'> & { id: null };
