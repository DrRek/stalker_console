import React, {useRef, useState, useEffect} from 'react';
import {
  AppState,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {ListItem, Avatar, Button, Icon} from 'react-native-elements';

export default function Main({navigation}) {
  const [platformAccounts, setPlatformAccounts] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const api = React.useContext(ApiContext);

  const refreshPlatformAccounts = async () => {
    setRefreshing(true);
    setPlatformAccounts(await api.getPlatformAccount());
    setRefreshing(false);
  };

  React.useEffect(() => {
    return navigation.addListener('focus', () => {
      refreshPlatformAccounts();
    });
  }, [navigation]);

  const deletePlatformAccount = async platformAccountId => {
    setRefreshing(true);
    await api.delPlatformAccount(platformAccountId)
    refreshPlatformAccounts();
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.scrollView}
        data={platformAccounts}
        keyExtractor={item => item._id}
        renderItem={({item: {_id, platform, username}}) => (
          <ListItem.Swipeable
            key={_id}
            bottomDivider
            rightContent={
              <Button
                title="Delete"
                icon={{name: 'delete', color: 'white'}}
                buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
                onPress={() => deletePlatformAccount(_id)}
              />
            }
            onPress={() => {
              navigation.navigate('PlatformAccountTab', {
                platformAccountId: _id,
              });
            }}>
            <Avatar
              source={require('../../resources/img/instagram-round.png')}
            />
            <ListItem.Content>
              <ListItem.Title>{username}</ListItem.Title>
              <ListItem.Subtitle>{platform.name}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem.Swipeable>
        )}
        numColumns={1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPlatformAccounts}
          />
        }
        ListFooterComponent={
          <Icon
            reverse
            raised
            name="add"
            onPress={() => {
              navigation.navigate('NewPlatformAccount');
            }}
            color="#2089dc"
          />
        }
        ListFooterComponentStyle={styles.listfootercomponent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listfootercomponent: {
    marginTop: 20,
    flex: 1,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
});
