import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
     flex: 1,
     justifyContent: 'center', 
     alignItems: 'center', 
     padding: 20,
    },
  cardContainer:{
    backgroundColor: 'white', 
    padding: 25, 
    borderRadius: 20, 
    width: '100%', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    elevation: 10,
  },
    reservationText:{
      fontSize: 20, 
      fontWeight: 'bold', 
      color: '#10b981', 
    },
    headerText:{
      color: '#64748b', 
      marginBottom: 20,
    },
  qrImage: {
    width: 200, 
    height: 200, 
    marginBottom: 20,
  },
    detailsContainer:{
      width: '100%', 
      borderTopWidth: 1, 
      borderStyle: 'dashed', 
      borderColor: '#cbd5e1', 
      paddingTop: 15,
    },
    boxStyle:{
      flexDirection: 'row', 
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    colorStyle:{
      color: '#64748b',
    },
  textStyle: { 
    fontWeight: '600' 
    },
  confirmButton: {
    marginTop: 25,
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
export default styles;