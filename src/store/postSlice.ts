import { firestore } from '@/firebase/clientApp';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  collection,
  FieldValue,
  FirestoreError,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';

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
  communityImageURL?: string;
  createdAt: Timestamp;
}

interface PostState {
  selectedPost: IPost | null;
  posts: IPost[];
  error: string | null;
  isLoading: boolean;
  // postVotes
}

const initialState: PostState = {
  selectedPost: null,
  posts: [],
  error: null,
  isLoading: false,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    selectPost: (state, action: PayloadAction<IPost>) => {
      state.selectedPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    }),
      builder.addCase(getAllPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.isLoading = false;
      }),
      builder.addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error;
        }
      });
  },
});

export const { selectPost } = postSlice.actions;

export default postSlice.reducer;

export const getAllPosts = createAsyncThunk<
  IPost[],
  { communityId: string },
  { rejectValue: string; serializedErrorType: string }
>('post/getAllPosts', async ({ communityId }, thunkAPI) => {
  try {
    const postsQuery = query(
      collection(firestore, 'posts'),
      where('communityId', '==', communityId),
      orderBy('createdAt', 'desc')
    );
    const postDocs = await getDocs(postsQuery);
    const posts = postDocs.docs.map((doc) =>
      JSON.parse(JSON.stringify({ id: doc.id, ...doc.data() }))
    );
    // console.log(posts);
    return posts;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(`${err.name}: ${err.message}}`);
    }
    if (err instanceof FirestoreError) {
      return thunkAPI.rejectWithValue(`${err.name}: ${err.message}`);
    }
    return thunkAPI.rejectWithValue(`Unexpected Error: ${err}`);
  }
});
