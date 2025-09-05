import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import apiService from '@/services/apiService';
import { auth, db } from '@/firebase/firebase';

export const useAuthStore = defineStore('auth', () => {
 const user = ref('');
  const companyName = ref('');
  const companyAddress = ref('');
  const firebaseUser = ref(null);
  const isSyncing = ref(false);
  // MODIFIED: Add state for Firebase permissions and locations
  const firebasePermissions = ref([]);
  const firebaseLocations = ref([]);


  const isLoggedIn = computed(() => !!user.value);
  const displayName = computed(() => user.value?.DisplayName || 'Guest');
  
  // MODIFIED: hasPermission now checks the firebasePermissions array
  const hasPermission = (requiredPermission) => {
    return firebasePermissions.value.includes(requiredPermission);
  };

  async function login(username, password) {
    try {
      const response = await apiService.login(username, password);
      const userData = response.data?.[0];
      if (userData && userData.Status === true) {
        user.value = userData;
       //localStorage.setItem('user', JSON.stringify(userData));
        await fetchCompany(); // Fetch company details after login
        await signInToFirebase();
        await router.push('/');
      } else {
        throw new Error(userData ? 'User is not active.' : 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // MODIFIED: Updated to fetch permissions and locations from Firestore
  async function signInToFirebase() {
    try {
      const userCredential = await auth.signInAnonymously();
      firebaseUser.value = userCredential.user;
      
      const companyId = companyName.value || 'default-company';
      const usersCollection = db.collection('companies').doc(companyId).collection('users');
      
      // Find the user document by their API username
      const userQuery = await usersCollection.where('apiUser', '==', user.value.Username).get();

      if (!userQuery.empty) {
        // User exists, get their permissions and locations
        const userDoc = userQuery.docs[0];
        firebasePermissions.value = userDoc.data().permissions || [];
        firebaseLocations.value = userDoc.data().locations || [];
      } else {
        // First login for this user in Firebase, create a new document
        // We can use the Firebase UID as the document ID
        await usersCollection.doc(firebaseUser.value.uid).set({
          apiUser: user.value.Username,
          firstLogin: new Date(),
          permissions: [],
          locations: []
        });
        firebasePermissions.value = [];
        firebaseLocations.value = [];
      }

    } catch (error) {
      console.error("Firebase anonymous sign-in failed:", error);
    }
  }

  async function syncLocationsToFirebase() {
    isSyncing.value = true;
    try {
      const response = await apiService.getLocations();
      const locations = response.data;
      
      const companyId = companyName.value || 'default-company';
      const batch = db.batch();

      locations.forEach(location => {
        const locRef = db.collection('companies').doc(companyId)
                         .collection('locations').doc(location.locCode);
        batch.set(locRef, location);
      });

      await batch.commit();
      alert('Locations synchronized successfully!');
    } catch (error) {
      console.error("Failed to sync locations:", error);
      alert('Failed to sync locations.');
    } finally {
      isSyncing.value = false;
    }
  }

  async function logout() {
    user.value = null;
    firebaseUser.value = null;
    firebasePermissions.value = []; // Clear permissions on logout
    firebaseLocations.value = []; // Clear locations on logout
   // localStorage.removeItem('user');
    await auth.signOut();
    await router.push('/login');
  }
  
  async function fetchCompany() {
    if (companyName.value) return;
    try {
      const response = await apiService.getCompany();
      const companyData = response.data?.[0];
      if (companyData) {
        companyName.value = companyData.COMPANY || 'My Company';
        companyAddress.value = companyData.ADDRESS || '';
      }
    } catch (error) {
      console.error('Failed to fetch company details:', error);
    }
  }

  return {
    user,
    firebaseUser,
    companyName,
    companyAddress,
    isLoggedIn,
    displayName,
    isSyncing,
    // MODIFIED: Expose new state
    firebasePermissions,
    firebaseLocations,
    login,
    logout,
    hasPermission,
    fetchCompany,
    syncLocationsToFirebase
  };
});
