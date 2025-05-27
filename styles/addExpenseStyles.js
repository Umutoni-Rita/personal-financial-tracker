import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingLeft: 40,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: '#2e8b8f',
    backgroundColor: '#f5f7fa',
  },
  icon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  button: {
    backgroundColor: '#1a6a6e',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 15,
    shadowColor: '#1a6a6e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#6b7280',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  cancelButton: {
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2e8b8f',
    fontSize: 16,
    fontWeight: '500',
  },
});
