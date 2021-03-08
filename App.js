
import { StatusBar, setStatusBarBackgroundColor } from 'expo-status-bar';
import React from 'react';
import { TextInput, Text, View, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { styles, colors } from './Styles';
import firebase from 'firebase';
import '@firebase/firestore';
import { firebaseConfig } from './Secrets.js';



// Initialize Firebase and get references
if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const invCollRef = db.collection('hw4Assignment');
const Stack = createStackNavigator();
const appName = "ListMaker 2000";


let appInventory = [];




class HomeScreen extends React.Component {

  constructor(props) {
    super(props);

    console.log("in HomeScreen, route.params = ", props.route.params);

    this.nextKey = 0;
    this.state = {
      theList: []
    }
    this.getInventory();

    
  }
  getInventory = async () => {  //gets firebase collection and sets it to this.state.theList
    appInventory = [];
    let qSnap = await invCollRef.get();
    qSnap.forEach(qDocSnap => {
      let data = qDocSnap.data();
      data.key = qDocSnap.id;
      appInventory.push(data);
    });
    this.setState({theList:appInventory})
  }

  componentDidMount() {
    this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
    // console.log("did mount"); test code

  }

  componentWillUnmount() {
    this.focusUnsubscribe();
  }
  
 
  onFocus = () => {
    if (this.props.route.params) {
      const {operation, item} = this.props.route.params;
      if (operation === 'add') {
        this.addItem(item.text);
      } else if (operation === 'edit') {
        this.updateItem(item.key, item.text);
      } 
    }
    this.props.navigation.setParams({operation: 'none'});
  }


 
  //adds item to firebase and updates this.state.theList
  addItem = async (itemText) => {
    if (itemText) { // false if undefined
      let docRef = await invCollRef.add({text:itemText});
      appInventory.push({text: itemText, key: docRef.id});
    }  
    this.setState({theList:appInventory});
  }

  //updates existing item to firebase and updates this.state.theList
  updateItem = async (itemKey, itemText) => {
    let docRef = invCollRef.doc(itemKey);
    await docRef.update({text:itemText});

    let foundIndex = -1;
    for (let idx in appInventory) {
      if (appInventory[idx].key === itemKey) {
        foundIndex = idx;
        break;
      }
    }
    if (foundIndex !== -1) { // silently fail if item not found
      itemText.key = itemKey;
      appInventory[foundIndex].text = itemText;
    }
    this.setState({theList: appInventory});
  }

  deleteItem = async (itemKey) => {
    let docRef = invCollRef.doc(itemKey);
    await docRef.delete();

    let foundIndex = -1;
    for (let idx in appInventory) {
      if (appInventory[idx].key === itemKey) {
        foundIndex = idx;
        break;
      }
    }
    if (foundIndex !== -1) { // silently fail if item not found
      appInventory.splice(foundIndex, 1); // remove one element 
    }
    this.setState({theList: appInventory});
  }

  onDelete = (itemKey) => {
    this.deleteItem(itemKey);
  }

  onEdit = (item) => {
    this.props.navigation.navigate("Detail", {
      operation: 'edit',
      item: item
    });
  }
  
  emptyListComponent = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Text>
        Nothing in your list.</Text>
        <Text>Tap "+" below to add something!</Text>
     </View>);
  }



  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {appName}
          </Text>
        </View>
        <View style={styles.body}>
          <View style={styles.listContainer}>
            
            <FlatList
              data={this.state.theList}
              ItemSeparatorComponent={()=>(
                <View style={styles.separator}
                />
              )}
              ListEmptyComponent={this.emptyListComponent}
            
              renderItem={({item})=>{
                return(
                  <View style={styles.listItemContainer}>
                    <View style={styles.listItemTextContainer}> 
                      <Text style={styles.listItemText}>
                        {item.text}
                      </Text> 
                    </View>
                    <View style={styles.listItemButtonContainer}>
                      <Ionicons name="md-create" 
                        size={24} 
                        color={colors.primaryDark}
                        onPress={()=>{this.onEdit(item)}} />
                      <Ionicons name="md-trash" 
                        size={24} 
                        color={colors.primaryDark}

                        /*Confirmation dialog is displayed when the user tries to 
                          delete an item, and the delete only occurs if the user
                          confirms the operation*/

                        onPress={()=>{
                          Alert.alert(   
                            'Delete Item?',
                            `Are you sure you want to delete "${item.text}"?` ,
                            [
                              {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel'
                              },
                              { text: 'Delete', 
                                onPress: () => {
                                  this.onDelete(item.key)
                                  console.log('Delete Pressed') }}
                            ],
                            { cancelable: false }
                          );
                          }} />
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={()=>
              this.props.navigation.navigate('Detail', 
                {operation: "add"})}>
            <Ionicons name="md-add-circle" 
              size={80} 
              color={colors.primaryDark} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class DetailScreen extends React.Component {

  constructor(props) {
    super(props);

    this.operation = this.props.route.params.operation;

    let initText = '';
    if (this.operation === 'edit') {
      initText = this.props.route.params.item.text;
    }

    this.state = {
      inputText: initText
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {appName}
          </Text>
        </View>
        <View style={styles.body}>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>
              {this.operation === 'add'? "Add" : "Edit"} Item</Text>
            <TextInput
              placeholder='Enter item text'
              style={styles.textInputBox}
              onChangeText={(text) => this.setState({inputText: text})}
              value={this.state.inputText}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerButtonContainer}>
            <TouchableOpacity 
              style={styles.footerButton}
              onPress={()=>{this.props.navigation.navigate("Home")}}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            /* save button is visually greyed out and disabled when there is no
               text in the details screen text box. */
              style={this.state.inputText ? styles.footerButton : styles.footerButtonDisabled}
              disabled={this.state.inputText ? false : true}
              onPress={()=>{
                let theItem = {};
                if (this.operation === 'add') {
                  theItem = {
                    text: this.state.inputText,
                    key: -1 // placeholder for "no ID"
                  }
                } else { // operation === 'edit'
                  theItem = this.props.route.params.item;
                  theItem.text = this.state.inputText;
                }
                this.props.navigation.navigate("Home", {
                  operation: this.operation,
                  item: theItem
                });
              }}>
              <Text style={styles.footerButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"   
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
