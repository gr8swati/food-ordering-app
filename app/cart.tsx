import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable, Alert, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

type FoodItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const screenWidth = Dimensions.get('window').width;

export default function CartScreen() {
  const router = useRouter();
  const { cart } = useLocalSearchParams<{ cart: string }>();
  const initialCart: FoodItem[] = cart ? JSON.parse(cart) : [];

  const [cartItems, setCartItems] = useState<FoodItem[]>(initialCart);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
  router.push({
    pathname: '/summary',
    params: { cart: JSON.stringify(cartItems) },
  });
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Your Cart</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</Text>

                  <View style={styles.qtyControls}>
                    <Pressable style={styles.qtyButton} onPress={() => updateQuantity(item.id, -1)}>
                      <Text style={styles.qtyButtonText}>−</Text>
                    </Pressable>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <Pressable style={styles.qtyButton} onPress={() => updateQuantity(item.id, 1)}>
                      <Text style={styles.qtyButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />

          <View style={styles.footer}>
            <Text style={styles.total}>Total: ₹{total}</Text>
           <Pressable
              style={styles.button}
              onPress={() => router.push({ pathname: '/summary', params: { cart: JSON.stringify(cartItems) } })}>
              <Text style={styles.buttonText}>Place Order</Text>
           </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8f0', paddingTop: 40, paddingHorizontal: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3b3b3b', marginBottom: 20 },
  emptyText: { fontSize: 18, textAlign: 'center', marginTop: 50, color: '#999' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 15, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 8 },
  details: { marginLeft: 15, flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  price: { fontSize: 14, color: '#666', marginTop: 4 },
  footer: { borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 15, marginTop: 10 },
  total: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'right', color: '#3b3b3b' },
  button: { backgroundColor: '#4caf50', borderRadius: 20, paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  qtyButton: { backgroundColor: '#ddd', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 2 },
  qtyButtonText: { fontSize: 18, fontWeight: 'bold' },
  qtyText: { marginHorizontal: 10, fontSize: 16 },
});
