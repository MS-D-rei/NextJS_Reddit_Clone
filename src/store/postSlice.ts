import { firestore, storage } from '@/firebase/clientApp';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  collection,
  deleteDoc,
  doc,
  FieldValue,
  FirestoreError,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

export interface IPost {
  id?: string; // firestore auto-generated ID
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

export interface IPostVote {
  id: string; // firestore auto-generated ID
  postId: string;
  communityId: string;
  voteNumber: number;
}

interface PostState {
  selectedPost: IPost | null;
  posts: IPost[];
  error: string | null;
  isLoading: boolean;
  postVotes: IPostVote[];
}

const initialState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
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
    setPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
    },
    setPostVotes: (state, action: PayloadAction<IPostVote[]>) => {
      state.postVotes = action.payload
    }
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
    builder.addCase(deletePost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    }),
      builder.addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      }),
      builder.addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error;
        }
      });
  },
});

export const { selectPost, setPosts, setPostVotes } = postSlice.actions;

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
    return posts as IPost[];
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

export const deletePost = createAsyncThunk<
  string,
  { post: IPost },
  { rejectValue: string; serializedErrorType: string }
>('post/deletePost', async ({ post }, thunkAPI) => {
  try {
    // if the post has an image, delete it first
    if (post.imageURL) {
      const imageRef = ref(storage, `posts/${post.id!}/image`);
      await deleteObject(imageRef);
    }

    // delete the post document
    await deleteDoc(doc(firestore, 'posts', post.id!));

    return post.id!;
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
