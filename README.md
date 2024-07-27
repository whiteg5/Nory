# Nory Inventory and Sales Management

This project is an inventory and sales management system for a restaurant. It includes features for managing inventory, placing orders, and tracking sales.

## Prerequisites

- [Python 3.7+](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/get-npm)
- [Flask](https://flask.palletsprojects.com/)
- [React](https://reactjs.org/)

## Backend Setup

1. **Clone the repository:**

    ```sh
    git clone https://github.com/yourusername/nory-inventory-management.git
    cd nory-inventory-management
    ```

2. **Set up a virtual environment:**

    ```sh
    python -m venv venv
    source venv/bin/activate # On Windows use `venv\Scripts\activate`
    ```

3. **Install Python dependencies:**

    ```sh
    pip install -r requirements.txt
    ```

4. **Run the Flask app:**

    ```sh
    python app.py
    ```

    This will start the Flask server on `http://127.0.0.1:5000`.

5. **Load initial data from Excel:**

    Ensure your Excel file (`Weird Salads - Data Export.xlsx`) is placed in the `data` directory. Then run:

    ```sh
    python load_data_from_excel.py
    ```

## Frontend Setup

1. **Navigate to the frontend directory:**

    ```sh
    cd frontend
    ```

2. **Install Node.js dependencies:**

    ```sh
    npm install
    ```

3. **Run the React app:**

    ```sh
    npm start
    ```

    This will start the React development server on `http://localhost:3000`.

## Configuration

Ensure that CORS is properly configured in `app.py` to allow communication between the frontend and backend servers.

```python
from flask_cors import CORS
CORS(app)
