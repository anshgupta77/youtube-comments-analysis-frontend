import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { backendUrl } from '../constraint';

// Define the type for a single comment
export interface Comment {
  videoId: string;
  commentId: string;
  maskedUsername: string;
  text: string;
  timestamp: string;
  sentiment: 'Agree' | 'Disagree' | 'Neutral';
}

// Define the type for our comments state
interface CommentsState {
  items: Comment[];
  videoId: string | null;
  videoTitle: string;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CommentsState = {
  items: [],
  videoId: null,
  videoTitle: 'YouTube Video Analysis',
  loading: false,
  error: null,
};

// Create async thunk for fetching comments
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (videoUrl: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/api/gemini/analyze-comments`, { videoUrl });
      console.log(response.data);
      return response.data.comments;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'An error occurred');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Create comments slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setVideoTitle: (state, action: PayloadAction<string>) => {
      state.videoTitle = action.payload;
    },
    resetComments: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.loading = false;
        state.items = action.payload;
        if (action.payload.length > 0) {
          state.videoId = action.payload[0].videoId;
        }
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch comments';
      });
  },
});

// Export actions and reducer
export const { setVideoTitle, resetComments } = commentsSlice.actions;
export default commentsSlice.reducer;