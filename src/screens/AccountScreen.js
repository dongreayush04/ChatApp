import React, {useEffect, useState} from 'react'
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import Feather from 'react-native-vector-icons/Feather'
import { TextInput, Button } from 'react-native-paper'
import auth from '@react-native-firebase/auth'

export default function AccountScreen({user}) {
    const [profile, setProfile] = useState('')
    useEffect(() => {
        firestore().collection('users').doc(user.uid).get().then(docSnap => {
            setProfile(docSnap.data())
        })
    },[])

    if(!profile){
        return <ActivityIndicator size="large" color="cornflowerblue" />
    }

    return (
        <View style = {styles.container}>
            <Image style = {styles.img} source = {{uri : profile.pic}} />
            <Text style = {styles.text}> Name : {profile.name} </Text>
            <View style = {{flexDirection : 'row'}}>
                <Feather name = "mail" size = {30} />
                <Text style = {[styles.text, {marginLeft : 10}]}> {profile.email} </Text>
            </View>
            <Button 
                style = {styles.btn}
                mode = "contained" 
                onPress = {()=>{
                    firestore().collection('users')
                  .doc(user.uid)
                  .update({
                    status : firestore.FieldValue.serverTimestamp()
                  }).then(()=>{
                    auth().signOut()
                  })
                }}
            >Logout</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : "cornflowerblue",
        alignItems : "center",
        justifyContent : 'space-evenly'
    },
    img : {
        marginTop : 15,
        width : 200,
        height : 200,
        borderRadius : 100,
        borderWidth : 3,
        borderColor : "black",
    },
    text : {
        fontSize : 23,
        color : "black",
    },
    btn : {
        borderColor : 'black',
        borderWidth : 3
    }
})