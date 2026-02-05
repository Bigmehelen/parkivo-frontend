import { StyleSheet } from 'react-native';
import { SPACING, RADIUS, ELEVATION } from '../constants/AppTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.xl,
  },
  formWrapper: {
    gap: SPACING.xl,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  inputSection: {
    gap: SPACING.m,
  },
  errorText: {
    textAlign: 'center',
  },
  button: {
    marginTop: SPACING.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.l,
  },
  loginLink: {
    fontWeight: '600',
  },
  bottomSpacer: {
    height: SPACING.xxxl,
  },
  card:{
    width: '100%',
    maxWidth: 450,
    boxShadow: '0px 15px 15px rgba(1, 1, 1, 0.1)',
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
    borderColor: '#000000',
    textAlign: 'left',
    includeFontPadding: false,
    textAlignVertical: 'center',
    width: '90%',
    maxWidth: 360,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
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
    color: '#041579ff',
  },
  linkHome:{
    marginTop: 16,
    textAlign: 'center',
    color: '#041579ff',
  },

});

export default styles;
