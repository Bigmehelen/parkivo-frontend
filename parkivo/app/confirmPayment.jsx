import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {useMemo} from 'react';
import { View, Text, Image, Pressable, StyleSheet} from 'react-native';
import { useGetUserQuery } from '../api/userApi.js';

const ConfirmPayment = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { data: userData } = useGetUserQuery();

  const plateNumber = params.plateNumber || "";
  const startDate = params.startDate || "";
  const startTime = params.startTime || "";
  const endDate = params.endDate || "";
  const endTime = params.endTime || "";
  const isPaid = true; 
  const totalAmount = params.amount || 0;

  const qrData = useMemo(() => {
    const data = {
      user: userData?.username, 
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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <View style={{ backgroundColor: 'white', padding: 25, borderRadius: 20, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, elevation: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#10b981' }}>Reservation Confirmed!</Text>
          <Text style={{ color: '#64748b', marginBottom: 20 }}>Show this code to the attendant</Text>
          
          <Image 
            source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrData}` }}
            style={{ width: 200, height: 200, marginBottom: 20 }}
          />

          <View style={{ width: '100%', borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#cbd5e1', paddingTop: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#64748b' }}>Location:</Text>
              <Text style={{ fontWeight: '600' }}>{params.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#64748b' }}>Plate No:</Text>
              <Text style={{ fontWeight: '600' }}>{plateNumber}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#64748b' }}>Valid Until:</Text>
              <Text style={{ fontWeight: '600' }}>{endTime} ({endDate})</Text>
            </View>
          </View>

          <Pressable 
            onPress={() => router.push('/smartpark')} 
            style={[styles.confirmButton, { marginTop: 25, width: '100%' }]}
          >
            <Text style={styles.confirmButtonText}>Close & Return</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return null; 
}

const styles = StyleSheet.create({
  container: {
     flex: 1 
    },
  confirmButton: {
    backgroundColor: '#10b981', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    },
  confirmButtonText: {
     color: 'white', 
     fontWeight: 'bold' 
    }
});

export default ConfirmPayment;