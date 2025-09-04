import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js"
import postSlice from "./postSlice.js";
import socketSlice from "./socketSlice.js"
import chatSlice from "./chatSlice.js"
import rtnSlice from "./rtnSlice.js"
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

// Action type to reset the entire Redux state
const RESET_STORE = 'RESET_STORE'
export const resetStore = () => ({ type: RESET_STORE })

const appReducer = combineReducers({
    auth: authSlice,
    post: postSlice,
    socketio: socketSlice,
    chat: chatSlice,
    rtn: rtnSlice,
})

// Root reducer that resets state on RESET_STORE
const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) {
    // Clear persisted storage
    storage.removeItem('persist:root')
    // Reset in-memory state
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export default store;