import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {FlatGrid} from 'react-native-super-grid';
import {Icon, Button} from 'react-native-elements';
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
      fake: true,
    },{
      _id: 'fake',
      name: 'More coming soon...',
      description: 'More jobs are being developed and added every day.',
      fake: true,
    },{
      _id: 'fake',
      name: 'More coming soon...',
      description: 'More jobs are being developed and added every day.',
      fake: true,
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

  const addJob = async () => {
    await api.addJob(platformAccountId, selectedJobType._id, targetUser);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={[styles.dropdownContainer, {maxHeight: 200}]}>
        <Text style={styles.dropdownLabel}>Select the job</Text>
        <FlatGrid
        itemDimension={130}
        data={[...jobTypes, ...fake_jobs]}
        style={styles.gridView}
        spacing={10}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.itemContainer,
              {
                borderColor:
                  selectedJobType && selectedJobType._id == item._id
                    ? 'green'
                    : 'white',
              },
            ]}
            onPress={() => !('fake' in item) && setSelectedJobType(item)}>
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
      </View>
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Select the user</Text>
        <View style={styles.dropdownBottomContainer}>
          <Icon name="person" size={24} color="black" />
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
                backgroundColor: 'transparent',
                color: "black"
              },
            }}
            rightButtonsContainerStyle={{
              borderRadius: 25,
              right: 8,
              height: 30,
              top: 10,
              alignSelfs: 'center',
              backgroundColor: 'transparent',
            }}
            inputContainerStyle={{
              backgroundColor: 'transparent',
              borderRadius: 0,
            }}
            suggestionsListContainerStyle={{
              backgroundColor: '#383b42',
            }}
            containerStyle={styles.inputDropdown}
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
        </View>
      </View>
      <Button
        title="Add Job"
        onPress={addJob}
        icon={<Icon name="add" size={15} color="white" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
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
    borderWidth: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  icon: {},
  dropdownContainer: {
    flex: 1,
    color: 'black',
    width: '95%',
    borderBottomWidth: 1,
    borderBottomColor: '#86939e',
    marginBottom: 25,
    maxHeight: 75,
  },
  dropdownBottomContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    flexWrap: 'wrap',
    height: 100,
  },
  dropdownLabel: {
    fontWeight: 'bold',
    color: '#86939e',
    fontFamily: 'sans-serif',
    fontSize: 16,
  },
  inputDropdown: {
    flex: 1,
    color: 'black',
    placeholderTextColor: '#86939e',
    fontSize: 18,
    minHeight: 40,
    flexGrow: 1,
    flexShrink: 1,
    borderRadius: 0,
  },
});
