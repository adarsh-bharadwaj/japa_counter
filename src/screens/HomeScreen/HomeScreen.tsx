import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootNavigator";
import CustomButton from "../../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWindowPercentage } from "../../customHooks/useWindowPercentage";
import Shimmer from "../../components/Shimmer";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { colorConfig } from "../../config/config";
// Infer navigation type
type AppNavigation = NavigationProp<RootStackParamList>;

const HomeScreen = () => {
    const isDarkMode = useColorScheme();
    const navigation = useNavigation<AppNavigation>();
    const [loading, setIsLoading] = useState(true);
    const [counters, setCounters] = useState(null);
    const { t } = useTranslation();
    const { wp, hp, fontScale } = useWindowPercentage();

    const loadData = async () => {
        try {
            const value = await AsyncStorage.getItem('data');
            console.log({ value });
            if (value !== null) {
                let history = await AsyncStorage.getItem('History');
                console.log({ history });
                let updatedHistory = [];
                if (history != null) {
                    updatedHistory = JSON.parse(history);
                }
                let updatedValues = JSON.parse(value);
                updatedValues = updatedValues.map((item) => {
                    console.log({ item2: item });
                    if (item.lastUpdateDate != moment().format("l")) {
                        if (item.Today != 0) {
                            updatedHistory?.push({
                                name: item.name,
                                Today: item.Today,
                                date: item.lastUpdateDate
                            });
                            item.lastUpdatedDate = moment().format("l");
                            item.Today = 0;
                            AsyncStorage.setItem("History", JSON.stringify(updatedHistory))
                        }
                    }
                    return item;
                });
                console.log({ updatedValues });
                console.log(updatedHistory);
                await AsyncStorage.setItem('data', JSON.stringify(updatedValues));
                setCounters(updatedValues);
            }
        } catch (e) {
            console.log({ e })
        }
        setTimeout(() => setIsLoading(false), 2000);
        console.log("exited")
    };


    useFocusEffect(useCallback(() => {
        navigation.setOptions({
            title: t('Home'),
            theme:{colors:{
                background:'black'
            }}
        })
        loadData();

        return () => { }
    }, []))

    const deleteData = async (recToBeDeleted) => {
        Alert.alert("Warning", "Are you sure?", [{
            text: "Yes",
            onPress: async () => {
                try {
                    setIsLoading(true);
                    let parsedData = [];
                    const value = await AsyncStorage.getItem('data');
                    if (value !== null) {
                        parsedData = JSON.parse(value);
                    }
                    const filteredData = parsedData.filter((rec: any, index: Number) => {
                        return rec?.id != recToBeDeleted?.id
                    });
                    console.log({ filteredData });
                    const jsonValue = JSON.stringify(filteredData);
                    // console.log(parsedData.length)
                    await AsyncStorage.setItem('data', jsonValue);
                    Alert.alert("Data Deleted Successfully");
                    setCounters(filteredData);
                    setIsLoading(false);
                }
                catch (e) {
                    setIsLoading(false);
                    Alert.alert("Something Went Wrong")
                    console.log(e);
                }
            }
        }, {
            text: "Cancel",
            onPress: () => { }
        }])

    }


    console.log({ counters })

    return (
        <View style={{ width: wp(100), height: hp(100) }}>
            <CustomButton onPress={() => navigation.navigate('AddCounter')} btnTitle={t('AddCounters')} />
            {loading ? (
                <View style={[styles.shimmer_container,{
                    marginTop: hp(2)
                }]}>
                    <Shimmer
                        height={hp(32)} width={wp(90)} borderRadius={12} />
                </View>
            ) :
                (
                    <FlatList
                        data={counters}
                        contentContainerStyle={{
                            paddingBottom: hp(10)
                        }}
                        keyExtractor={({ item, index }) => index}
                        renderItem={({ item, index }) => {
                            console.log({ item, index });
                            return (
                                <View key={index} style={[styles.card_container, {
                                    width: wp(90),
                                    marginBottom: hp(2),
                                    marginTop: hp(index === 0 ? 2 : 1),
                                    backgroundColor:isDarkMode=='dark'?colorConfig.CARD_DARK_BACKGROUND_COLOR:colorConfig.CARD_BACKGROUND_COLOR
                                }]}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Counter", item)}
                                        style={[styles.card_touchableOpacity, {
                                            width: wp(90),
                                            paddingHorizontal: wp(6),
                                            backgroundColor:isDarkMode=='dark'?colorConfig.CARD_DARK_BACKGROUND_COLOR:colorConfig.CARD_BACKGROUND_COLOR
                                        }]}>
                                        <View style={[styles.text_name_createdDate_container, { marginVertical: hp(1) }]}>
                                            <Text style={[styles.text_name, {
                                                width: wp(40),
                                                fontSize: 21 * fontScale,
                                                color:isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR
                                            }]}>{item.name}</Text>
                                            <Text style={[styles.text_createdDate, { fontSize: 14 * fontScale,color:isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR }]}>{item.createdDate}</Text>
                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            width: wp(80),
                                            marginBottom: hp(1)
                                        }}>
                                            <Text style={[styles.text_today_1, {
                                                width: wp(40),
                                                fontSize: 16 * fontScale,
                                                color:isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR
                                            }]}>{t('Today')}</Text>
                                            <Text style={[styles.text_today_calculated_today_cycleLength, {
                                                fontSize: 16 * fontScale,
                                                width: wp(40),
                                                color:isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR
                                            }]}>{item?.cycleLength + "x"}</Text>
                                        </View>
                                        <View style={[styles.text_today_calculated_today_cycleLength_container, {
                                            width: wp(80),
                                            marginBottom: hp(1)
                                        }]}>
                                            <Text style={[styles.text_today, {
                                                width: wp(40),
                                                fontSize: 30 * fontScale,
                                                color:isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR
                                            }]}>{item?.Today}</Text>
                                            <Text style={[styles.text_today_calculated_today_cycleLength, {
                                                fontSize: 30 * fontScale,
                                                width: wp(40),
                                                color:isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR
                                            }]}>{parseInt(item?.Today / item?.cycleLength)}</Text>
                                        </View>
                                        <View style={[styles.text_lifeTime_cycleLength_container, {
                                            width: wp(80),
                                            marginBottom: hp(1)
                                        }]}>
                                            <Text style={[styles.text_lifeTime, {
                                                width: wp(40),
                                                fontSize: 16 * fontScale,
                                                color:isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR
                                            }]}>{t('LifeTime') + ' : ' + item.lifeTime}</Text>
                                            <Text style={[styles.textCycleLength, {
                                                fontSize: 18 * fontScale,
                                                width: wp(40),
                                                color:isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR
                                            }]}>{item.cycleLength + "x"}</Text>
                                        </View>
                                        <View style={[styles.text_lastUpdate_cycleLength, { width: wp(80), marginBottom: hp(1) }]}>
                                            <Text style={[styles.textLastUpdated, { color:isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR,fontSize: 16 * fontScale, width: wp(40), }]}>{t('LastUpdated') + ' \n' + item.lastUpdateDate}</Text>
                                            <Text style={[styles.text_calculated_cycleLength_lifeTime, { width: wp(40), fontSize: 25 * fontScale,color:isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR }]}>{parseInt(item.lifeTime / item.cycleLength)}</Text>
                                        </View>
                                        <View style={[styles.buttonContainer, { marginBottom: hp(1.5) }]}>
                                            <CustomButton onPress={() => navigation.navigate("Modify", item)} btnTitle={t("Modify")} width={wp(8)} />
                                            <CustomButton onPress={() => deleteData(item)} btnTitle={t("Delete")} width={wp(8)} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                )
            }



        </View>

    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text_calculated_cycleLength_today: {
        color: colorConfig.TEXT_COLOR,
        fontWeight: '700',
        opacity: 0.8,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    text_calculated_cycleLength_lifeTime: {
        color: colorConfig.TEXT_COLOR,
        fontWeight: '700',
        opacity: 0.8,
        textAlign: 'right',
        textAlignVertical: 'top',
    },
    textLastUpdated: {
        color: colorConfig.TEXT_COLOR,
        fontWeight: '700',
        opacity: 0.8,
        textAlign: 'left',
        lineHeight: 20,
        textAlignVertical: 'center',

    },
    text_lastUpdate_cycleLength: {
        flexDirection: 'row'
    },
    textCycleLength: {
        color: colorConfig.TEXT_COLOR,
        fontWeight: '700',
        opacity: 0.8,
        textAlign: 'right',
        textAlignVertical: 'bottom',
    },
    text_lifeTime: {
        color: colorConfig.TEXT_COLOR,
        fontWeight: '700',
        opacity: 0.8,
        textAlign: 'left',
        textAlignVertical: 'center',
    },
    text_lifeTime_cycleLength_container: {
        flexDirection: 'row',
        borderColor: colorConfig.BORDER_COLOR,
        borderTopWidth: 0.5,
        paddingRight: 0,
    },
    text_today: {
        color: colorConfig.TEXT_COLOR,
        fontWeight: '700',
        opacity: 0.8,
        textAlign: 'center',
        textAlignVertical: 'center',

    },
    text_today_calculated_today_cycleLength: {
        color: colorConfig.TEXT_COLOR,
        fontWeight: '700',
        opacity: 0.8,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    text_today_1: {
        color: colorConfig.TEXT_COLOR,
        fontWeight: '700',
        opacity: 0.8,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    text_today_calculated_today_cycleLength_container: {
        flexDirection: 'row',
    },
    text_createdDate: {
        color: colorConfig.TEXT_COLOR,
        fontWeight: '700',

        opacity: 0.8,
        textAlignVertical: 'center',
    },
    text_name: {
        color: colorConfig.TEXT_COLOR,
        fontWeight: 'bold',

    },
    text_name_createdDate_container: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        justifyContent: 'space-between'
    },
    card_touchableOpacity: {
        elevation: 10,
    },
    card_container: {
        elevation: 10,
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: colorConfig.CARD_BACKGROUND_COLOR
    },
    shimmer_container: {
        elevation: 10,
        height: '100%',
        alignSelf: 'center',
    }

})

export default HomeScreen;