# Weird Salads Management System

This project is a management system for Weird Salads, allowing users to manage inventory, process front-of-house sales, and generate various reports. The system is built using a Flask backend and a React frontend.

## Data Modeling and Storage

### Database Models

The system uses a SQLite database managed by SQLAlchemy. Here are the key models:

- **Staff**: Represents staff members with attributes like `name`, `dob`, `role`, `iban`, and `bic`.
- **Ingredient**: Represents ingredients with attributes like `name`, `unit`, and `cost_per_unit`.
- **Inventory**: Represents the inventory of ingredients at a specific location, with attributes like `location_id`, `ingredient_id`, and `quantity`.
- **Recipe**: Represents recipes with attributes like `name`. Recipes have a relationship with ingredients through `RecipeIngredient`.
- **RecipeIngredient**: Represents the relationship between recipes and ingredients, with attributes like `recipe_id`, `ingredient_id`, and `quantity`.
- **Modifier**: Represents menu item modifiers with attributes like `option`, `modifier_id`, `name`, and `price`.
- **Menu**: Represents the menu items available at a location, with attributes like `recipe_id`, `location_id`, `price`, and `modifier_id`.
- **Location**: Represents restaurant locations with attributes like `name` and `address`.
- **StaffLocation**: Represents the many-to-many relationship between staff and locations.
- **Delivery**: Represents deliveries of ingredients to locations, with attributes like `location_id`, `ingredient_id`, `quantity`, `staff_id`, and `date`.
- **Order**: Represents customer orders, with attributes like `recipe_id`, `location_id`, `quantity`, `price`, and `timestamp`.

### Interesting Aspects

- **Centralized Data Management**: All data is managed in a centralized SQLite database, ensuring consistency and easy access.
- **Flexible Relationships**: The models use SQLAlchemy relationships to represent complex relationships like many-to-many (e.g., StaffLocation) and one-to-many (e.g., Recipe and RecipeIngredient).
- **Automatic Inventory Management**: Orders automatically update the inventory, ensuring real-time accuracy of stock levels.
- **Responsive UI**: The frontend is built with React and Bootstrap, providing a responsive and user-friendly interface.

## Features

### Inventory Manager

The inventory manager allows users to:
- View current inventory, sorted alphabetically by ingredient name.
- Add deliveries, specifying the location, ingredient, quantity, and staff member.
- See the current inventory value for ingredients with more than zero quantity.

### Front of House Sales

The front of house sales page allows users to:
- Select a location and menu item.
- Process orders, ensuring sufficient ingredients are available.
- View the location name at the top of the page.

### Reports

The reports page provides:
- Total cost of ingredients delivered to a location.
- Total revenue from sales at a location, including individual items sold and their quantities.
- Total value of current inventory at a location.

### Navigation

A navigation bar at the top of each page allows users to switch between the home page, inventory manager, front of house sales, and reports.

## Challenges and Decisions

### Challenges

1. **Data Integrity and Consistency**: Ensuring data integrity when updating inventory based on orders and deliveries was a significant challenge. The system had to be robust enough to handle concurrent updates without losing data accuracy.

2. **Responsive Design**: Designing a responsive frontend that works seamlessly across different devices and screen sizes required careful planning and implementation.

3. **Real-time Updates**: Keeping the inventory data up-to-date in real-time as orders are processed and deliveries are made was crucial. This required efficient handling of state management in the React frontend and database transactions in the Flask backend.

4. **Complex Relationships**: Managing complex relationships between models, such as many-to-many relationships between staff and locations, required careful consideration and correct implementation using SQLAlchemy.

### Decisions

1. **Choosing SQLite**: SQLite was chosen as the database for its simplicity and ease of setup. It provides sufficient functionality for the requirements of this project.

2. **Using SQLAlchemy**: SQLAlchemy was used for ORM to manage database operations, making it easier to interact with the database using Python objects and methods.

3. **React and Bootstrap for Frontend**: React was chosen for building the user interface due to its component-based architecture and state management capabilities. Bootstrap was used to ensure the application is responsive and visually appealing.

4. **Centralized Context for Location Management**: A centralized context was implemented in React to manage the selected location across different components, ensuring consistency in the application state.

5. **Modular Code Structure**: The code was organized into modular components, making it easier to maintain and extend. Each functionality, such as inventory management and order processing, was encapsulated in separate components and routes.
