import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import {
  collection,
  doc,
  FirestoreError,
  getDocs,
  increment,
  runTransaction,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { firestore } from '@/firebase/clientApp';

export interface ICommunity {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: 'public' | 'restricted' | 'private';
  createAt?: Timestamp;
  imageURL?: string;
}

interface ICommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface ICommunityState {
  snippets: ICommunitySnippet[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ICommunityState = {
  snippets: [],
  isLoading: false,
  error: null,
};

export const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    // joinCommunity: (state, action: PayloadAction<ICommunity>) => {
    //   state.snippets.push({
    //     communityId: action.payload.id,
    //     imageURL: action.payload.imageURL,
    //   });
    // },
    leaveCommunity: (state, action: PayloadAction<ICommunity>) => {
      state.snippets = state.snippets.filter(
        (communitySnippet) => communitySnippet.communityId !== action.payload.id
      );
    },
    resetCommunityState: (state) => {
      state.snippets = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllCommunitySnippets.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    }),
      builder.addCase(getAllCommunitySnippets.fulfilled, (state, action) => {
        state.snippets = action.payload;
        state.isLoading = false;
      }),
      builder.addCase(getAllCommunitySnippets.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error;
        }
      });
    builder.addCase(joinCommunity.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    }),
    builder.addCase(joinCommunity.fulfilled, (state, action) => {
      state.snippets.push(action.payload);
      state.isLoading = false;
    }),
    builder.addCase(joinCommunity.rejected, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = action.error;
      }
    })
  },
});

export const { leaveCommunity, resetCommunityState } = communitySlice.actions;

export default communitySlice.reducer;

export const getAllCommunitySnippets = createAsyncThunk<
  ICommunitySnippet[],
  { user: User },
  { rejectValue: string; serializedErrorType: string }
>('community/fetchAllSnippets', async ({ user }, thunkAPI) => {
  try {
    const allSnippetsDocs = await getDocs(
      collection(firestore, `users/${user?.uid}/communitySnippets`)
    );
    const allSnippets = allSnippetsDocs.docs.map((doc) => ({
      ...doc.data(),
    }));
    return allSnippets as ICommunitySnippet[];
  } catch (err) {
    console.log(err);
    if (err instanceof FirestoreError) {
      return thunkAPI.rejectWithValue(err.message);
    } else {
      return thunkAPI.rejectWithValue(`Unexpected Error: ${err}`);
    }
  }
});

export const joinCommunity = createAsyncThunk<
  ICommunitySnippet,
  { communityData: ICommunity; user: User },
  { rejectValue: string; serializedErrorType: string }
>('community/join', async ({ communityData, user }, thunkAPI) => {
  // batched writes
  try {
    // add a new community snippet to user's community snippets[]
    const batch = writeBatch(firestore);
    const newCommunitySnippet: ICommunitySnippet = {
      communityId: communityData.id,
      isModerator: false,
      imageURL: communityData.imageURL || '',
    };
    batch.set(
      doc(firestore, `users/${user.uid}/communitySnippets`, communityData.id),
      newCommunitySnippet
    );

    // increase the number of members of the community
    batch.update(doc(firestore, 'communities', communityData.id), {
      numberOfMembers: increment(1),
    });

    await batch.commit();

    return newCommunitySnippet;
  } catch (err) {
    console.log(err);
    if (err instanceof FirestoreError) {
      return thunkAPI.rejectWithValue(err.message);
    } else {
      return thunkAPI.rejectWithValue(`Unexpected Error: ${err}`);
    }
  }
});
