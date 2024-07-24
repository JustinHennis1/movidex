import { doc, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

// Add a movie to the user's ratedmovies
export const addMovieToRated = async (movie) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // Create the user document if it doesn't exist
    await setDoc(userDocRef, { ratedmovies: [movie] });
  } else {
    // Update the user document if it exists
    const existingRatedMovies = userDoc.data().ratedmovies || [];
    await updateDoc(userDocRef, {
      ratedmovies: arrayUnion(...existingRatedMovies, movie)
    });
  }
};

// Remove a movie from the user's ratedmovies
export const removeMovieFromRated = async (movieId) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
  
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
  
    if (userDoc.exists()) {
      const updatedratedmovies = userDoc.data().ratedmovies.filter(movie => movie.id !== movieId);
      await updateDoc(userDocRef, {
        ratedmovies: updatedratedmovies
      });
    } else {
      throw new Error("User document does not exist");
    }
  };

// Fetch the user's ratedmovies
export const fetchUserRatedMovies = async () => {
    console.log(`Requested retrieval of ratedmovies`)
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().ratedmovies || [];
    }
  }
  return [];
};

export const isMovieInRatedMovies = async (movieId) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const ratedmovies = docSnap.data().ratedmovies || [];
        return ratedmovies.some(movie => movie.id === movieId);
      }
    }
    return false;
  };
