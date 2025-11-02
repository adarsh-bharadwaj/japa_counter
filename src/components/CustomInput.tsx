import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useWindowPercentage } from "../customHooks/useWindowPercentage";
import { colorConfig } from "../config/config";

const CustomInput = ({
    width = 90,
    height = 6,
    placeholder = 'Input',
    label = "",
    containerStyle = {},
    inputStyle = {},
    onChangeText = (val: string) => { },
    ...props
}) => {
    const { hp, wp, fontScale } = useWindowPercentage()
    return (
        <View>
            {label && (
                <View>
                    <Text style={{
                        color:'black',
                        fontWeight:'bold',
                        fontSize:18*fontScale
                    }}>
                        {label}
                    </Text>
                </View>
            )}
            <View>
                <TouchableOpacity style={[{
                    borderWidth: 0.5,
                    width: wp(width),
                    height: hp(height),
                    elevation: 5,
                    borderRadius: 10,
                    marginVertical: hp(2),
                    borderColor: colorConfig.BORDER_COLOR
                }, containerStyle]}>
                    <TextInput
                        {...props}
                        placeholderTextColor={'grey'}
                        placeholder={placeholder}
                        onChangeText={onChangeText}
                        style={[{
                            color: 'black',
                            borderRadius: 10,
                            backgroundColor: 'white',
                            fontSize: 18 * fontScale,
                            paddingHorizontal: 10

                        }, inputStyle]} />
                </TouchableOpacity>
            </View>

        </View>

    )
}

export default CustomInput;