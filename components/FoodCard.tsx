// components/FoodCard.tsx
import { View, Text, Image, Button, StyleSheet } from 'react-native';

export default function FoodCard({ item, onAddToCart }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <Button title="Add to Cart" onPress={() => onAddToCart(item)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  image: { width: '100%', height: 150, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 18, fontWeight: '600' },
  price: { fontSize: 16, color: 'gray', marginBottom: 8 },
});
