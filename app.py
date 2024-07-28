import logging
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_, func

# Create logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///nory.db"
db = SQLAlchemy(app)

# Enable CORS for all routes and origins
CORS(app)


# Add CORS headers after each request
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


class Staff(db.Model):
    staff_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    role = db.Column(db.String(80), nullable=False)
    iban = db.Column(db.String(34), nullable=False)
    bic = db.Column(db.String(11), nullable=False)
    locations = db.relationship("Location", secondary="staff_location", backref="staff")


class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    cost_per_unit = db.Column(db.Float, nullable=False)


class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location_id = db.Column(db.Integer, db.ForeignKey("location.id"), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey("ingredient.id"), nullable=False)
    quantity = db.Column(db.Float, nullable=False)


class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    ingredients = db.relationship("RecipeIngredient", backref="recipe", lazy=True)


class RecipeIngredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey("ingredient.id"), nullable=False)
    quantity = db.Column(db.Float, nullable=False)


class Modifier(db.Model):
    option = db.Column(db.String(80), primary_key=True)
    modifier_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)


class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey("location.id"), nullable=False)
    price = db.Column(db.Float, nullable=False)
    modifier_id = db.Column(db.String(80), db.ForeignKey("modifier.option"), nullable=True)


class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    address = db.Column(db.String(120), nullable=False)


class StaffLocation(db.Model):
    __tablename__ = "staff_location"
    staff_id = db.Column(db.Integer, db.ForeignKey("staff.staff_id"), primary_key=True)
    location_id = db.Column(db.Integer, db.ForeignKey("location.id"), primary_key=True)


class Delivery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location_id = db.Column(db.Integer, db.ForeignKey("location.id"), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey("ingredient.id"), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey("staff.staff_id"), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey("location.id"), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)  # price at the time of the order
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())


@app.route("/locations", methods=["GET"])
def get_locations():
    locations = Location.query.all()
    location_list = [{"id": location.id, "name": location.name, "address": location.address} for location in locations]
    return jsonify(location_list)


@app.route("/staff/<int:location_id>", methods=["GET"])
def get_staff_by_location(location_id):
    staff = Staff.query.join(StaffLocation).filter(StaffLocation.location_id == location_id).all()
    staff_list = []
    for staff_member in staff:
        staff_list.append(
            {
                "staff_id": staff_member.staff_id,
                "name": staff_member.name,
                "dob": staff_member.dob.strftime("%Y-%m-%d"),
                "role": staff_member.role,
                "iban": staff_member.iban,
                "bic": staff_member.bic,
                "location_id": location_id,
            }
        )
    return jsonify(staff_list)


@app.route("/ingredients", methods=["GET"])
def get_ingredients():
    ingredients = Ingredient.query.all()
    ingredient_list = [
        {
            "id": ingredient.id,
            "name": ingredient.name,
            "unit": ingredient.unit,
            "cost_per_unit": ingredient.cost_per_unit,
        }
        for ingredient in ingredients
    ]
    return jsonify(ingredient_list)


@app.route("/inventory/<int:location_id>", methods=["GET"])
def get_inventory_by_location(location_id):
    inventory = Inventory.query.filter_by(location_id=location_id).all()
    inventory_list = []
    for item in inventory:
        ingredient = Ingredient.query.get(item.ingredient_id)
        inventory_list.append(
            {"ingredient_id": item.ingredient_id, "ingredient_name": ingredient.name, "quantity": item.quantity}
        )
    return jsonify(inventory_list)


@app.route("/deliveries", methods=["POST"])
def add_delivery():
    try:
        data = request.json
        logger.debug(f"Received data: {data}")
        location_id = int(data["location_id"])
        ingredient_id = int(data["ingredient_id"])
        quantity = float(data["quantity"])
        staff_id = int(data["staff_id"])

        # Check if the location exists
        location = Location.query.get(location_id)
        if not location:
            raise ValueError(f"Location ID {location_id} does not exist.")

        # Check if the ingredient exists
        ingredient = Ingredient.query.get(ingredient_id)
        if not ingredient:
            raise ValueError(f"Ingredient ID {ingredient_id} does not exist.")

        # Check if the staff exists
        staff = Staff.query.get(staff_id)
        if not staff:
            raise ValueError(f"Staff ID {staff_id} does not exist.")

        inventory_item = Inventory.query.filter_by(location_id=location_id, ingredient_id=ingredient_id).first()
        if inventory_item:
            inventory_item.quantity += quantity
        else:
            new_inventory = Inventory(location_id=location_id, ingredient_id=ingredient_id, quantity=quantity)
            db.session.add(new_inventory)

        new_delivery = Delivery(
            location_id=location_id,
            ingredient_id=ingredient_id,
            quantity=quantity,
            staff_id=staff_id,
            date=datetime.utcnow(),
        )
        db.session.add(new_delivery)

        db.session.commit()
        return jsonify({"message": "Inventory updated successfully"})
    except Exception as e:
        logger.error(f"Error in add_delivery: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/recipes/<int:location_id>", methods=["GET"])
