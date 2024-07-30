export interface ItemFeedback {
  userId: string;
  itemId: number;
  rating: number;
  feedback: string;
}

export interface DetailedFeedback {
  userId?: string;
  itemId: number;
  likes: string;
  dislikes: string;
  momsRecipe: string;
}
