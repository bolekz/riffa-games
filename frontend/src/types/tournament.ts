// src/types/tournament.ts

export interface Tournament {
  id: string;
  name: string;
  entryFeeRC: number;
  prizes: {
    item: {
      name: string;
      imageUrl: string;
    };
  }[];
}
