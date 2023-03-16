import { auth, firestore, storage } from '@/firebase/clientApp';
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
  writeBatch,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAppSelector } from '@/store/hooks';
import { User } from 'firebase/auth';

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
      state.postVotes = action.payload;
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
    builder.addCase(voteToPost.pending, (state) => {
      // state.isLoading = true;
      state.error = null;
    }),
      builder.addCase(voteToPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.postVotes = action.payload.postVotes;
      }),
      builder.addCase(voteToPost.rejected, (state, action) => {
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

export const voteToPost = createAsyncThunk<
  { posts: IPost[]; postVotes: IPostVote[] },
  { userUid: string, postState: PostState, post: IPost; communityId: string; voteType: number },
  { rejectValue: string; serializedErrorType: string }
>('post/voteToPost', async ({ userUid, postState, post, communityId, voteType }, thunkAPI) => {
  // const [user] = useAuthState(auth);
  // const postState = useAppSelector((state) => state.post);

  try {
    const existingPostVote = postState.postVotes.find(
      (postVote) => postVote.postId === post.id
    );

    // 3 factors to update in this function
    let newTotalVoteStatus = post.voteStatus;
    let newPostVotes = [...postState.postVotes];
    let newPosts = [...postState.posts];

    const batch = writeBatch(firestore);

    // when has not voted yet
    if (!existingPostVote) {
      // create new postVote document to postVotes which is user's subcollection with auto-generated ID.
      const postVoteDocRef = doc(
        collection(firestore, 'users', `${userUid}/postVotes`)
      );
      const newPostVote: IPostVote = {
        id: postVoteDocRef.id,
        postId: post.id!,
        communityId,
        voteNumber: voteType,
      };
      batch.set(postVoteDocRef, newPostVote);

      // add/subtract newTotalVoteStatus
      newTotalVoteStatus += voteType;
      // add the new postVote to postState.postVotes
      newPostVotes = [...postState.postVotes, newPostVote];
    } else {
      // when has voted already

      // in case of click same vote type
      if (existingPostVote.voteNumber === voteType) {
        // delete the postVote document
        const postVoteDocRef = doc(
          firestore,
          'users',
          `${userUid}/postVotes/${existingPostVote.id}`
        );
        batch.delete(postVoteDocRef);

        // add/subtract newTotalVoteStatus
        newTotalVoteStatus -= voteType;
        // remove the postVote from postState.postVotes
        newPostVotes = newPostVotes.filter(
          (postVote) => postVote.postId !== post.id
        );
      }

      // in case of clicking opposite vote type
      if (existingPostVote.voteNumber === -voteType) {
        // update current postVote voteNumber field
        const postVoteDocRef = doc(
          firestore,
          'users',
          `${userUid}/postVotes/${existingPostVote.id}`
        );
        batch.update(postVoteDocRef, {
          voteNumber: voteType,
        });

        // add/subtract newTotalVoteStatus
        newTotalVoteStatus += voteType * 2;
        // update the exisingPostVote voteNumber
        const postVoteIndex = newPostVotes.findIndex(
          (postVote) => postVote.id === existingPostVote.id
        );
        newPostVotes[postVoteIndex] = {
          ...existingPostVote,
          voteNumber: voteType,
        };
      }
    }

    // update post's voteStatus
    const postDocRef = doc(firestore, 'posts', post.id!);
    batch.update(postDocRef, {
      voteStatus: newTotalVoteStatus,
    });

    await batch.commit();

    // return newPosts and newPostVotes to update postState
    const postIndex = newPosts.findIndex((item) => item.id === post.id);
    newPosts[postIndex] = {
      ...newPosts[postIndex],
      voteStatus: newTotalVoteStatus,
    };
    return {
      posts: newPosts,
      postVotes: newPostVotes,
    };
  } catch (err) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(`${err.name}: ${err.message}}`);
    }
    if (err instanceof FirestoreError) {
      return thunkAPI.rejectWithValue(`${err.name}: ${err.message}`);
    }
    return thunkAPI.rejectWithValue(`Unexpected Error: ${err}`);
  }
});
