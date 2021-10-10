import AsyncStorage from '@react-native-async-storage/async-storage';

const deviceStorage = {
    async saveItem(key, value) {
        try {
            console.log(`${key} ${value}`)
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    },
    async getItem(key) {
        try{
            return await AsyncStorage.getItem(key)
        } catch {
            return null
        }
    },
    removeItem(key) {
        try{
            return AsyncStorage.removeItem(key)
        } catch {
            return null
        }
    }
};

export default deviceStorage;