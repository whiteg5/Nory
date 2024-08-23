import React from 'react';

const IngredientList = ({ ingredients }) => {
    return (
        <div>
            <h2>Current Inventory</h2>
            <ul>
                {ingredients.map(ingredient => (
                    <li key={ingredient.id}>{ingredient.name}: {ingredient.quantity}</li>
                ))}
            </ul>
        </div>
    );
}

export default IngredientList;
