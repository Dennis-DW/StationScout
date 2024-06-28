import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../utils/Colors';

const Header = () => {
    const { user } = useUser();

    return (
        <View style={styles.container}>
            {user?.imageUrl && (
                <Image 
                    source={{ uri: user.imageUrl }} 
                    style={styles.userImage} 
                />
            )}
            <View style={styles.logoContainer}>
                <Image 
                    source={require('../../../assets/images/logoHome.png')} 
                    style={styles.logo} 
                />
            </View>
            <FontAwesome name="globe" size={32} color="black" style={styles.filterIcon} />
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 55,
    },
    userImage: {
        width: 38,
        height: 38,
        borderRadius: 19,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        left: '50%',
        transform: [{ translateX: -50 }],
    },
    logo: {
        width: 140,
        height: 200,
        resizeMode: 'contain',
    },
    filterIcon: {
        marginLeft: 'auto',
    },
});
