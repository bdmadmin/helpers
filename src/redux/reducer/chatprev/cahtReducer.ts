import {createSlice} from'@reduxjs/toolkit'

const initialState = {
    chats:[]
}
const chatslice = createSlice({
   name:'chat',
   initialState,
   reducers:{
    chatact:(state,action)=>{
        state = action.payload
    }
   }
})
export const {chatact} = chatslice.actions
export default chatslice.reducer