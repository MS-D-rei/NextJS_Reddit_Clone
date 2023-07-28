import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  FieldValue,
  FirestoreError,
  getDoc,
  getDocs,
  increment,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { firestore } from '@/firebase/clientApp';

export interface ICommunity {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: 'public' | 'restricted' | 'private';
  createdAt: Timestamp;
  imageURL?: string;
}

export interface ICommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface ICommunityState {
  snippets: ICommunitySnippet[];
  currentCommunity?: ICommunity;
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
    resetCommunityState: (state) => {
      state.snippets = [];
      state.isLoading = false;
      state.error = null;
    },
    setCurrentCommunity: (state, action: PayloadAction<ICommunity>) => {
      state.currentCommunity = action.payload;
    },
    setCommunitySnippets: (state, action: PayloadAction<ICommunitySnippet[]>) => {
      state.snippets = action.payload;
    },
    updateCurrentCommunityImageURL: (state, action: PayloadAction<string>) => {
      if (state.currentCommunity !== undefined) {
        state.currentCommunity.imageURL = action.payload;
      }
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
      });
    builder.addCase(leaveCommunity.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    }),
      builder.addCase(leaveCommunity.fulfilled, (state, action) => {
        state.snippets = state.snippets.filter(
          (snippet) => snippet.communityId !== action.payload
        );
        state.isLoading = false;
      }),
      builder.addCase(leaveCommunity.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error;
        }
      });
    builder.addCase(getCommunityData.fulfilled, (state, action) => {
      state.currentCommunity = action.payload;
    }),
      builder.addCase(getCommunityData.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error;
        }
      });
  },
});

export const {
  resetCommunityState,
  setCurrentCommunity,
  setCommunitySnippets,
  updateCurrentCommunityImageURL,
} = communitySlice.actions;

export default communitySlice.reducer;

/* Async Thunk */

export const getAllCommunitySnippets = createAsyncThunk<
  ICommunitySnippet[],
  { userId: string },
  { rejectValue: string; serializedErrorType: string }
>('community/getAllSnippets', async ({ userId }, thunkAPI) => {
  try {
    const allSnippetsDocs = await getDocs(
      collection(firestore, `users/${userId}/communitySnippets`)
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
  { communityData: ICommunity; userId: string },
  { rejectValue: string; serializedErrorType: string }
>('community/join', async ({ communityData, userId }, thunkAPI) => {
  // batched writes
  try {
    // add a new community snippet to user's community snippets[]
    const batch = writeBatch(firestore);
    const newCommunitySnippet: ICommunitySnippet = {
      communityId: communityData.id,
      isModerator: userId === communityData.creatorId,
      imageURL: communityData.imageURL || '',
    };
    batch.set(
      doc(firestore, `users/${userId}/communitySnippets`, communityData.id),
      newCommunitySnippet
    );

    // increase the number of members of the community
    batch.update(doc(firestore, 'communities', communityData.id), {
      numberOfMembers: increment(1),
    });

    await batch.commit();

    return newCommunitySnippet;
  } catch (err) {
    console.log(`joinCommunity function Error: ${err}`);
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(`${err.name}: ${err.message}`);
    }
    if (err instanceof FirestoreError) {
      return thunkAPI.rejectWithValue(`${err.name}: ${err.message}`);
    }
    return thunkAPI.rejectWithValue(`Unexpected Error: ${err}`);
  }
});

export const leaveCommunity = createAsyncThunk<
  string,
  { communityId: string; userId: string },
  { rejectValue: string; serializedErrorType: string }
>('community/leave', async ({ communityId, userId }, thunkAPI) => {
  // batch writes
  try {
    const batch = writeBatch(firestore);
    // delete the community snippet from user's communitySnippets
    batch.delete(
      doc(firestore, `users/${userId}/communitySnippets`, communityId)
    );

    // decrease the number of members of the community.
    batch.update(doc(firestore, 'communities', communityId), {
      numberOfMembers: increment(-1),
    });

    await batch.commit();

    return communityId;
  } catch (err) {
    console.log(`leaveCommunity function Error: ${err}`);
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(`${err.name}: ${err.message}`);
    }
    if (err instanceof FirestoreError) {
      return thunkAPI.rejectWithValue(`${err.name}: ${err.message}`);
    }
    return thunkAPI.rejectWithValue(`Unexpected Error: ${err}`);
  }
});

export const getCommunityData = createAsyncThunk<
  ICommunity,
  { communityId: string },
  { rejectValue: string; serializedErrorType: string }
>('community/getCommunityData', async ({ communityId }, thunkAPI) => {
  try {
    const communityDocRef = doc(firestore, 'communities', communityId);
    const communitySnap = await getDoc(communityDocRef);
    const communityData = { id: communityDocRef.id, ...communitySnap.data() };
    const serializedCommunityData = JSON.parse(JSON.stringify(communityData));
    return serializedCommunityData as ICommunity;
  } catch (err) {
    console.log(`getCommunityData function Error: ${err}`);
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(`${err.name}: ${err.message}`);
    }
    if (err instanceof FirestoreError) {
      return thunkAPI.rejectWithValue(`${err.name}: ${err.message}`);
    }
    return thunkAPI.rejectWithValue(`Unexpected Error: ${err}`);
  }
});
