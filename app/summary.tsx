import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

type FoodItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { cart } = useLocalSearchParams<{ cart: string }>();
  const cartItems: FoodItem[] = cart ? JSON.parse(cart) : [];
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = () => {
    Alert.alert('✅ Order Confirmed', 'Thank you! Your order has been submitted.', [
      { text: 'Done', onPress: () => router.replace('/') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Order Summary</Text>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.info}>
                ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
              </Text>
            </View>
          </View>
        )}
      />

      <Text style={styles.total}>Total: ₹{total}</Text>

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Order</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef9f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#3b3b3b' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 12, alignItems: 'center' },
  image: { width: 60, height: 60, borderRadius: 8 },
  details: { marginLeft: 15 },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  info: { fontSize: 14, color: '#555', marginTop: 4 },
  total: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginTop: 20, marginBottom: 30 },
  button: { backgroundColor: '#4caf50', padding: 15, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
