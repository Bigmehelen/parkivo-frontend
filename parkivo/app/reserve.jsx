import {React, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import styles from '../styles/reserveStyle';

const ReserveSpot = () => {
  const router = useRouter();
  const [duration, setDuration] = useState('1'); // Default 1 hour
  const [plateNumber, setPlateNumber] = useState('');
  const params = useLocalSearchParams();

  if (!params.name) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No parking spot selected.</Text>
        <Pressable onPress={() => router.back()}><Text>Go Back</Text></Pressable>
      </View>
    );
  }
  const spotDetails = {
    name: params.name,
    pricePerHour: parseInt(params.pricePerHour),
    area: params.area,
  };

  const totalPrice = spotDetails.pricePerHour * parseInt(duration || 0);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/smartpark')} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>Confirm Reservation</Text>
        </View>

        {/* Selected Spot Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.label}>SELECTED LOCATION</Text>
          <Text style={styles.spotName}>{spotDetails.name}</Text>
          <Text style={styles.spotArea}>📍 {spotDetails.area}</Text>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>₦{spotDetails.pricePerHour} / hour</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active Now</Text>
            </View>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <Text style={styles.inputLabel}>Duration (Hours)</Text>
          <View style={styles.durationSelector}>
            {[1, 2, 3, 4, 5].map((num) => (
              <Pressable
                key={num}
                style={[styles.timeSlot, duration === num.toString() && styles.selectedSlot]}
                onPress={() => setDuration(num.toString())}
              >
                <Text style={[styles.timeSlotText, duration === num.toString() && styles.selectedSlotText]}>
                  {num}h
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.inputLabel}>Vehicle Plate Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. ABC-123DE"
            placeholderTextColor="#94a3b8"
            value={plateNumber}
            onChangeText={setPlateNumber}
            autoCapitalize="characters"
          />
        </View>

        {/* Payment Breakdown */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>₦{totalPrice}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Service Fee</Text>
            <Text style={styles.totalValue}>₦50</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total Amount</Text>
            <Text style={styles.grandTotalValue}>₦{totalPrice + 50}</Text>
          </View>
        </View>

        <Pressable 
          style={styles.confirmButton}
          onPress={() => alert('Reservation Successful!')}
        >
          <Text style={styles.confirmButtonText}>Confirm & Pay Now</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


export default ReserveSpot;