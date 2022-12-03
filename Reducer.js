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
const PROFILE_OVERLAY = "PROFILE_OVERLAY"
const POST_OVERLAY = "POST_OVERLAY"

const initialPosts = []
const intitialProfile = [{firstName:"",lastName:"", password: "mypassword",image:"profilePic.png", reposts: [1], posts: [1,2], saved: [3], friends:[1]}]
const initialFriends = []
const initialSaved = []


const colors = {day:{
    backgroundColor: "#00b2d6",
    postColor: "#FFFCF2",
    textColor: "#01416e",
    iconColor: "#007cba",
    menuColor: "#01416e",
    heartColor: "#e6848d"
},night:{
    backgroundColor: "#007cba",
    postColor: "#01416e",
    textColor: "#00b2d6",
    iconColor: "#00b2d6",
    menuColor: "#007cba",
    heartColor: "#b1d887"
}}

const initialState = {
    profile: intitialProfile[0],
    posts: initialPosts,
    friends: initialFriends,
    saved: initialSaved,
    color: colors.day,
    setPost: false,
    setProfile: false,
    postURL: "https://firebasestorage.googleapis.com/v0/b/ken-homework-5.appspot.com/o/Screen%20Shot%202022-11-30%20at%2010.16.54%20PM.png?alt=media&token=b89c852e-c1b1-4516-a494-0534cd2267ce",
    profileURL:"https://firebasestorage.googleapis.com/v0/b/ken-homework-5.appspot.com/o/Screen%20Shot%202022-11-30%20at%2010.16.54%20PM.png?alt=media&token=b89c852e-c1b1-4516-a494-0534cd2267ce"
  }


const updateColor = (state, status) =>{
    return {
        ...state,
        color: status?colors.day:colors.night,
    }
}

const setPostOverlay = (state, status, url) =>{
    return {
        ...state,
        setPost: status,
        postURL: url,
    }
}

const setProfileOverlay = (state, status, url) =>{
    return {
        ...state,
        setProfile: status,
        profileURL: url,
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
        case PROFILE_OVERLAY:
            return setProfileOverlay(state, action.payload.status, action.payload.profileURL)
        case POST_OVERLAY:
            return setPostOverlay(state, action.payload.status, action.payload.postURL)
        default:
            return state
    }
}




export {rootReducer, LOAD_PROFILE, LOAD_POST, UPDATE_PROFILE, UPDATE_POST, ADD_PROFILE, ADD_POST, DELETE_PROFILE, DELETE_POST, UPDATE_SORT, SEARCH_PROFILE, SAVE_PICTURE, UPDATE_COLOR, PROFILE_OVERLAY, POST_OVERLAY}