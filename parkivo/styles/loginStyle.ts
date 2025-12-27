import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  card:{
    width: '100%',
    maxWidth: 450,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    margin: 'auto',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    width: '90%',
    maxWidth: 360,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#860666ff',
    paddingVertical: 10,
    borderRadius: 8,
    width: '60%',
    maxWidth: 300,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    padding:5,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#860666ff',
  },
  linkHome:{
    marginTop: 16,
    textAlign: 'center',
    color: '#860666ff',
  }
});

export default styles;