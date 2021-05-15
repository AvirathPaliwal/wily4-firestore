import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native'
import * as Permissions from 'expo-permissions'
import { BarCodeScanner } from 'expo-barcode-scanner'
import firebase from 'firebase'
import db from '../config'
export default class Transaction extends Component {
    constructor() {
        super();
        this.state = {
            hasCameraPermission: null,
            scanned: false,
            scannedData: '',
            buttonState: 'normal',
            scannedBookId: '',
            scannedStudentId: '',
            transactionMessage: ''
        }
    }
    handleBarCodeScanner = async ({ type, data }) => {
        // this.setState({
        //     scanned: true,
        //     scannedData: data,
        //     buttonState: 'normal',
        // })
        const { buttonState } = this.state
        if (buttonState === 'BookId') {
            this.setState({
                scanned: true,
                scannedBookId: data,
                buttonState: 'normal'
            })
        }
        else if (buttonState) {
            this.setState({
                scanned: true,
                scannedStudentId: data,
                buttonState: 'normal'

            })
        }
    }
    getCameraPerissions = async (id) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        this.setState({
            hasCameraPermission: status === "granted",
            scanned: false,
            buttonState: id
        })
    }
    handleTransaction = async () => {
        console.log("Demo")
        var transactionMsg = null;
        db.collection("books").doc(this.state.scannedBookId).get()
            .then((doc) => {
                console.log(doc.data())
                var book = doc.data();
                if (book.bookAvailability) {
                    this.initiateBookIssue();
                    transactionMsg = "Book Issued"
                }
                else {
                    this.initiateBookReturn();
                    transactionMsg = "Book returned";
                }
            })
        this.setState({
            transactionMessage: transactionMsg
        })

    }
    initiateBookIssue = async () => {
        db.collection("transation").add({
            'studentId': this.state.scannedStudentId,
            'bookId': this.state.scannedBookId,
            'date': firebase.firestore.Timestamp.now().toDate(),
            'transationType': 'Issue'
        })
        db.collection("books").doc(this.state.scannedBookId).update({
            'bookAvailability': false
        })
        db.collection('students').doc(this.state.scannedStudentId).update({
            'noOfBooksIssued': firebase.firestore.FieldValue.increment(1)
        })
        Alert.alert('book issued')
        this.setState({
            scannedStudentId: '',
            scannedBookId: ''
        })
    }
    initiateBookReturn = async () => {
        db.collection("transation").add({
            'studentId': this.state.scannedStudentId,
            'bookId': this.state.scannedBookId,
            'date': firebase.firestore.Timestamp.now().toDate(),
            'transationType': 'Return'
        })
        db.collection("books").doc(this.state.scannedBookId).update({
            'bookAvailability': true
        })
        db.collection('students').doc(this.state.scannedStudentId).update({
            'noOfBooksIssued': firebase.firestore.FieldValue.increment(-1)
        })
        Alert.alert('book returned')
        this.setState({
            scannedStudentId: '',
            scannedBookId: ''
        })
    }
    render() {
        const hasCameraPermission = this.state.hasCameraPermission
        const scanned = this.state.scanned
        const buttonState = this.state.buttonState
        if (buttonState !== 'normal' && hasCameraPermission) {
            return (
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanner}
                    style={StyleSheet.absoluteFillObject} />
            )
        }
        else if (buttonState === 'normal') {
            return (
                <View style={styles.container}>
                    <View>
                        <Image
                            source={require('../assets/booklogo.jpg')}
                            style={{ width: 200, height: 200 }}
                        />
                        <Text style={{ textAlign: 'center', fontsize: 30 }}>WILY</Text>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder='bookid'
                            value={this.state.scannedBookId}
                            style={styles.inputBox}
                        />
                        <TouchableOpacity style={styles.scanButton} onPress={() => {
                            this.getCameraPerissions('BookId')
                        }}>
                            <Text style={styles.buttonText}>
                                SCAN
                              </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder='studentid'
                            value={this.state.scannedStudentId}
                            style={styles.inputBox}
                        />
                        <TouchableOpacity style={styles.scanButton} onPress={() => {
                            this.getCameraPerissions('StudentId')
                        }}>
                            <Text style={styles.buttonText}>
                                SCAN
                              </Text>
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={ () => {
                      this.handleTransaction()
                    }}>
                        <Text style={styles.submitButtonText}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    displayText: {
        fontSize: 15,
        textDecorationLine: 'underline'
    },
    scanButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        margin: 10
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10
    },
    inputView: {
        flexDirection: 'row',
        margin: 20
    },
    inputBox: {
        width: 200,
        height: 40,
        borderWidth: 1.5,
        borderRightWidth: 0,
        fontSize: 20
    },
    scanButton: {
        backgroundColor: '#66BB6A',
        width: 50,
        borderWidth: 1.5,
        borderLeftWidth: 0
    },
    submitButton: {
        backgroundColor: '#FBC02D',
        width: 170,
        height: 40,
        borderRadius: 10
    },
    submitButtonText: {
        padding: 10,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "bold",
        color: 'white'
    }
});