import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import styles from '../styles/reserveStyle';
import { useGetUserQuery } from '../api/userApi.js';

const ReserveSpot = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { data: userData } = useGetUserQuery();

  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000));
  const [plateNumber, setPlateNumber] = useState('');
  const [picker, setPicker] = useState({ show: false, mode: 'date', target: 'start' });

  const formatDate = (date) => (date && !isNaN(date.getTime())) ? date.toISOString().split('T')[0] : "";
  const formatTime = (date) => (date && !isNaN(date.getTime())) ? date.toTimeString().slice(0, 5) : "";

  const onPickerChange = (event, selectedDate) => {
    if (Platform.OS !== 'ios') setPicker(prev => ({ ...prev, show: false }));
    if (!selectedDate) return;

    if (picker.target === 'start') {
      setStartDateTime(selectedDate);
      if (selectedDate >= endDateTime) {
        const nextHour = new Date(selectedDate.getTime() + 60 * 60 * 1000);
        setEndDateTime(nextHour);
      }
    } else {
      setEndDateTime(selectedDate);
    }
  };

  const WebInput = ({ type, target }) => {
    const currentVal = target === 'start' ? startDateTime : endDateTime;
    const value = type === 'date' ? formatDate(currentVal) : formatTime(currentVal);

    let minVal = undefined;
    if (type === 'date') {

        minVal = target === 'start' ? formatDate(new Date()) : formatDate(startDateTime);
    } else if (type === 'time') {
        const todayStr = formatDate(new Date());
        const arrivalDateStr = formatDate(startDateTime);
        const selectedDateStr = formatDate(currentVal);

        if (target === 'start' && selectedDateStr === todayStr) {

            minVal = formatTime(new Date());
        } else if (target === 'end' && selectedDateStr === arrivalDateStr) {

            minVal = formatTime(startDateTime);
        }
    }

    if (Platform.OS === 'web') {
      return (
        <input 
          type={type} 
          value={value} 
          min={minVal} 
          onChange={(e) => {
            const val = e.target.value;
            if (!val) return;
            const newDate = new Date(currentVal);
            if (type === 'date') {
              const [y, m, d] = val.split('-');
              newDate.setFullYear(parseInt(y), parseInt(m) - 1, parseInt(d));
            } else {
              const [hh, mm] = val.split(':');
              newDate.setHours(parseInt(hh), parseInt(mm));
            }

            if (target === 'start') {
              setStartDateTime(newDate);
              if (newDate >= endDateTime) {
                setEndDateTime(new Date(newDate.getTime() + 60 * 60 * 1000));
              }
            } else {
              setEndDateTime(newDate);
            }
          }} 
          style={webInputStyle} 
        />
      );
    }

    return (
      <Pressable 
        onPress={() => setPicker({ show: true, mode: type, target })}
        style={[styles.inputStyle, { justifyContent: 'center', height: 48 }]}
      >
        <Text style={{ color: '#000' }}>{value}</Text>
      </Pressable>
    );
  };

  const webInputStyle = {
    padding: '12px', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0',
    fontSize: '14px', 
    backgroundColor: 'white', 
    width: '100%', 
    height: '48px', 
    outline: 'none' 
  };

  const calculation = useMemo(() => {
    const diffInMs = endDateTime.getTime() - startDateTime.getTime();

    if (diffInMs <= 0) {
      return { totalHours: "0.0", days: 0, remainingHours: 0, subtotal: 0, totalAmount: 0, isValid: false };
    }

    const totalHoursRaw = diffInMs / (1000 * 60 * 60); 
    const totalHoursToBill = Math.ceil(totalHoursRaw); 

    const days = Math.floor(totalHoursRaw / 24);
    const remainingHours = Math.floor(totalHoursRaw % 24);

    const serviceCharge = 50;
    const pricePerHour = Number(params.pricePerHour) || 0;

    const subtotal = totalHoursToBill * pricePerHour;
    const totalAmount = subtotal + serviceCharge;

    return {
      totalHours: totalHoursRaw.toFixed(1),
      days,
      remainingHours,
      subtotal,
      totalAmount,

      isValid: startDateTime >= new Date(Date.now() - 300000) && endDateTime > startDateTime
    };
  }, [startDateTime, endDateTime, params.pricePerHour]);

  const handlePayment = () => {
    if (calculation.isValid) {
      router.push({
        pathname: '/confirmPayment',
        params: {
          ...params,
          startDate: formatDate(startDateTime),
          startTime: formatTime(startDateTime),
          endDate: formatDate(endDateTime),
          endTime: formatTime(endDateTime),
          plateNumber: plateNumber,
          totalAmount: calculation.totalAmount
        }
      });
    }
  };

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
          <Text style={styles.spotPrice}>
            {params.pricePerHour ? `₦${params.pricePerHour} per hour` : "Price unavailable"}
          </Text>
          <Text style={styles.username}>User: {userData?.username}</Text>
        </View>

        <Text style={[styles.inputLabel, {marginTop: 10}]}>Arrival (Start)</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
          <View style={{ flex: 2 }}><WebInput type="date" target="start" /></View>
          <View style={{ flex: 1 }}><WebInput type="time" target="start" /></View>
        </View>

        <Text style={styles.inputLabel}>Departure (End)</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <View style={{ flex: 2 }}><WebInput type="date" target="end" /></View>
          <View style={{ flex: 1 }}><WebInput type="time" target="end" /></View>
        </View>

        {picker.show && (
          <DateTimePicker
            value={picker.target === 'start' ? startDateTime : endDateTime}
            mode={picker.mode}
            is24Hour={true}

            minimumDate={picker.target === 'start' ? new Date() : startDateTime}
            onChange={onPickerChange}
          />
        )}

        <Text style={styles.inputLabel}>Vehicle Plate Number</Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="E.g. KJA-123AA"
          value={plateNumber}
          onChangeText={setPlateNumber}
        />

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Duration</Text>
            <Text style={styles.totalValue}>
              {calculation.days > 0 ? `${calculation.days} day${calculation.days > 1 ? 's' : ''}` : ''}
              {calculation.remainingHours > 0 ? ` ${calculation.remainingHours} hour${calculation.remainingHours > 1 ? 's' : ''}` : ''}
              {calculation.days === 0 && calculation.remainingHours === 0 ? 'Less than 1 hour' : ''}
            </Text> 
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>₦{calculation.subtotal}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Service Charge</Text>
            <Text style={styles.totalValue}>₦50</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₦{calculation.totalAmount}</Text>
          </View>
        </View>

        <Pressable
          style={[styles.confirmButton, { backgroundColor: calculation.isValid ? '#10b981' : '#9ca3af' }]}
          onPress={handlePayment}
          disabled={!calculation.isValid}
        >
          <Text style={styles.confirmButtonText}> Confirm & Pay </Text>
        </Pressable>
      </ScrollView> 
    </KeyboardAvoidingView>
  );
} 
export default ReserveSpot;