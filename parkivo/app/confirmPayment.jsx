import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {useMemo} from 'react';
import { View, Text, Image, Pressable} from 'react-native';
import styles from '../styles/confirmPaymentStyle';
import {useSelector} from 'react-redux';

const ConfirmPayment = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user = useSelector((state) => state.auth.user);

  const plateNumber = params.plateNumber || "";
  const startDate = params.startDate || "";
  const startTime = params.startTime || "";
  const endDate = params.endDate || "";
  const endTime = params.endTime || "";
  const isPaid = true; 
  const totalAmount = params.amount || 0;

  const qrData = useMemo(() => {
    const data = {
      user: user?.username, 
      spot: params.name,
      plate: plateNumber,
      arrival: `${startDate} ${startTime}`,
      departure: `${endDate} ${endTime}`,
      paid: true,
      amount: totalAmount
    };
    return encodeURIComponent(JSON.stringify(data));
  }, [userData, params, isPaid]); 

  if (isPaid) {
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Text style={styles.reservationText}>Reservation Confirmed!</Text>
          <Text style={styles.headerText}>Show this code to the attendant</Text>
          
          <Image 
            source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrData}` }}
            style={styles.qrImage}
          />

          <View style={styles.detailsContainer}>
            <View style={styles.boxStyle}>
              <Text style={styles.colorStyle}>Guest Name:</Text>
              <Text style={styles.textStyle}>{userData?.username}</Text>
            </View>
            <View style={styles.boxStyle}>
              <Text style={styles.colorStyle}>Location:</Text>
              <Text style={styles.textStyle}>{params.name}</Text>
            </View>
            <View style={styles.boxStyle}>
              <Text style={styles.colorStyle}>Plate No:</Text>
              <Text style={styles.textStyle}>{plateNumber}</Text>
            </View>
            <View style={styles.boxStyle}>
              <Text style={styles.colorStyle}>Valid Until:</Text>
              <Text style={styles.textStyle}> ({endDate}) {endTime}</Text>
            </View>
          </View>

          <Pressable 
            onPress={() => router.push('/smartpark')} 
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>Close & Return</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

export default ConfirmPayment;