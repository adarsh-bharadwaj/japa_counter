import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useWindowPercentage } from "../../customHooks/useWindowPercentage";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { colorConfig, config } from "../../config/config";

const SettingsScreen = () => {
  const isDarkMode = useColorScheme();
  const { wp, hp, fontScale } = useWindowPercentage();
  const [selectLanguageModal, setSelectLanguageModal] = useState(false);
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const [data, setData] = useState([
    {
      title: t('Language')
    }
  ]);
  useEffect(() => {
    navigation.setOptions({
      title: t('Language')
    })
  }, [])
  const langData = [{ text: "English", code: "en" }, { text: "Hindi", code: "hi" }, { text: "Kannada", code: "kn" }]
  console.log(i18n.language);
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => setSelectLanguageModal(true)}
              style={[styles.card_container, {
                width: wp(90),
                paddingLeft: wp(2),
                marginVertical: hp(1),
                borderRadius:5,
                backgroundColor:isDarkMode=='dark'?colorConfig.CARD_DARK_BACKGROUND_COLOR:colorConfig.CARD_BACKGROUND_COLOR
              }]}>
              <Text
                style={[styles.title_text, {
                  fontSize: 20 * fontScale,
                  marginBottom: hp(1),
                  textAlignVertical:'center',
                  color:isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR
                }]}
              >{item.title}</Text>
            </TouchableOpacity>
          )
        }}
      />
      {selectLanguageModal && (
        <>
          <TouchableOpacity
            onPress={() => setSelectLanguageModal(false)}
            style={[styles.modal_background, {
              height: hp(100),
              width: wp(100),
            }]}>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flatList_container, { width: wp(50),
              backgroundColor:isDarkMode=='dark'?colorConfig.CARD_DARK_BACKGROUND_COLOR:colorConfig.CARD_BACKGROUND_COLOR
             }]}>
            <FlatList
              data={langData}
              keyExtractor={(i, index) => index.toString()}
              renderItem={({ item: rec, index }) => {
                return (
                  <Pressable
                    onPress={async () => {
                      i18n.changeLanguage(rec.code);
                      setSelectLanguageModal(false)
                      await AsyncStorage.setItem("language", rec.code);
                    }}
                    style={[styles.pressable, {
                      marginVertical: hp(2),
                      marginHorizontal: wp(5),
                      paddingHorizontal: wp(5),
                      color:isDarkMode=='dark'?colorConfig.CARD_DARK_BACKGROUND_COLOR:colorConfig.CARD_DARK_BACKGROUND_COLOR
                    }]}>
                    <Text style={{
                      color: isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR,
                      fontSize: 20 * fontScale
                    }}>{rec.text}</Text>
                    {i18n.language == rec.code && (
                      <Text style={{
                        color: isDarkMode=='dark'?colorConfig.DARK_TEXT_COLOR:colorConfig.TEXT_COLOR,
                        fontSize: 20 * fontScale
                      }}>✔</Text>
                    )}

                  </Pressable>
                )
              }}
            />

          </TouchableOpacity>
        </>
      )}

    </View>
  )
}

export default SettingsScreen;

const styles = StyleSheet.create({
  card_container: {
    alignSelf: 'center',
    borderColor: 'black',
    borderBottomWidth: 1
  },
  title_text: {
    color: 'black',
  },
  modal_background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.4,
    backgroundColor: 'black'
  },
  flatList_container: {
    backgroundColor: 'white',
    borderRadius: 10,
    opacity: 1,
    alignSelf: 'center'
  },
  pressable: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
})