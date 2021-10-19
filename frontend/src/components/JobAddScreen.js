import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {FlatGrid} from 'react-native-super-grid';
import {Icon} from 'react-native-elements';
import {showTip, Tip} from 'react-native-tip';

export default function JobAddScreen({navigation, route}) {
  const [jobTypes, setJobTypes] = React.useState([]);
  const [selectedJobType, setSelectedJobType] = React.useState(null);
  const [targetUsersList, setTargetUsersList] = useState(null);
  const [targetUser, setTargetUser] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const api = React.useContext(ApiContext);
  const {platformAccountId} = route.params;
  const dropdownController = useRef(null);
  const [_showTip, setShowTip] = React.useState(true);

  useEffect(() => {
    async function fetchJobTypes() {
      const received_jobTypes = await api.fetchJobsTypes(platformAccountId);
      setJobTypes(received_jobTypes);
    }

    fetchJobTypes();
  }, []);

  const fake_jobs = [
    {
      _id: 'fake',
      name: 'More coming soon...',
      description: 'More jobs are being developed and added every day.',
      fake: true
    },
  ];

  const getTargetUsersList = useCallback(async q => {
    if (typeof q !== 'string' || q.length < 3) {
      setTargetUsersList(null);
      return;
    }
    setLoading(true);
    const response = await api.searchPlatformAccountUsers(platformAccountId, q);

    const suggestions = response.data.users.map(item => ({
      id: item.pk,
      title: item.username,
      value: item,
    }));
    setTargetUsersList(suggestions);
    setLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Add here the information of the new job you want to create</Text>
      <FlatGrid
        itemDimension={130}
        data={[...jobTypes, ...fake_jobs]}
        style={styles.gridView}
        spacing={10}
        renderItem={({item}) => (
          <TouchableOpacity style={[styles.itemContainer, {borderColor: selectedJobType && selectedJobType._id == item._id ? "red" : "white"}]}
          onPress={()=> !("fake" in item) && setSelectedJobType(item)}>
            <Tip
              id={item._id}
              title="Description"
              body={item.description}
              showItemPulseAnimation
              pulseColor="#ff8080"
              active={false}>
              <Icon
                color="#555"
                name="info"
                onPress={() => {
                  showTip(item._id);
                }}
              />
            </Tip>
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <AutocompleteDropdown
        controller={controller => {
          dropdownController.current = controller;
        }}
        dataSet={targetUsersList}
        onChangeText={getTargetUsersList}
        onSelectItem={item => {
          item && setTargetUser(item.value);
        }}
        debounce={600}
        suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
        // onClear={onClearPress}
        //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
        // onOpenSuggestionsList={onOpenSuggestionsList}
        loading={loading}
        useFilter={false} // prevent rerender twice
        textInputProps={{
          placeholder: 'Type 3+ letters',
          autoCorrect: false,
          autoCapitalize: 'none',
          style: {
            borderRadius: 25,
            backgroundColor: '#383b42',
            color: '#fff',
            paddingLeft: 18,
          },
        }}
        rightButtonsContainerStyle={{
          borderRadius: 25,
          right: 8,
          height: 30,
          top: 10,
          alignSelfs: 'center',
          backgroundColor: '#383b42',
        }}
        inputContainerStyle={{
          backgroundColor: 'transparent',
        }}
        suggestionsListContainerStyle={{
          backgroundColor: '#383b42',
        }}
        containerStyle={{flexGrow: 1, flexShrink: 1}}
        renderItem={(item, text) => (
          <Text style={{color: '#fff', padding: 15}}>{item.title}</Text>
        )}
        /*ChevronIconComponent={
          <Feather name="x-circle" size={18} color="#fff" />
        }
        ClearIconComponent={
          <Feather name="chevron-down" size={20} color="#fff" />
        }*/
        inputHeight={50}
        showChevron={false}
        //  showClear={false}
      />
      <Button
        title="Add Job"
        onPress={async () => {
          await api.addJob(platformAccountId, selectedJobType._id, targetUser);
          navigation.goBack();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  gridView: {
    flex: 1,
    width: '95%',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  itemContainer: {
    justifyContent: 'space-between',
    borderRadius: 5,
    padding: 7,
    height: 70,
    backgroundColor: '#eee',
    borderWidth: 1
  },
  itemName: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  icon: {
  },
});
