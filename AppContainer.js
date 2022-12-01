import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { AntDesign } from '@expo/vector-icons'; 
import LoginScreen from "./screens/MakeAccountScreen.js"
import MakeAccountScreen from "./screens/MakeAccountScreen"
import FeedScreen from "./screens/FeedScreen"
import PostScreen from "./screens/PostScreen"
import SavedPostScreen from "./screens/SavedPostScreen"
import FriendsScreen from "./screens/FriendsScreen"
import RecipeListScreen from "./screens/RecipeListScreen"
import CameraScreen from "./screens/Camera"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons';
import {rootReducer} from "./Reducer"
import { Ionicons } from '@expo/vector-icons'; 
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {TabNavigator} from './TabNavigator.js';




const store = configureStore({
    reducer: rootReducer
})

function KensApp(){




    return(
        <Provider store={store}>
            <TabNavigator/>
        </Provider>
    )

}

export default KensApp