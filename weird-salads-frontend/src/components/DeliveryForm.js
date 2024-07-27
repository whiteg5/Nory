import axios from 'axios';
import React, { useState } from 'react';

const DeliveryForm = ({ onDeliveryAccepted }) => {
    const [ingredientId, setIngredientId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [userId, setUserId] = useState('');
    const [locationId, setLocationId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/deliveries', {
            ingredient_id: ingredientId,
            quantity: quantity,
            user_id: userId,
            location_id: locationId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            alert('Delivery accepted');
            onDeliveryAccepted(); // Notify parent component to refresh inventory
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={ingredientId} onChange={(e) => setIngredientId(e.target.value)} placeholder="Ingredient ID" />
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" />
            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
            <input type="text" value={locationId} onChange={(e) => setLocationId(e.target.value)} placeholder="Location ID" />
            <button type="submit">Accept Delivery</button>
        </form>
    );
}

export default DeliveryForm;
