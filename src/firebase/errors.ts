interface FirebaseErrors {
  [message: string]: string;
}

export const FIREBASE_ERRORS: FirebaseErrors = {
  'Firebase: Error (auth/email-already-in-use).':
    'A user with that email already exists',
  'Firebase: Error (auth/user-not-found).': 'User not found',
  'Firebase: Error (auth/wrong-password).': 'Wrong password',
  'Firebase: Error (auth/invalid-email).': 'Invalid email',
};
