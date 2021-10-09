import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button } from "react-native";

const axios = require('axios');

export default function App() {

  const handleWebSocket = async () => {
    var ws = new WebSocket('ws://192.168.1.86:8084');
    ws.onopen = () => {console.log("connection open")}
    ws.onmessage = async ({data}) => { 
      console.log(data)
      console.log(-2)
      const { method, url, rawHeaders, data:postData, id } = JSON.parse(data)

      console.log(rawHeaders.length)
      const headers = {}
      for (let i = 0; i < rawHeaders.length-1; i+=2){
        headers[rawHeaders[i]] = rawHeaders[i+1]
      }
      headers["accept-encoding"] = "gzip, deflate"
      console.log(headers["accept-encoding"])
      console.log(url)
      console.log(method)
      console.log(headers)
      const response = await axios.request({
        method: method,
        url: "https://i.instagram.com"+url,
        data: postData,
        headers: headers,
        decompress: false
      });
      console.log(2)
      console.log(response.data)

      ws.send(JSON.stringify({
        "id": id,
        "data": response.data,
        "headers": response.headers,
        "status": response.status
      }))

      console.log(response.data)
      console.log(response.headers)
      console.log(response.status)
    }
  }

  useEffect(() => {
    handleWebSocket()
  }, [])

  return (
    <View style={styles.container}>
      <Button 
        onPress={ handleWebSocket() }
        title="refresh"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
