import { StyleSheet, Platform} from 'react-native';

const styles = StyleSheet.create({
  container: {
     flex: 1, 
     backgroundColor: '#f8fafc' 
    },
  scrollContent: {
     padding: 20 
  },
  header: {
     marginBottom: 24,
      marginTop: Platform.OS === 'ios' ? 40 : 10 
    },
  backButton: {
     marginBottom: 10 
    },
  backText: {
     color: '#3b82f6', 
     fontSize: 16, 
     fontWeight: '600' 
    },
  title: {
     fontSize: 28, 
     fontWeight: 'bold', 
     color: '#1e293b' },
  
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    boxShadow: '0px 15px 15px rgba(1, 1, 1, 0.1)',
    elevation: 3,
    marginBottom: 25,
  },
  label: {
     fontSize: 12, 
     fontWeight: '800', 
     color: '#64748b', 
     letterSpacing: 1, 
     marginBottom: 8 
    },
  spotName: {
     fontSize: 20, 
     fontWeight: 'bold', 
     color: '#1e293b' 
    },
  spotArea: {
     fontSize: 14, 
     color: '#64748b', 
     marginTop: 4 },
  divider: {
     height: 1, 
     backgroundColor: '#f1f5f9', 
     marginVertical: 15 
    },
  priceRow: {
     flexDirection: 'row', 
     justifyContent: 'space-between', 
     alignItems: 'center' 
    },
  priceText: {
     fontSize: 18, 
     fontWeight: '700',
     color: '#10b981' 
    },
  activeBadge: {
     backgroundColor: '#dcfce7', 
     paddingHorizontal: 10, 
     paddingVertical: 4, 
     borderRadius: 20 
    },
  activeBadgeText: {
     color: '#166534', 
     fontSize: 12, 
     fontWeight: '600' 
    },
  form: {
     marginBottom: 25 
    },
  inputLabel: {
     fontSize: 16, 
     fontWeight: '600', 
     color: '#334155', 
     marginBottom: 12 
    },
  durationSelector: {
     flexDirection: 'row', 
     justifyContent: 'space-between', 
     marginBottom: 25 
    },
  timeSlot: { 
    flex: 1, 
    marginHorizontal: 4, 
    paddingVertical: 12, 
    borderRadius: 12, 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    alignItems: 'center' 
  },
  selectedSlot: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6' 
},
  timeSlotText: {
    fontWeight: '600',
    color: '#64748b' 
},
  selectedSlotText: {
    color: '#fff' 
},
  input: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    fontSize: 16,
    color: '#1e293b'
  },

  totalSection: {
     marginBottom: 30 
    },
  totalRow: {
     flexDirection: 'row', 
     justifyContent: 'space-between',
    marginBottom: 8 
},
  totalLabel: {
     color: '#64748b', 
     fontSize: 15 
    },
  totalValue: {
     color: '#1e293b', 
     fontSize: 15, 
     fontWeight: '600' 
    },
  grandTotalRow: {
     marginTop: 10, 
     paddingTop: 10, 
     borderTopWidth: 1, 
     borderTopColor: '#e2e8f0' 
    },
  grandTotalLabel: {
     fontSize: 18,
    fontWeight: 'bold', 
    color: '#1e293b' 
},
  grandTotalValue: {
     fontSize: 22, 
     fontWeight: 'bold', 
     color: '#3b82f6' 
    },

  confirmButton: { 
    backgroundColor: '#3b82f6',
    width: '50%', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, 
    borderRadius: 16, 
    boxShadow: '0px 15px 15px rgba(1, 1, 1, 0.1)',
    elevation: 5
  },
  confirmButtonText: {
     color: '#fff', 
     fontSize: 18, 
     fontWeight: 'bold' 
    },
});
export default styles;