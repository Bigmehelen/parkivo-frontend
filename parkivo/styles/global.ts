import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  hero: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  navbar: {
    width: '100%',
    paddingHorizontal: 32,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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
    textAlign: 'center',
    maxWidth: 800,
  },

  subtitle: {
    fontSize: 18,
    color: '#ddd',
    marginTop: 12,
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: 600,
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
    backgroundColor: '#248606ff',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default styles;