import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { AntDesign } from '@expo/vector-icons'; 
import LoginScreen from "./screens/MakeAccountScreen.js"
import MakeAccountScreen from "./screens/MakeAccountScreen"
import FeedScreen from "./screens/FeedScreen"
import PostScreen from "./screens/PostScreen"
import FriendsScreen from "./screens/FriendsScreen"
import RecipeListScreen from "./screens/RecipeListScreen"

import { FontAwesome } from '@expo/vector-icons';
import {rootReducer} from "./Reducer"
import { Ionicons } from '@expo/vector-icons'; 




function FeedTabs(){
    const Stack = createNativeStackNavigator()

    return(
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="MakeAccount" component={MakeAccountScreen}/>
            <Stack.Screen name="Feed" component={FeedScreen}/>
            <Stack.Screen name="Post" component={PostScreen}/>
        </Stack.Navigator>
    )
}


function RecipesTabs(){
    const Stack = createNativeStackNavigator()

    return(
        <Stack.Navigator initialRouteName="RecipeList" screenOptions={{headerShown: false}}>
            <Stack.Screen name="RecipeList" component={RecipeListScreen}/>
            <Stack.Screen name="Post" component={PostScreen}/>
        </Stack.Navigator>
    )
}

const store = configureStore({
    reducer: rootReducer
})


function KensApp(){
    
    const Tabs = createBottomTabNavigator()

    return(
        <Provider store={store}>
            <NavigationContainer>
                <Tabs.Navigator screenOptions={{headerShown:false}}>
                    <Tabs.Screen name="Feed" component={FeedTabs}options={{
                        tabBarIcon:({color})=>{
                            return(
                                <AntDesign name="contacts" size={24} color={color}/>   
                            )
                        }
                    }}/>
                    <Tabs.Screen name="Friends" component={FriendsScreen}options={{
                        tabBarIcon:({color})=>{
                            return(
                                <FontAwesome name="group" size={24} color={color} />  
                            )
                        }
                    }}/>
                    <Tabs.Screen name="Recipes" component={RecipesTabs}
                    options={{
                        tabBarIcon:({color})=>{
                            return(
                                <Ionicons name="settings-sharp" size={24} color={color} />  
                            )
                        }
                    }}/>
                </Tabs.Navigator>
            </NavigationContainer>
        </Provider>
    )

}

export default KensApp