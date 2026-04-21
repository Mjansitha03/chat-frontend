import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../Services/Api";

export const fetchChats = createAsyncThunk("chat/get", async () => {
  const res = await API.get("/api/chats");
  return res.data.data;
});

const chatSlice = createSlice({
  name: "chat",
  initialState: { chats: [], selectedChat: null },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.chats = action.payload;
    });
  },
});

export const { setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;


