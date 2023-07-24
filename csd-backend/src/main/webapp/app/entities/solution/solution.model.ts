export interface ISolution {
  id: number;
  name?: string | null;
  description?: string | null;
}

export type NewSolution = Omit<ISolution, 'id'> & { id: null };
