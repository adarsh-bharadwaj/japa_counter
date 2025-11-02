import { Alert, View } from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useWindowPercentage } from "../../customHooks/useWindowPercentage"
import { useTranslation } from "react-i18next";

const ModifyScreen = () => {
    const routes = useRoute();
    const { t } = useTranslation();
    const { hp } = useWindowPercentage();
    const navigation = useNavigation()
    const [name, setName] = useState(routes?.params?.name);
    const [initialCount, setInitialCount] = useState(routes?.params?.initialCount);
    const [cycleLength, setCycleLength] = useState(routes?.params?.cycleLength);
    const [lifeTime, setLifeTime] = useState(routes?.params?.lifeTime);
    const [today, setToday] = useState(routes?.params?.Today)

    console.log(routes.params)
    console.log({ name, initialCount, cycleLength });
    useEffect(() => {
        navigation.setOptions({
            headerTitle: t('Modify')
        })
    })


    const update = async () => {
        try {
            let parsedData = [];
            const value = await AsyncStorage.getItem('data');
            if (value !== null) {
                parsedData = JSON.parse(value);
            }
            const filteredData = parsedData.filter((rec: any, index: Number) => {
                return rec?.id != routes?.params?.id
            });
            console.log({ filteredData });
            filteredData.push({
                id: moment().format(),
                name,
                initialCount,
                cycleLength,
                lifeTime,
                Today: today,
                createdDate: routes?.params?.createdDate,
                lastUpdateDate: moment().format('l')
            })
            const jsonValue = JSON.stringify(filteredData);
            // console.log(parsedData.length)
            await AsyncStorage.setItem('data', jsonValue);
            Alert.alert("Data Updated Successfully")
            navigation.goBack()
        }
        catch (e) {
            Alert.alert("Something Went Wrong, Please Try Again Later");
            navigation.goBack();
            console.log({ e })
        }
    }
    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: hp(2)
        }}>
            <CustomInput label={t("Name")} onChangeText={(val) => setName(val)} value={name} placeholder={t("Name")} />
            <CustomInput label={t("InitialCount")} onChangeText={(val) => setInitialCount(parseInt(val == "" ? '0' : val))} value={initialCount.toString()} placeholder={t("InitialCount")} />
            <CustomInput label={t("cycleLength")} onChangeText={(val) => setCycleLength(parseInt(val == "" ? '0' : val))} value={cycleLength.toString()} placeholder={t("cycleLength")} />
            <CustomInput label={t("LifeTime")} onChangeText={(val) => setLifeTime(parseInt(val == "" ? '0' : val))} value={lifeTime.toString()} placeholder={t("LifeTime")} />
            <CustomInput label={t("Today")} onChangeText={(val) => setToday(parseInt(val == "" ? '0' : val))} value={today.toString()} placeholder={t("Today")} />
            <CustomButton onPress={update} btnTitle={t("Update")} />
        </View>
    )
}

export default ModifyScreen;