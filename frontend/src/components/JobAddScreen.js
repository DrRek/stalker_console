import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker'

export default function JobAddScreen({navigation, route}) {
  const [jobTypes, setJobTypes] = React.useState([])
  const [jobTypeId, setJobTypeId] = React.useState(null)
  const api = React.useContext(ApiContext);
  const { platformAccountId } = route.params

  useEffect(() => {
    async function fetchJobTypes() {
      const received_jobTypes = await api.fetchJobsTypes(platformAccountId);
      setJobTypes(received_jobTypes);
    }

    fetchJobTypes();
  }, [])

  return (
    <View style={styles.container}>
      <Text>Add here the information of the new job you want to create</Text>
      <Picker
        selectedValue={jobTypeId}
        style={{ height: 50, width: 150 }}
        onValueChange={(jobTypeValue, itemIndex) => setJobTypeId(jobTypeValue)}
      >
        {
          jobTypes.map(({_id, name}) => (
            <Picker.Item label={name} value={_id} key={_id}/>
          ))
        }
      </Picker>
      <Button
        title="Add Job"
        onPress={async () => {
          await api.addJob(platformAccountId, jobTypeId)
          navigation.goBack()
        }}
      /> 
    </View>
  );
};

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
  }
});
