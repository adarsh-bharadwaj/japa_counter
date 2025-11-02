import { Text, TouchableOpacity } from "react-native"
import { useWindowPercentage } from "../customHooks/useWindowPercentage";
import { colorConfig } from "../config/config";
import { StyleSheet } from "react-native";

const CustomButton = ({ btnTitle = 'Button', width = 90, onPress = () => { } }) => {
    const { wp, hp } = useWindowPercentage();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button_container, {
                width: wp(width),
                marginTop: hp(2),
                height: hp(5),
            }]}>
            <Text style={styles.button_title}>{btnTitle}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton;

const styles = StyleSheet.create({
    button_container: {
        borderRadius: 10,
        alignSelf: 'center',
        elevation: 10,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colorConfig.BUTTON_BACKGROUND_COLOR
    },
    button_title: {
        width: '100%',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: colorConfig.BUTTON_TEXT_COLOR
    }
})