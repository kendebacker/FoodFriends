import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {rootReducer} from "./Reducer"
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