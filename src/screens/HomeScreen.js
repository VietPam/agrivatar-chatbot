import { View, Text, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Features from '../components/features';
import { dummyMessages } from '../../constant';

export default function HomeScreen() {
    const [messages, setMessages] = useState([]);
    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1 flex mx-5">

                <View className="flex-row justify-center">
                    <Image source={require('../../assets/image/logo.png')} style={{ height: hp(15), width: hp(15) }} />
                </View>

                {
                    messages.length > 0 ? (
                        <View className="space-y-2 flex-1">
                            <Text style={{ fontSize: wp(5) }} className="text-gray-700 font-semibold ml-l">
                                Assistant
                            </Text>
                            <View style={{ height: hp(58) }}
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
                                                    //its an ai image
                                                } else {
                                                    //text response
                                                    <View key={index} style={{ width: wp(70) }}
                                                        className="bg-emerald-100 rounded-xl p-2 rounded-tl-none">
                                                        <Text>
                                                            {message.content}
                                                        </Text>
                                                    </View>
                                                }
                                            }
                                            else {
                                                //user input
                                                return (<View key={index} className="flex-row justify-end">
                                                    <View style={{ width: wp(70) }}
                                                        className="bg-white rounded-xl p-2 rounded-tr-none">
                                                        <Text>
                                                            {message.content}
                                                        </Text>
                                                    </View>
                                                </View>)
                                            }
                                        })
                                        // return (<View>
                                        //     <Text> {message.content}</Text>
                                        // </View>)
                                    }


                                </ScrollView>
                            </View>
                        </View>
                    ) : (
                        <Features />
                    )
                }
            </SafeAreaView>
        </View>
    )
}