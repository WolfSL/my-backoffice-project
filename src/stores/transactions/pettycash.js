import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db, firebase } from '@/firebase/firebase';
import 'firebase/compat/storage';
import { useAuthStore } from '../auth';

export const usePettyCashStore = defineStore('pettycash', () => {
    const isLoading = ref(false);
    const error = ref(null);
    const successMessage = ref('');
    const operationError = ref('');
    const locations = ref([]);
    const pettyCashBalances = ref({});
    const transactionLog = ref([]);
    const withdrawalTypes = ref(['TRAVELLING', 'UNLOADING', 'STATIONARY', 'STAFF WELFARE', 'MAINTAIN', 'OTHER']);

    const clearMessages = () => {
        successMessage.value = '';
        operationError.value = '';
    };

    const fetchLocationsFromFirebase = async () => {
        isLoading.value = true;
        const authStore = useAuthStore();
        const companyId = authStore.companyName || 'default-company';
        try {
            const snapshot = await db.collection('companies').doc(companyId).collection('locations').get();
            locations.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
            error.value = "Failed to fetch locations from Firebase.";
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchTransactionLog = async (location, fromDate, toDate) => {
        isLoading.value = true;
        const authStore = useAuthStore();
        const companyId = authStore.companyName || 'default-company';
        try {
            const start = new Date(fromDate);
            const end = new Date(toDate);
            end.setDate(end.getDate() + 1);

            const snapshot = await db.collection('companies').doc(companyId)
                .collection('pettycash').doc(location).collection('logs')
                .where('date', '>=', start)
                .where('date', '<', end)
                .orderBy('date', 'desc')
                .get();
            
            transactionLog.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
            error.value = "Failed to fetch transaction log.";
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    const setOpeningBalance = async (location, amount) => {
        isLoading.value = true;
        const authStore = useAuthStore();
        const companyId = authStore.companyName || 'default-company';
        const balanceRef = db.collection('companies').doc(companyId).collection('pettycash').doc(location);
        try {
            await balanceRef.set({
                balance: amount,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            successMessage.value = "Opening balance set successfully.";
        } catch (err) {
            operationError.value = "Failed to set opening balance.";
            console.error(err);
        } finally {
            isLoading.value = false;
            setTimeout(clearMessages, 3000);
        }
    };

    const addPettyCash = async (location, amount, checkNumber) => {
        isLoading.value = true;
        const authStore = useAuthStore();
        const companyId = authStore.companyName || 'default-company';
        const balanceRef = db.collection('companies').doc(companyId).collection('pettycash').doc(location);
        const logRef = db.collection('companies').doc(companyId).collection('pettycash').doc(location).collection('logs').doc();
        
        try {
            await db.runTransaction(async (transaction) => {
                const balanceDoc = await transaction.get(balanceRef);
                const newBalance = (balanceDoc.data()?.balance || 0) + amount;
                
                transaction.set(balanceRef, { 
                    balance: newBalance,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp() 
                }, { merge: true });

                transaction.set(logRef, {
                    type: 'add',
                    amount: amount,
                    checkNumber: checkNumber,
                    user: authStore.user?.Username || 'admin',
                    date: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            successMessage.value = "Petty cash added successfully.";
        } catch (err) {
            operationError.value = "Failed to add petty cash.";
            console.error(err);
        } finally {
            isLoading.value = false;
            setTimeout(clearMessages, 3000);
        }
    };

    // MODIFIED: This action now handles the image upload internally
    const withdrawPettyCash = async (location, amount, withdrawType, remark, imageFile) => {
        isLoading.value = true;
        const authStore = useAuthStore();
        const companyId = authStore.companyName || 'default-company';
        
        try {
            let imageUrl = null;
            if (imageFile) {
                const filePath = `${companyId}/pettycash/${location}/${Date.now()}_${imageFile.name}`;
                const storageRef = firebase.storage().ref();
                const fileRef = storageRef.child(filePath);
                await fileRef.put(imageFile);
                imageUrl = await fileRef.getDownloadURL();
            }

            const balanceRef = db.collection('companies').doc(companyId).collection('pettycash').doc(location);
            const logRef = db.collection('companies').doc(companyId).collection('pettycash').doc(location).collection('logs').doc();

            await db.runTransaction(async (transaction) => {
                const balanceDoc = await transaction.get(balanceRef);
                const currentBalance = balanceDoc.data()?.balance || 0;
                if (currentBalance < amount) {
                    throw new Error("Insufficient funds.");
                }
                const newBalance = currentBalance - amount;

                transaction.set(balanceRef, {
                    balance: newBalance,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });

                transaction.set(logRef, {
                    type: 'withdraw',
                    amount: amount,
                    withdrawType: withdrawType,
                    remark: remark,
                    imageUrl: imageUrl,
                    user: authStore.user?.Username || 'admin',
                    date: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            successMessage.value = "Withdrawal successful.";
        } catch (err) {
            operationError.value = err.message || "Failed to withdraw petty cash.";
            console.error(err);
        } finally {
            isLoading.value = false;
            setTimeout(clearMessages, 3000);
        }
    };

    const subscribeToBalances = () => {
        const authStore = useAuthStore();
        const companyId = authStore.companyName || 'default-company';
        return db.collection('companies').doc(companyId).collection('pettycash')
            .onSnapshot(snapshot => {
                const balances = {};
                snapshot.forEach(doc => {
                    balances[doc.id] = doc.data().balance;
                });
                pettyCashBalances.value = balances;
            });
    };

    return {
        isLoading,
        error,
        successMessage,
        operationError,
        locations,
        pettyCashBalances,
        transactionLog,
        withdrawalTypes,
        fetchLocationsFromFirebase,
        fetchTransactionLog,
        setOpeningBalance,
        addPettyCash,
        withdrawPettyCash,
        subscribeToBalances,
    };
});
