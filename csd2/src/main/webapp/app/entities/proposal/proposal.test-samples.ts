import dayjs from 'dayjs/esm';

import { ProposalState } from 'app/entities/enumerations/proposal-state.model';

import { IProposal, NewProposal } from './proposal.model';

export const sampleWithRequiredData: IProposal = {
  id: 69613,
};

export const sampleWithPartialData: IProposal = {
  id: 32144,
  name: 'zero online Oregon',
  creationDate: dayjs('2023-06-13'),
  proposalState: ProposalState['REJECTED'],
};

export const sampleWithFullData: IProposal = {
  id: 7535,
  name: 'dot-com Rustic',
  description: 'Salad Denar Card',
  creationDate: dayjs('2023-06-13'),
  proposalState: ProposalState['ACCEPTED'],
};

export const sampleWithNewData: NewProposal = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
