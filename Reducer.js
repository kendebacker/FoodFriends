const ADD_PROFILE = "ADD_PROFILE"
const UPDATE_PROFILE ="UPDATE PROFILE"
const DELETE_PROFILE = "DELETE_PROFILE"
const ADD_POST = "ADD_POST"
const UPDATE_POST ="UPDATE_POST"
const DELETE_POST = "DELETE_POST"
const LOAD_POST ="LOAD_PROFILE"
const LOAD_PROFILE = "LOAD_POST"
const UPDATE_SORT = "UPDATE_SORT"
const SEARCH_PROFILE = "SEARCH_PROFILE"
const SAVE_PICTURE = "SAVE_PICTURE"
const UPDATE_COLOR = "UPDATE_COLOR"

const initialPosts = []
const intitialProfile = [{firstName:"",lastName:"", password: "mypassword",image:"profilePic.png", reposts: [1], posts: [1,2], saved: [3], friends:[1]}]
const initialFriends = []
const initialSaved = []


const colors = {day:{
    backgroundColor: "#C2EFB3",
    postColor: "#FFFCF2",
    textColor: "#023C40",
    iconColor: "#119DA4",
    menuColor: "#023C40",
    heartColor: "#e6848d"
},night:{
    backgroundColor: "#023C40",
    postColor: "#119DA4",
    textColor: "#FFFCF2",
    iconColor: "#C2EFB3",
    menuColor: "#023C40",
    heartColor: "#e6848d"
}}

const initialState = {
    profile: intitialProfile[0],
    posts: initialPosts,
    friends: initialFriends,
    saved: initialSaved,
    color: colors.day
  }


const updateColor = (state, status) =>{
    console.log(status)
    return {
        ...state,
        color: status?colors.day:colors.night,
    }
}


const loadPost = (state, newPosts) =>{
    return {
        ...state,
        posts: newPosts,
    }
}


const loadProfile = (state, profile, posts, friends, saved) =>{
    return {
    ...state,
    profile: profile,
    posts: posts,
    friends: friends,
    saved: saved
}}


const rootReducer =(state=initialState, action)=>{
    console.log(action)
    switch (action.type){
        case ADD_PROFILE: 
        case UPDATE_PROFILE:
        case DELETE_PROFILE:
        case LOAD_PROFILE:
            return loadProfile(state, action.payload.profile,action.payload.posts,action.payload.friends,action.payload.saved)
        case LOAD_POST:
        case UPDATE_POST:
        case DELETE_POST:
        case ADD_POST:
            return loadPost(state, action.payload.posts)
        case UPDATE_COLOR:
            return updateColor(state, action.payload.status)
        default:
            return state
    }
}




export {rootReducer, LOAD_PROFILE, LOAD_POST, UPDATE_PROFILE, UPDATE_POST, ADD_PROFILE, ADD_POST, DELETE_PROFILE, DELETE_POST, UPDATE_SORT, SEARCH_PROFILE, SAVE_PICTURE, UPDATE_COLOR}