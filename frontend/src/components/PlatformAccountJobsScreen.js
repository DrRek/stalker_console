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

export default function PlatformAccountJobsScreen({
  platformAccountId,
  navigation,
}) {
  const [jobs, setJobs] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const api = React.useContext(ApiContext);

  const refreshJobs = async () => {
    setRefreshing(true);
    setJobs(await api.getJob(platformAccountId));
    setRefreshing(false);
  };

  React.useEffect(() => {
    return navigation.addListener('focus', () => {
      refreshJobs();
    });
  }, [navigation]);

  const deleteJob = async jobId => {
    setRefreshing(true);
    await api.delJob(platformAccountId, jobId)
    refreshJobs();
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.scrollView}
        data={jobs}
        keyExtractor={item => item._id}
        renderItem={({item: {_id, type, target_item}}) => (
          <ListItem.Swipeable
            key={_id}
            bottomDivider
            onPress={() => {
              api.runJob(platformAccountId, _id);
            }}
            rightContent={
              <Button
                title="Delete"
                icon={{name: 'delete', color: 'white'}}
                buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
                onPress={() => deleteJob(_id)}
              />
            }
            >
            <Avatar
              rounded
              size={45}
              source={{uri: target_item && target_item.profile_pic_url}}
            >
              <Avatar.Accessory
                size={20}
                source={require('../../resources/img/instagram-round.png')}
              />
            </Avatar>
            <ListItem.Content>
              <ListItem.Title>{type.name}</ListItem.Title>
              <ListItem.Subtitle>
                on user: {target_item && target_item.username}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem.Swipeable>
        )}
        numColumns={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshJobs} />
        }
        ListFooterComponent={
          <Icon
            reverse
            raised
            name="add"
            onPress={() => {
              navigation.navigate('NewJob', {
                platformAccountId,
              });
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
