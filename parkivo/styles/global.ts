import { StyleSheet } from 'react-native';
const styles = (isTablet: boolean) =>
  StyleSheet.create({
  hero: {
    flex: 1,
    width: '100%',
    resizeMode:"cover",
    flexDirection: isTablet ? 'row' : 'column',
    
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  navbar: {
    width: '100%',
    padding: 20,
    flexDirection: isTablet ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    boxShadow: '0px 5px 10px rgba(92, 88, 88, 0.9)',
    elevation: 5,
  },

  navLinks: {
    flexDirection: 'row',
    gap: 24, 
  },

  navText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    boxShadow: '0px 5px 10px rgba(92, 88, 88, 0.9)',
    elevation: 5,
    textAlign: 'center',
    maxWidth: 800,
  },

  subtitle: {
    fontSize: 18,
    color: '#ddd',
    marginTop: 30,
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: 600,
    fontWeight: 'bold',
  },

  ctaRow: {
    flexDirection: 'row',
    gap: 16,
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },

  primary: {
    backgroundColor: '#041579ff',
  },

  secondary: {
    backgroundColor: '#860666ff',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default styles;