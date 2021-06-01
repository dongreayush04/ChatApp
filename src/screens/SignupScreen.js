import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

export default function SignupScreen({navigation}) {
    const [email,setEmail] = useState('')
    const [name,setName] = useState('')
    const [password,setPassword] = useState('')
    const [image,setImage] = useState(null)
    const [showNext,setShowNext] = useState(false)
    const [loading,setLoading] = useState(false)

    if(loading){
        return <ActivityIndicator size="large" color="cornflowerblue" />
    }

    const userSignUp = async () =>{
        setLoading(true)
        if(!email || !password || !image || !name){
            alert("please add necessary details")
            return
        }
        try{
            const result = await auth().createUserWithEmailAndPassword(email,password)
            firestore().collection('users').doc(result.user.uid).set({
                name : name,
                email : result.user.email,
                uid : result.user.uid,
                pic : image,
                status : "online",
            })
            setLoading(false)
        }catch(err){
            alert("Something went wrong")
        }
        
    }

    const pickImageAndUpload = () => {
        launchImageLibrary({quality : 0.5},(fileobj)=>{
            const uploadTask = storage().ref().child(`/userprofile/${Date.now()}`).putFile(fileobj.uri)
            uploadTask.on('state_changed', 
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if(progress == 100) alert('Image uploaded')
            }, 
            (error) => {
                alert("Error in uploading image")
            }, 
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                setImage(downloadURL)
                });
            }
            );

        })
    }
    
    return (
        <KeyboardAvoidingView behavior = "padding">
            <View style = {styles.box1}>
                <Text style = {styles.text}>Welcome to Chat App</Text>
                <Image style = {styles.img} source = {require('../assets/pigeon_logo.jpg')}/>
            </View>
            <View style = {styles.box2}>
                { !showNext && 
                    <>
                        <TextInput 
                        label = "Email"
                        value = {email}
                        onChangeText = {(text) => setEmail(text)}
                        mode = "outlined"
                        />
                        <TextInput 
                            label = "Password"
                            mode = "outlined"
                            value = {password}
                            onChangeText = {(text) => setPassword(text)}
                            secureTextEntry = {true}
                        />
                    </>
                }
                
                {showNext ?
                    <>
                        <TextInput 
                            label = "Name"
                            value = {name}
                            onChangeText = {(text) => setName(text)}
                            mode = "outlined"
                        />
                        <Button 
                            mode = "contained" 
                            onPress = {() => pickImageAndUpload()}
                        >Select Profile</Button>
                        <Button 
                            mode = "contained" 
                            disabled = {image?false:true}
                            onPress = {() => userSignUp()}
                        >Signup</Button>
                    </> : 
                    <>
                        <Button 
                            mode = "contained" 
                            onPress = {()=>setShowNext(true)}
                        >Next</Button>
                    </>
                }
                <TouchableOpacity onPress={()=>navigation.goBack()} >
                    <Text style = {{textAlign : "center"}}>Already have an account ?</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    text:{
      fontSize : 22,
      color : "cornflowerblue",
      margin : 10,
    },
    img:{
        width : 200,
        height : 200,
    },
    box1:{
        alignItems : "center",    
    },
    box2:{
        paddingHorizontal : 40,
        justifyContent : "space-evenly",
        height : "50%",
    },
  });
