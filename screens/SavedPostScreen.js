import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image, Linking, Platform, ScrollView } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import { ADD_POST, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch } from "../Data";
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 



const StarRating = ({rating})=>{
    let start = [0,0,0,0,0]
    start = start.map((el,ind)=> el = ind<rating?1:0)
    const {backgroundColor, postColor, textColor, iconColor, menuColor, heartColor} = useSelector(state => state.color)
    const styles = getStyles(backgroundColor, postColor, textColor, iconColor, menuColor, heartColor)

    return(
        
        <View style={styles.rating}>
            {start.map((el,ind) => 
            <View key={ind} >{el===1?
                <FontAwesome name="star" size={24} color={iconColor} />:
                <FontAwesome name="star-o" size={24} color={iconColor} />}
            </View>)}
        </View>
    )
}

export default function PostScreen(props){
    const {backgroundColor, postColor, textColor, iconColor, menuColor, heartColor} = useSelector(state => state.color)
    const styles = getStyles(backgroundColor, postColor, textColor, iconColor, menuColor, heartColor)

    const {navigation, route} = props
    const item = route.params.post

    const dispatch = useDispatch()
    const profile = useSelector(state => state.profile)


    const updateProfile = (saved)=>{
        const action = {
            type: UPDATE_PROFILE,
            payload: {
                ...profile,
                saved: saved,
            }
        }
        SaveAndDispatch(action, dispatch)
    }


    const openMap= ()=>{
        // https://stackoverflow.com/questions/43214062/open-maps-google-maps-in-react-native
        const url = Platform.select({
            ios: `maps:0,0?q=${item.title}@${item.location[0]},${item.location[1]}`,
            android: `geo:0,0?q=${item.location[0]},${item.location[1]}(${item.title})`
          });
          Linking.openURL(url);
    }


    return(
        <View style={styles.post}>
             <View style={styles.headingRowTop}>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate("RecipeList")
                }}>
                <AntDesign name="arrowleft" size={36} color={iconColor} />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.postTitle}>
                    <Text style={styles.title}>{item.title}</Text>
                </View>
                <View style={styles.middleContent}>
                <Image
                        style={styles.logo}
                        source={{uri: item.image}}
                        />
                </View>
                <View style={styles.middleContent}>
                    <Text style={styles.subtitle}>Location: </Text>
                    {item.location.length >0?
                    <TouchableOpacity onPress={()=>openMap()}>
                        <FontAwesome5 name="map-marked-alt" size={36} color={iconColor} />
                    </TouchableOpacity>:""}
                </View>
                <View style={styles.middleContent}>
                    <Text style={styles.subtitle}>Recipe: </Text>
                    <Text style={styles.content}>{item.recipe}</Text>
                </View>
                <View style={styles.middleContent}>
                    <Text style={styles.subtitle}>Rating: </Text>
                    <StarRating rating={item.rating}/>
                </View>
                <View style={styles.middleContent}>
                    <Text style={styles.subtitle}>Description: </Text>
                    <Text style={styles.content}>{item.description}</Text>
                </View>
                <View style={styles.inputRow}>
                    {profile.saved.filter(el => el === item.id).length > 0?"":
                    <TouchableOpacity style={styles.button} onPress={()=>{updateProfile([...profile.saved, item.id])}}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>}
                </View>
            </ScrollView>
        </View>
    )}

    const getStyles = (backgroundColor, postColor, textColor, iconColor, menuColor, heartColor) =>{
        const styles = {
        
            scrollView:{
                flex: .9
            },
            headingRowTop:{
                flex: .1
            },
            button:{
                marginTop: 10,
                color: backgroundColor,
                backgroundColor: iconColor,
                padding: 12.5,
                borderRadius: 5
            },
            buttonText:{
                color: postColor
            },
            content:{
                marginTop: 10
            },
            subtitle:{
                fontSize: 25,
                marginTop:10,
                color: textColor
            },
            thumb:{flexDirection: "row"},
            rating:{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                marginTop: 10
            },
        middleContent:{
            justifyContent: "center",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            flex: .2,
            marginTop: 10,
            alignItems: "center"
        },
        logo: {
            width: "75%",
            aspectRatio: 1,
            borderRadius: 5
          },
          postTitle:{
            flex: .15,
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
          },
          title:{
            fontSize: 45,
            color: textColor
          },
            postTop:{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between"
            },
            inputRow:{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-evenly",
                paddingTop: 20
            },
            feedContainer:{
                width: "100%",
                backgroundColor:"blue",
                height: "80%",
            },
            post:{
                width: "100%",
                backgroundColor: postColor,
                marginTop: "5%",
                padding: 10,
                borderRadius: 5,
                flex: 1,
                justifyContent: "start"
            },
        
            content:{
                flexDirection: "column"
            }
        }
        return(styles)
    }

    