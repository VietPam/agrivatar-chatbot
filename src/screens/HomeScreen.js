import { View, Text, Image, ScrollView, PlainText, TextInput, Heading3 } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Features from '../components/features';
import { dummyMessages } from '../../constant';
const API_KEY = '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';
export default function HomeScreen() {
    const [predefindMsg, setPredefindPsg] = useState([])
    const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
        "role": "system", "content": "You are MobileStoreGPT. You are here to help everyone buy mobile phones easier."
    }
    const [message, setMessage] = useState('');
    const products = [{ test: "1", test2: "2" }, { test3: "3", test4: "4" }];
    const [messages, setMessages] = useState(dummyMessages)
    // setMessages([
    //     {
    //         message: "Hi!",
    //         direction: 'outgoing',
    //         sender: "user",
    //         role: "user",
    //         content: "alo",
    //     },
    //     {
    //         message: "Hello, I'm MobileStoreGPT! Ask me anything!",
    //         sentTime: "just now",
    //         sender: "ChatGPT",
    //         role: "assistant",
    //         content: "alo",
    //     }
    // ]);
    // useEffect(() => {
    //     pushNewSetup()
    // }, [])

    const pushNewSetup = () => {
        if (!products) return
        const newMessage = [
            {
                role: "user",
                content: `For example the mobile store got these products: ${JSON.stringify(products)}, can you remember them all and answer when asked ?`,
            },
            {
                role: "assistant",
                content: `Yes. I can remember all those products`,
            }]
        setPredefindPsg(newMessage)
    }
    const handleSend = async () => {
        console.log("message: ", message);
        const newMessage = {
            message: message,
            direction: 'outgoing',
            sender: "user"
        };

        const newMessages = [...messages, newMessage];
        console.log('line 59');
        setMessages(newMessages);

        // Initial system message to determine ChatGPT functionality
        // How it responds, how it talks, etc.
        await processMessageToChatGPT(newMessages);
    };


    async function processMessageToChatGPT(chatMessages) {
        console.log('processMessageToChatGPT');
        try {
            let apiMessages = chatMessages.map((messageObject) => {

                console.log(' messageObject: ', messageObject);
                let role = "";
                if (messageObject.sender === "ChatGPT") {
                    role = "assistant";
                } else {
                    role = "user";
                }
                return { role: role, content: messageObject.message }
            });

            const apiRequestBody = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    systemMessage,
                    ...predefindMsg,  // The system message DEFINES the logic of our chatGPT
                    ...apiMessages // The messages from our chat with ChatGPT
                ]
            }

            await fetch("https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + API_KEY,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(apiRequestBody)
                }).then((data) => {
                    console.log('body request: ', apiRequestBody)
                    console.log('line 100, data:', data);
                    console.log('content message: ')
                    console.log(data.choices[0].message.content);

                    //return data.json();
                }).then((data) => {
                    console.log(data.choices[0].message.content);
                    console.log('line 103');
                    setMessages([...chatMessages, {
                        message: data.choices[0].message.content,
                        sender: "ChatGPT"
                    }]);
                });
        } catch (error) {
            console.log(error)
        }
        ``
    }
    return (
        <View className="flex-1 bg-white">
            {/* <StatusBar barStyle="dark-content" /> */}
            <SafeAreaView className="flex-1 flex mx-5">
                {/* bot icon */}
                <View className="flex-row justify-center">
                    <Image
                        source={require('../../assets/image/logo.png')}
                        style={{ height: hp(12), width: hp(15) }}
                    />
                </View>

                {/* features || message history */}
                {
                    messages.length > 0 ? (
                        <View className="space-y-2 flex-1">
                            <Text className="text-gray-700 font-semibold ml-1" style={{ fontSize: wp(5) }}>Assistant</Text>

                            <View
                                style={{ height: hp(78) }}
                                className="bg-neutral-200 rounded-3xl p-4">
                                <ScrollView
                                    bounces={false}
                                    className="space-y-4"
                                    showsVerticalScrollIndicator={false}
                                >
                                    {
                                        messages.map((message, index) => {
                                            if (message.role == 'assistant') {
                                                if (message.content.includes('https')) {
                                                    // result is an ai image
                                                    return (
                                                        <View>
                                                        </View>
                                                    )
                                                } else {
                                                    // chat gpt response
                                                    return (
                                                        <View
                                                            key={index} style={{ width: wp(70) }}
                                                            className="bg-emerald-100 p-2 rounded-xl rounded-tl-none">
                                                            <Text className="text-neutral-800" style={{ fontSize: wp(4) }}  >
                                                                {message.content}
                                                            </Text>
                                                        </View>
                                                    )
                                                }
                                            } else {
                                                // user input text
                                                return (
                                                    <View key={index} className="flex-row justify-end">
                                                        <View
                                                            style={{ width: wp(70) }}
                                                            className="bg-white p-2 rounded-xl rounded-tr-none ">
                                                            <Text style={{ fontSize: wp(4) }}  >
                                                                {message.content}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                );
                                            }


                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    ) : (
                        <Features />
                    )
                }

                {/* Button chat */}
                <View className="flex-row items-center p-4 bg-white">
                    <TextInput
                        className="flex-1 mr-4 border-2 border-gray-300 p-2 rounded-lg"
                        placeholder="Type your message here"
                        onChangeText={(text) => { setMessage(text); console.log(text); }}
                    />
                    <TouchableOpacity className="bg-green-500 p-2 rounded-full">
                        <Text className="text-white font-bold" onPress={handleSend} >  Gửi  </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}