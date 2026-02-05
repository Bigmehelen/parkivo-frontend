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
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.xl,
  },
  centerWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  backText: {
    marginLeft: SPACING.s,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.l,
    ...ELEVATION.glow,
  },
  title: {
    marginBottom: SPACING.s,
  },
  subtitle: {
    textAlign: 'center',
  },
  formWrapper: {
    gap: SPACING.xl,
  },
  formCard: {
    padding: SPACING.xl,
  },
  formContent: {
    gap: SPACING.l,
  },
  input: {
    marginBottom: SPACING.s,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    borderWidth: 1,
  },
  errorText: {
    flex: 1,
  },
  loginButton: {
    marginTop: SPACING.m,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.m,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SPACING.m,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    marginRight: 0,
  },
  registerLink: {
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