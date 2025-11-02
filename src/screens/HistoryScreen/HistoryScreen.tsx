import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Shimmer from "../../components/Shimmer";
import { useWindowPercentage } from "../../customHooks/useWindowPercentage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import { useTranslation } from "react-i18next";

const HistoryScreen = () => {
  const { wp, hp, fontScale } = useWindowPercentage();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loading, setIsLoading] = useState(true);
  const [counters, setCounters] = useState([]);

  const clearHistory = async () => {
    Alert.alert("Warning", "Are you sure?", [{
      text: "Yes",
      onPress: async () => {
        try {
          await AsyncStorage.removeItem("History");
          Alert.alert("", "Cleared History");
          setCounters([]);
        }
        catch (e) {
          console.log({ e });
        }
      }
    }, {
      text: "Cancel",
      onPress: () => { }
    }])

  }

  const loadData = async () => {
    try {
      let parsedData = [];
      const value = await AsyncStorage.getItem('History');
      if (value != null) {
        parsedData = JSON.parse(value)
      }
      setCounters(parsedData);
    }
    catch (e) {
      console.log({ e });
    }
    setTimeout(() => setIsLoading(false), 2000);
  }

  useFocusEffect(useCallback(() => {
    navigation.setOptions({
      title: t('History')
    })
    loadData();

    return () => { }
  }, []))

  return (
    <View style={{ width: wp(100), height: hp(100) }}>
      <CustomButton onPress={clearHistory} btnTitle={t('ClearHistory')} />
      {loading ? (
        <View style={[styles.shimmer_container, { marginTop: hp(2) }]}>
          <Shimmer
            height={hp(20)} width={wp(90)} borderRadius={12} />
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
                <View key={index} style={[styles.flatList_card_container, {
                  marginBottom: hp(2),
                  marginTop: hp(index === 0 ? 2 : 1),
                  width: wp(90),
                }]}>
                  <TouchableOpacity
                    style={[styles.card_touchableOpacity, {
                      width: wp(90),
                      paddingHorizontal: wp(6),
                    }]}>
                    <View style={[styles.date_name_text_container, { marginVertical: hp(1) }]}>
                      <Text style={[styles.name_text_container, {
                        width: wp(40),
                        fontSize: 21 * fontScale,
                      }]}>{item.name}</Text>
                      <Text style={[styles.date_text_container, { fontSize: 14 * fontScale }]}>{item.date}</Text>
                    </View>
                    <View style={[styles.today_text_container, {
                      width: wp(80),
                      marginBottom: hp(1)
                    }]}>
                      <Text style={[styles.today_label, {
                        width: wp(80),
                        fontSize: 16 * fontScale,
                      }]}>Today</Text>
                      <Text style={[styles.today_text, {
                        width: wp(80),
                        fontSize: 30 * fontScale
                      }]}>{item?.Today}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            }}
          />
        )
      }



    </View>
  )
}

export default HistoryScreen;

const styles = StyleSheet.create({
  shimmer_container: {
    elevation: 10,
    height: '100%',
    alignSelf: 'center',
  },
  flatList_card_container: {
    elevation: 10,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'white'
  },
  card_touchableOpacity: {
    elevation: 10,
  },
  date_name_text_container: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    justifyContent: 'space-between'
  },
  name_text_container: {
    color: 'black',
    fontWeight: 'bold',
  },
  date_text_container: {
    color: 'black',
    fontWeight: '700',
    opacity: 0.8,
    textAlignVertical: 'center',
  },
  today_text_container: {
    alignSelf: 'center',
  },
  today_label: {
    color: 'black',
    fontWeight: '700',
    opacity: 0.8,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  today_text: {
    color: 'black',
    fontWeight: '700',
    opacity: 0.8,
    textAlign: 'center',
    textAlignVertical: 'center',
  }
})