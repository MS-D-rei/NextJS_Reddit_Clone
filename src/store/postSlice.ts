import { createSlice } from "@reduxjs/toolkit";
import { FieldValue, Timestamp } from "firebase/firestore";

export interface IPost {
  id?: string;
  communityId: string;
  creatorId: string;
  createDisplayName: string;
  title: string;
  description: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL?: string;
  communityImageURL? : string;
  createAt?: Timestamp | FieldValue;
}

interface PostState {
  selectedPost: IPost | null;
  posts: IPost[];
  // postVotes
}

const initialState: PostState = {
  selectedPost: null,
  posts: []
}


export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {

  }
})

export const {} = postSlice.actions;

export default postSlice.reducer;