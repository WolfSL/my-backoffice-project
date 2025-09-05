import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db, firebase } from '@/firebase/firebase';
import { useAuthStore } from './auth';
import apiService from '@/services/apiService';

export const useUserStore = defineStore('users', () => {
    const apiUsers = ref([]);
    const firebaseUsers = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchApiUsers = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await apiService.getApiUsers();
            apiUsers.value = response.data;
        } catch (err) {
            error.value = "Failed to fetch users from API.";
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchFirebaseUsers = async () => {
        isLoading.value = true;
        const authStore = useAuthStore();
        const companyId = authStore.companyName || 'default-company';
        try {
            const snapshot = await db.collection('companies').doc(companyId).collection('users').get();
            firebaseUsers.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
            error.value = "Failed to fetch user permissions from Firebase.";
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    const updateUserPermissions = async (userId, permissions, locations) => {
        isLoading.value = true;
        const authStore = useAuthStore();
        const companyId = authStore.companyName || 'default-company';
        const userRef = db.collection('companies').doc(companyId).collection('users').doc(userId);
        try {
            await userRef.update({
                permissions: permissions,
                locations: locations,
            });
        } catch (err) {
            error.value = "Failed to update user permissions.";
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        apiUsers,
        firebaseUsers,
        isLoading,
        error,
        fetchApiUsers,
        fetchFirebaseUsers,
        updateUserPermissions,
    };
});
