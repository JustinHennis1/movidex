import { doc, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

// Add a movie to the user's watchlist
export const addMovieToWatchlist = async (movie) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
  
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
  
    if (!userDoc.exists()) {
      // Create the user document if it doesn't exist
      await setDoc(userDocRef, { watchlist: [movie] });
    } else {
      // Update the user document if it exists
      await updateDoc(userDocRef, {
        watchlist: [...userDoc.data().watchlist, movie]
      });
    }
  };

// Remove a movie from the user's watchlist
export const removeMovieFromWatchlist = async (movieId) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
  
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
  
    if (userDoc.exists()) {
      const updatedWatchlist = userDoc.data().watchlist.filter(movie => movie.id !== movieId);
      await updateDoc(userDocRef, {
        watchlist: updatedWatchlist
      });
    } else {
      throw new Error("User document does not exist");
    }
  };

// Fetch the user's watchlist
export const fetchUserWatchlist = async () => {
    console.log(`Requested retrieval of watchlist`)
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().watchlist || [];
    }
  }
  return [];
};

export const isMovieInWatchlist = async (movieId) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const watchlist = docSnap.data().watchlist || [];
        return watchlist.some(movie => movie.id === movieId);
      }
    }
    return false;
  };
