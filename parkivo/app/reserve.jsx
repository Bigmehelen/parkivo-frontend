import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from '../styles/reserveStyle';
import {useGetUserQuery} from '../api/userApi.js';

const ReserveSpot = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState("12:00");
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [endTime, setEndTime] = useState("14:00");
  const [plateNumber, setPlateNumber] = useState('');
  
  const [isPaid, setIsPaid] = useState(false);

  const webInputStyle = {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: 'white',
    width: '100%',
    outline: 'none',
  };

  const calculation = useMemo(() => {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffInMs = end - start;
    const diffInHours = Math.max(0, diffInMs / (1000 * 60 * 60));
    
    const days = Math.floor(diffInHours / 24);
    const remainingHours = Math.round(diffInHours % 24);
    const serviceCharge = 50;   
    
    const pricePerHour = parseInt(params.pricePerHour || 0);
    const subtotal = Math.ceil(diffInHours) * pricePerHour;
    const totalAmount = subtotal + serviceCharge;

    return {
      totalHours: diffInHours.toFixed(1),
      days,
      remainingHours,
      subtotal,
      totalAmount,
      isValid: diffInMs > 0
    };
  }, [startDate, startTime, endDate, endTime, params.pricePerHour]);

  const handlePayment = () => {
    if (calculation.isValid) {
      setIsPaid(true);
        router.push({
            pathname: '/confirmPayment',
            params: {
                name: params.name,
                area: params.area,
                pricePerHour: params.pricePerHour,
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime,
                plateNumber: plateNumber,
                totalAmount: calculation.totalAmount
            }
        });
  }
  };

//   const handleCancel = () => {
//     setIsPaid(false);
//     router.back();
//   };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}> ← Back</Text>
          </Pressable>
          <Text style={styles.title}>Confirm Reservation</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.label}>SELECTED LOCATION</Text>
          <Text style={styles.spotName}>{params.name}</Text>
          <Text style={styles.spotArea}>📍 {params.area}</Text>
          <Text style={styles.spotPrice}>₦{params.pricePerHour} per hour</Text>
          <Text style={styles.username}>{useGetUserQuery().data?.username}</Text>
        </View>

        <Text style={[styles.inputLabel, {marginTop: 10}]}>Arrival (Start)</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
          <View style={{ flex: 2 }}>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={webInputStyle} />
          </View>
          <View style={{ flex: 1 }}>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={webInputStyle} />
          </View>
        </View>

        <Text style={styles.inputLabel}>Departure (End)</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <View style={{ flex: 2 }}>
            <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} style={webInputStyle} />
          </View>
          <View style={{ flex: 1 }}>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={webInputStyle} />
          </View>
        </View>

        <Text style={styles.inputLabel}>Vehicle Plate Number</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g. KJA-123AA"
          value={plateNumber}
          onChangeText={setPlateNumber}
        />

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Duration</Text>
            <Text style={styles.totalValue}>{calculation.days > 0 ? `${calculation.days}d ` : ''}{calculation.remainingHours}h total</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total Amount</Text>
            <Text style={styles.grandTotalValue}> Service Charge: ₦50 </Text>
            <Text style={styles.grandTotalValue}>₦{calculation.isValid ? calculation.totalAmount : 0}</Text>
          </View>
        </View>

        <Pressable 
          disabled={!calculation.isValid}
          style={[styles.confirmButton, !calculation.isValid && {backgroundColor: '#ccc'}]}
          onPress={handlePayment}
        >
          <Text style={styles.confirmButtonText}>Confirm & Pay Now</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ReserveSpot;