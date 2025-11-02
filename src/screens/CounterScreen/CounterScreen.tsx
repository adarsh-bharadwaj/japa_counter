import { StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native"
import { useWindowPercentage } from "../../customHooks/useWindowPercentage";
import { colorConfig } from "../../config/config";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useTranslation } from "react-i18next";

const Counter = () => {
    const routes = useRoute();
    const navigation = useNavigation()
    const { t } = useTranslation();
    const { wp, hp, fontScale } = useWindowPercentage();
    const [counterData, setCounterData] = useState(routes.params)
    console.log(routes.params);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: t('Counter')
        })
    }, [])

    const decrement = async () => {
        try {
            let parsedData = [];
            const value = await AsyncStorage.getItem('data');
            if (value !== null) {
                parsedData = JSON.parse(value);
            }
            let record;
            const mappedData = parsedData.map((rec) => {
                if (rec?.id == routes?.params?.id) {
                    if (rec.Today != 0) {
                        rec.Today--;
                        rec.lifeTime--;
                        rec.lastUpdateDate = moment().format('l')
                    }

                    record = rec
                }

                return rec;
            });
            console.log({ mappedData });
            const jsonValue = JSON.stringify(mappedData);
            // console.log(parsedData.length)
            await AsyncStorage.setItem('data', jsonValue);
            Vibration.vibrate(200)
            setCounterData(record);
        }
        catch (e) {
            console.log({ e });
        }


    }

    const increment = async () => {
        try {
            let parsedData = [];
            const value = await AsyncStorage.getItem('data');
            if (value !== null) {
                parsedData = JSON.parse(value);
            }
            let record;
            const mappedData = parsedData.map((rec) => {
                if (rec?.id == routes?.params?.id) {
                    rec.Today++;
                    rec.lifeTime++;
                    rec.lastUpdateDate = moment().format('l')
                    record = rec
                }

                return rec;
            });
            console.log({ mappedData });
            const jsonValue = JSON.stringify(mappedData);
            // console.log(parsedData.length)
            await AsyncStorage.setItem('data', jsonValue);
            await Vibration.vibrate(200)
            setCounterData(record);
        }
        catch (e) {
            console.log({ e });
        }


    }
    return (
        <View style={{
            height: hp(100),
            width: wp(100),
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <View style={{
                borderRadius: 15,
                alignSelf: 'center',
                height: hp(30),
                width: wp(95),
                elevation: 10,
                marginTop: hp(2),
                paddingTop: hp(1)
            }}>
                <TouchableOpacity style={{
                    height: '97%',
                    width: '95%',
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    borderRadius: 15,
                }}>
                    <View style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: 20 * fontScale
                        }}>{t('Today')}</Text>
                        <Text style={{
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: 60 * fontScale
                        }}>{counterData?.Today}</Text>
                    </View>
                    <View style={{
                        paddingHorizontal: wp(4),
                        flexDirection: 'row',
                        marginTop: hp(1),
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{
                            color: 'black',
                            fontSize: 14 * fontScale,
                            marginTop: hp(1),
                            fontWeight: 'bold',
                            textAlignVertical: 'center'
                        }}>{t('LifeTime')}</Text>
                        <Text style={{
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: 14 * fontScale,
                            textAlignVertical: 'center'
                        }}>{t('Multiplier')}</Text>
                    </View>
                    <View style={{
                        paddingHorizontal: wp(4),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{
                            color: 'black',
                            fontSize: 20 * fontScale,
                            marginTop: hp(1),
                            fontWeight: 'bold',
                            textAlignVertical: 'center'
                        }}>{counterData?.lifeTime}</Text>
                        <Text style={{
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: 20 * fontScale,
                            textAlignVertical: 'center'
                        }}>{counterData?.cycleLength + "x"}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{
                height: hp(10),
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                width: wp(95),
                borderRadius: 10,
                padding: 25,
                backgroundColor: '#fc8208',
                elevation: 10,
            }}>
                <TouchableOpacity
                    onPress={decrement}
                    style={{
                        backgroundColor: colorConfig.PRIMARY_COLOR,
                        width: '100%',
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                    }}>
                    <Text style={{
                        color: 'black',
                        fontSize: 20 * fontScale,
                        fontWeight: 'bold'
                    }}>{t('Decrement')}</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.increment_button_container, {
                height: hp(38.5),
                marginBottom: hp(12),
                width: wp(95),
            }]}>
                <TouchableOpacity
                    onPress={() => increment()}
                    style={styles.increment_text_container}>
                    <Text style={[styles.increment_text, { fontSize: 20 * fontScale }]}>{t('Increment')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Counter;

const styles = StyleSheet.create({
    increment_text: {
        color: 'black',
        fontWeight: 'bold'
    },
    increment_text_container: {
        backgroundColor: colorConfig.PRIMARY_COLOR,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    increment_button_container: {
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 25,
        backgroundColor: '#fc8208',
        elevation: 10
    }
})