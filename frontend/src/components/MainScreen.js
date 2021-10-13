import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, SafeAreaView, FlatList, ScrollView, RefreshControl } from "react-native";
import { ListItem, Avatar, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function Main({navigation}) {
  const [platformAccounts, setPlatformAccounts] = useState([])
  const [refreshing, setRefreshing] = React.useState(false);
  const api = React.useContext(ApiContext);

  const refreshPlatformAccounts = async () => {
    setRefreshing(true);
    setPlatformAccounts(await api.getPlatformAccount())
    setRefreshing(false);
  }

  React.useEffect(() => {    
    return navigation.addListener('focus', () => {      
      refreshPlatformAccounts()
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.scrollView}
        data={platformAccounts}
        keyExtractor={(item) => item._id}
        renderItem={({item:{_id, platform, username}}) => 
          <ListItem 
            key={_id}
            bottomDivider
            onPress={() => {
              navigation.navigate("PlatformAccountTab", {platformAccountId: _id})
            }}
          >        
              <Avatar source={require('../../resources/img/instagram-round.png')} />        
              <ListItem.Content>          
                <ListItem.Title>{username}</ListItem.Title>          
                <ListItem.Subtitle>{platform.name}</ListItem.Subtitle>        
              </ListItem.Content>
          </ListItem>
        }
        numColumns={1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPlatformAccounts}
          />
        }
      />
      <Button
        title="test"
        onPress={api.test}
        buttonStyle={{
          margin: 20
        }}
      />
      <Button  
        icon={    
          <Icon     
            name="add"
            size={30}
            color="white"
          /> 
        }
        iconLeft
        title=" Add new account"
        onPress={() => {
          navigation.navigate("NewPlatformAccount")
        }}
        buttonStyle={{
          margin: 20
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: "100%"
  }
});
