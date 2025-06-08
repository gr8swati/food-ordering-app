import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type FoodItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type CartItem = FoodItem & { quantity: number };

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const router = useRouter();

  const [foodData, setFoodData] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'menuItems'));
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FoodItem[];
        setFoodData(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleIncrease = (id: string) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const handleDecrease = (id: string) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max((prev[id] || 1) - 1, 1) }));
  };

  const handleAddToCart = (item: FoodItem) => {
  const existingItem = cart.find(cartItem => cartItem.id === item.id);
  const qtyToAdd = quantities[item.id] || 1;  // User selected quantity ya default 1

  if (existingItem) {
    const updatedCart = cart.map(cartItem =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + qtyToAdd } // Add selected qty
        : cartItem
    );
    setCart(updatedCart);
  } else {
    setCart([...cart, { ...item, quantity: qtyToAdd }]); // Add with selected qty
  }

  Alert.alert('🛒 Added to Cart', `${item.name} added successfully.`);
};

  const handleGoToCart = () => {
    const cartJson = JSON.stringify(cart);
    router.push({ pathname: '/cart', params: { cart: cartJson } });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍕 Food Menu</Text>
        <Pressable style={styles.cartBadge} onPress={handleGoToCart}>
          <Text style={styles.cartText}>🛒 {totalItems}</Text>
        </Pressable>
      </View>

      <FlatList
        data={foodData}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const qty = quantities[item.id] || 1;
          return (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>₹{item.price}</Text>

              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => handleDecrease(item.id)} style={styles.qtyButton}>
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{qty}</Text>
                <TouchableOpacity onPress={() => handleIncrease(item.id)} style={styles.qtyButton}>
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>

              <Pressable style={styles.button} onPress={() => handleAddToCart(item)}>
                <Text style={styles.buttonText}>Add to Cart</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f0',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b3b3b',
  },
  cartBadge: {
    backgroundColor: '#ff7043',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cartText: {
    color: '#fff',
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    width: screenWidth / 2 - 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  qtyButton: {
    padding: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginHorizontal: 6,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '500',
    width: 25,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
