import React, {useRef, useState, useEffect, useCallback } from 'react';
import {
  AppState,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Dimensions
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';

export default function JobAddScreen({navigation, route}) {
  const [jobTypes, setJobTypes] = React.useState([]);
  const [jobTypeId, setJobTypeId] = React.useState(null);
  const [targetUsersList, setTargetUsersList] = useState(null);
  const [targetUser, setTargetUser] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const api = React.useContext(ApiContext);
  const {platformAccountId} = route.params;
  const dropdownController = useRef(null)

  useEffect(() => {
    async function fetchJobTypes() {
      const received_jobTypes = await api.fetchJobsTypes(platformAccountId);
      setJobTypes(received_jobTypes);
    }

    fetchJobTypes();
  }, []);

  const getTargetUsersList = useCallback(async q => {
    if (typeof q !== 'string' || q.length < 3) {
      setTargetUsersList(null);
      return;
    }
    setLoading(true);
    const response = await api.searchPlatformAccountUsers(platformAccountId, q);

    const suggestions = response.data.users.map((item) => ({
        id: item.pk,
        title: item.username,
        value: item
    }))
    setTargetUsersList(suggestions)
    setLoading(false)
  }, []);

  return (
    <View style={styles.container}>
      <Text>Add here the information of the new job you want to create</Text>
      <Picker
        selectedValue={jobTypeId}
        style={{height: 50, width: 150}}
        onValueChange={(jobTypeValue, itemIndex) => setJobTypeId(jobTypeValue)}>
        {jobTypes.map(({_id, name}) => (
          <Picker.Item label={name} value={_id} key={_id} />
        ))}
      </Picker>
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
          await api.addJob(platformAccountId, jobTypeId, targetUser);
          navigation.goBack();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
