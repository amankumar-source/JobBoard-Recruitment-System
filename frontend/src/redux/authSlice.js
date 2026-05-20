import { createSlice } from "@reduxjs/toolkit";

let initialUser = null;
try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        initialUser = JSON.parse(storedUser);
    }
} catch (error) {
    console.error("Local storage parsing error:", error);
    localStorage.removeItem('user');
}

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user: initialUser
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('user');
            }
        }
    }
});
export const {setLoading, setUser} = authSlice.actions;
export default authSlice.reducer;