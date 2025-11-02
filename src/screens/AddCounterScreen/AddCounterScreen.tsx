import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useWindowPercentage } from '../../customHooks/useWindowPercentage';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../navigation/RootNavigator';

type AppNavigation = NavigationProp<RootStackParamList>;

const AddCounterScreen = () => {
    const { hp, wp, fontScale } = useWindowPercentage();
    const { t } = useTranslation()
    const [counterName, setCounterName] = useState('');
    const [initialCount, setInitialCount] = useState(0);
    const [cycleLength, setCyclelength] = useState(108);
    const navigation = useNavigation<AppNavigation>();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: t('AddCounters')
        })
    }, []);

    const save = async () => {
        console.log("entered");
        if (counterName == "") {
            Alert.alert("Please Enter Valid Input","Counter name cannot be empty");
            return
        }
        if (cycleLength == 0) {
            Alert.alert("Please Enter Valid Input","Cycle Length cannot be 0");
            return
        }
        try {
            let parsedData = [];
            const value = await AsyncStorage.getItem('data');
            if (value !== null) {
                parsedData = JSON.parse(value);
            }
            parsedData.push({
                id: moment().format(),
                name: counterName,
                initialCount,
                cycleLength,
                lifeTime: 0 + initialCount,
                Today: 0,
                createdDate: moment().format('l'),
                lastUpdateDate: moment().format('l')
            });
            console.log({ parsedData })
            const jsonValue = JSON.stringify(parsedData);
            console.log(parsedData.length)
            await AsyncStorage.setItem('data', jsonValue);
            Alert.alert("Data Saved Successfully");
            navigation.goBack();
        } catch (e) {
            console.log({ e });
            Alert.alert("Something Went Wrong,Please Try Again Later");
            navigation.goBack();
        }
    };
    console.log({ counterName, initialCount, cycleLength })
    return (
        <View style={[styles.container, { width: wp(100) }]}>
            <CustomInput onChangeText={(val) => setCounterName(val.trim())} placeholder={t('Name')} />
            <CustomInput keyboardType="numeric" containerStyle={{ marginTop: 0 }} onChangeText={(val) => setInitialCount(val == "" ? 0 : parseInt(val.trim()))} placeholder={t('InitialCount')} />
            <CustomInput keyboardType="numeric" onChangeText={(val) =>{
                console.log({val}); 
                setCyclelength(val.trim() == "" ? 0 : parseInt(val));
                console.log({val})
                }} value={cycleLength.toString()} containerStyle={{ marginTop: 0 }}  placeholder={t('cycleLength')} />
            <CustomButton onPress={() => save()} btnTitle={t('Save')} />
        </View>
    )
}

export default AddCounterScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    }
})