def get_recipes(location_id):
    menus = Menu.query.filter_by(location_id=location_id).all()
    recipes = [Recipe.query.get(menu.recipe_id) for menu in menus]
    recipes_data = [{"recipe_id": recipe.id, "name": recipe.name} for recipe in recipes]
    return jsonify(recipes_data)


@app.route("/orders", methods=["POST"])
def add_order():
    try:
        data = request.json
        recipe_id = data["recipe_id"]
        location_id = data["location_id"]
        quantity = float(data["quantity"])

        # Check if the menu item exists and get the price
        menu_item = Menu.query.filter_by(location_id=location_id, recipe_id=recipe_id).first()
        if not menu_item:
            raise ValueError(f"No menu item found for recipe_id {recipe_id} and location_id {location_id}")

        price = menu_item.price

        # Check if there are enough ingredients
        recipe_ingredients = RecipeIngredient.query.filter_by(recipe_id=recipe_id).all()
        insufficient_ingredients = []

        for ingredient in recipe_ingredients:
            inventory = Inventory.query.filter_by(
                location_id=location_id, ingredient_id=ingredient.ingredient_id
            ).first()
            if inventory is None or inventory.quantity < ingredient.quantity * quantity:
                ingredient_info = Ingredient.query.get(ingredient.ingredient_id)
                required_quantity = ingredient.quantity * quantity
                available_quantity = inventory.quantity if inventory else 0
                insufficient_ingredients.append(
                    {
                        "name": ingredient_info.name,
                        "required": required_quantity,
                        "available": available_quantity,
                        "unit": ingredient_info.unit,
                    }
                )

        if insufficient_ingredients:
            return jsonify({"insufficient_ingredients": insufficient_ingredients}), 400

        # Deduct the ingredients from the inventory
        for ingredient in recipe_ingredients:
            inventory = Inventory.query.filter_by(
                location_id=location_id, ingredient_id=ingredient.ingredient_id
            ).first()
            inventory.quantity -= ingredient.quantity * quantity

        # Create a new order
        new_order = Order(recipe_id=recipe_id, location_id=location_id, quantity=quantity, price=price)
        db.session.add(new_order)
        db.session.commit()

        return jsonify({"message": "Order processed successfully"})
    except Exception as e:
        app.logger.error(f"Error in add_order: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/report/<int:location_id>/deliveries", methods=["GET"])
def get_delivery_report(location_id):
    report_query = (
        db.session.query(
            Delivery,
            Ingredient.name.label("ingredient_name"),
            Staff.name.label("staff_name"),
            Location.name.label("location_name"),
        )
        .join(Ingredient, Delivery.ingredient_id == Ingredient.id)
        .join(Staff, Delivery.staff_id == Staff.staff_id)
        .join(Location, Delivery.location_id == Location.id)
        .filter(Delivery.location_id == location_id)
        .all()
    )

    report_data = []
    for delivery, ingredient_name, staff_name, location_name in report_query:
        report_data.append(
            {
                "ingredient_name": ingredient_name,
                "staff_name": staff_name,
                "quantity": delivery.quantity,
                "cost": delivery.quantity * Ingredient.query.get(delivery.ingredient_id).cost_per_unit,
                "date": delivery.date.strftime("%Y-%m-%d"),
                "location_name": location_name,
            }
        )
    return jsonify(report_data)


@app.route("/report/<int:location_id>/revenue", methods=["GET"])
def get_revenue_report(location_id):
    try:
        order_query = (
            db.session.query(
                Recipe.name.label("recipe_name"),
                db.func.sum(Order.quantity).label("quantity_sold"),
                db.func.sum(Order.quantity * Menu.price).label("total_price"),
                db.func.group_concat(Order.timestamp, ";").label("order_times"),
            )
            .join(Menu, and_(Menu.recipe_id == Recipe.id, Menu.location_id == location_id))
            .join(Order, and_(Order.recipe_id == Recipe.id, Order.location_id == location_id))
            .group_by(Recipe.name)
            .all()
        )

        revenue_data = [
            {
                "recipe_name": item.recipe_name,
                "quantity_sold": item.quantity_sold,
                "total_price": item.total_price,
                "order_times": item.order_times.split(";"),
            }
            for item in order_query
        ]

        return jsonify(revenue_data)
    except Exception as e:
        app.logger.error(f"Error in get_revenue_report: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/report/<int:location_id>/inventory", methods=["GET"])
def get_inventory_value_report(location_id):
    inventory_query = (
        db.session.query(
            Inventory, Ingredient.name.label("ingredient_name"), Ingredient.cost_per_unit.label("cost_per_unit")
        )
        .join(Ingredient, Inventory.ingredient_id == Ingredient.id)
        .filter(Inventory.location_id == location_id)
        .all()
    )

    inventory_data = []
    for inventory, ingredient_name, cost_per_unit in inventory_query:
        inventory_data.append(
            {
                "ingredient_name": ingredient_name,
                "quantity": inventory.quantity,
                "value": inventory.quantity * cost_per_unit,
            }
        )
    total_value = sum(item["value"] for item in inventory_data)

    return jsonify({"total_value": total_value, "inventory_data": inventory_data})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
