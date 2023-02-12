interface FirebaseErrors {
  [message: string]: string;
}

export const FIREBASE_ERRORS: FirebaseErrors = {
  'Firebase: Error (auth/email-already-in-use).':
    'A user with that email already exists',
};
