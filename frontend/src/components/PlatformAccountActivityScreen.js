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

export default function PlatformAccountActivityScreen({
  platformAccountId,
  navigation,
}) {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const api = React.useContext(ApiContext);

  const refreshEvents = async () => {
    setRefreshing(true);
    setEvents(await api.getEvent(platformAccountId));
    setRefreshing(false);
  };

  React.useEffect(() => {
    refreshEvents();
  }, []);

  const deleteEvent = async eventId => {
    setRefreshing(true);
    await api.delEvent(platformAccountId, eventId)
    refreshEvents();
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.scrollView}
        data={events}
        keyExtractor={item => item._id}
        renderItem={({item: {_id, job, name, description, img, createdAt}}) => (
          <ListItem.Swipeable
            key={_id}
            bottomDivider
            onPress={() => {}}
            rightContent={
              <Button
                title="Delete"
                icon={{name: 'delete', color: 'white'}}
                buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
                onPress={() => deleteEvent(_id)}
              />
            }
            >
            <Avatar
              rounded
              size={45}
              source={{uri: job && job.target_item && job.target_item.profile_pic_url}}
            >
              <Avatar.Accessory
                size={30}
                source={{uri: img}}
              />
            </Avatar>
            <ListItem.Content>
              <ListItem.Title>{description}</ListItem.Title>
              <ListItem.Subtitle>
                {`Discoved at ${createdAt}`}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem.Swipeable>
        )}
        numColumns={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshEvents} />
        }
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
