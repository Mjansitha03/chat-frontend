import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../Services/Api";

export const fetchMessages = createAsyncThunk(
  "message/get",
  async (chatId) => {
    const res = await API.get(`/api/messages/chat/${chatId}`)
    return res.data.data;
  }
);

export const sendMessage = createAsyncThunk(
  "message/send",
  async ({ chatId, content }) => {
    const res = await API.post("/api/messages", {
      chatId,
      content,
    });
    return res.data.data;
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: { messages: [] },
  reducers: {
    addMessageRealtime: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { addMessageRealtime } = messageSlice.actions;
export default messageSlice.reducer;




