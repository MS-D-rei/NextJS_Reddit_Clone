import { Timestamp } from 'firebase/firestore';

export interface ICommunity {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: 'public' | 'restricted' | 'private';
  createAt?: Timestamp;
  imageURL?: string;
}

