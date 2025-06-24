import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const AdminAddItemScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = ['Pizza', 'Burgers', 'Salads', 'Pasta', 'Desserts', 'Beverages', 'Tacos', 'Wraps'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Show image preview when URL is entered
    if (field === 'imageUrl' && value) {
      setImagePreview(value);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter item name');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter item description');
      return false;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    if (!formData.imageUrl.trim()) {
      Alert.alert('Error', 'Please enter image URL');
      return false;
    }
    return true;
  };

  const handleAddItem = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const menuItem = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category || 'Other',
        imageUrl: formData.imageUrl.trim(),
        createdAt: new Date(),
        available: true,
      };

      const docRef = await addDoc(collection(db, 'menuItems'), menuItem);
      
      Alert.alert(
        'Success!',
        `Menu item "${formData.name}" has been added successfully!`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                imageUrl: '',
              });
              setImagePreview(null);
            }
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error adding menu item:', error);
      Alert.alert('Error', 'Failed to add menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const suggestedImages = [
    {
      name: 'Pizza',
      url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
    },
    {
      name: 'Burger',  
      url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
    },
    {
      name: 'Salad',
      url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'
    },
    {
      name: 'Pasta',
      url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Add New Menu Item</Text>

        <Text style={styles.label}>Item Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Margherita Pizza"
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the item (ingredients, preparation, etc.)"
          value={formData.description}
          onChangeText={(text) => handleInputChange('description', text)}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Price * (USD)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 12.99"
          value={formData.price}
          onChangeText={(text) => handleInputChange('price', text)}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                formData.category === category && styles.selectedCategory
              ]}
              onPress={() => handleInputChange('category', category)}
            >
              <Text style={[
                styles.categoryText,
                formData.category === category && styles.selectedCategoryText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Image URL *</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/image.jpg"
          value={formData.imageUrl}
          onChangeText={(text) => handleInputChange('imageUrl', text)}
          autoCapitalize="none"
        />

        <Text style={styles.suggestedTitle}>Suggested Images:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestedContainer}>
          {suggestedImages.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestedItem}
              onPress={() => handleInputChange('imageUrl', item.url)}
            >
              <Image source={{ uri: item.url }} style={styles.suggestedImage} />
              <Text style={styles.suggestedName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {imagePreview && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Image Preview:</Text>
            <Image 
              source={{ uri: imagePreview }} 
              style={styles.previewImage}
              onError={() => setImagePreview(null)}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.addButton, loading && styles.disabledButton]}
          onPress={handleAddItem}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add Menu Item</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    marginBottom: 5,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategory: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  suggestedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
  },
  suggestedContainer: {
    marginBottom: 10,
  },
  suggestedItem: {
    marginRight: 12,
    alignItems: 'center',
  },
  suggestedImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  suggestedName: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  previewContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminAddItemScreen;