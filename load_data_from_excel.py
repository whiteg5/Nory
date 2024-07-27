from datetime import datetime

import pandas as pd

from app import (
    Ingredient,
    Inventory,
    Location,
    Menu,
    Modifier,
    Recipe,
    RecipeIngredient,
    Staff,
    StaffLocation,
    app,
    db,
)


def load_data_from_excel(file_path):
    with app.app_context():
        # Drop all tables and create them again
        db.drop_all()
        db.create_all()

        xls = pd.ExcelFile(file_path)

        # Load Locations
        location_data = pd.read_excel(xls, "locations")
        print("Location columns:", location_data.columns)  # Debug statement
        locations = []
        for index, row in location_data.iterrows():
            location = Location(id=row["location_id"], name=row["name"], address=row["address"])
            locations.append(location)
        db.session.bulk_save_objects(locations)

        # Load Staff
        staff_data = pd.read_excel(xls, "staff")
        print("Staff columns:", staff_data.columns)  # Debug statement
        staff = []
        staff_ids = set()
        for index, row in staff_data.iterrows():
            if row["staff_id"] not in staff_ids:
                dob_str = str(row["dob"]).split(" ")[0]  # Get only the date part
                staff_member = Staff(
                    staff_id=row["staff_id"],
                    name=row["name"],
                    dob=datetime.strptime(dob_str, "%Y-%m-%d").date(),
                    role=row["role"],
                    iban=row["iban"],
                    bic=row["bic"],
                )
                staff.append(staff_member)
                staff_ids.add(row["staff_id"])
        db.session.bulk_save_objects(staff)

        # Load StaffLocation
        staff_location_data = pd.read_excel(xls, "staff")
        print("StaffLocation columns:", staff_location_data.columns)  # Debug statement
        staff_locations = []
        for index, row in staff_location_data.iterrows():
            staff_location = StaffLocation(staff_id=row["staff_id"], location_id=row["location_id"])
            staff_locations.append(staff_location)
        db.session.bulk_save_objects(staff_locations)

        # Load Ingredients
        ingredient_data = pd.read_excel(xls, "ingredients")
        print("Ingredient columns:", ingredient_data.columns)  # Debug statement
        ingredients = []
        for index, row in ingredient_data.iterrows():
            ingredient = Ingredient(
                id=row["ingredient_id"], name=row["name"], unit=row["unit"], cost_per_unit=row["cost"]
            )
            ingredients.append(ingredient)
        db.session.bulk_save_objects(ingredients)

        # Set Inventory for all ingredients in all locations to 0
        inventory = []
        for location in locations:
            for ingredient in ingredients:
                inventory_item = Inventory(location_id=location.id, ingredient_id=ingredient.id, quantity=0)
                inventory.append(inventory_item)
        db.session.bulk_save_objects(inventory)

        # Load Recipes and Recipe Ingredients
        recipe_data = pd.read_excel(xls, "recipes")
        print("Recipe columns:", recipe_data.columns)  # Debug statement

        # Ensure unique recipes
        unique_recipes = recipe_data.drop_duplicates(subset=["recipe_id", "name"])
        recipes = []
        for index, row in unique_recipes.iterrows():
            recipe = Recipe(id=row["recipe_id"], name=row["name"])
            recipes.append(recipe)
        db.session.bulk_save_objects(recipes)

        # Load Recipe Ingredients from the same sheet
        recipe_ingredients = []
        for index, row in recipe_data.iterrows():
            recipe_ingredient = RecipeIngredient(
                recipe_id=row["recipe_id"], ingredient_id=row["ingredient_id"], quantity=row["quantity"]
            )
            recipe_ingredients.append(recipe_ingredient)
        db.session.bulk_save_objects(recipe_ingredients)

        # Load Modifiers
        modifier_data = pd.read_excel(xls, "modifiers")
        print("Modifier columns:", modifier_data.columns)  # Debug statement
        modifier_data = modifier_data.fillna({"option": "None"})
        modifiers = []
        for index, row in modifier_data.iterrows():
            modifier = Modifier(
                option=row["option"], modifier_id=row["modifier_id"], name=row["name"], price=row["price"]
            )
            modifiers.append(modifier)
        db.session.bulk_save_objects(modifiers)

        # Load Menus
        menu_data = pd.read_excel(xls, "menus")
        print("Menu columns:", menu_data.columns)  # Debug statement
        menus = []
        for index, row in menu_data.iterrows():
            menu = Menu(
                id=index + 1,  # Use the index as a unique identifier
                recipe_id=row["recipe_id"],
                location_id=row["location_id"],
                price=row["price"],
                modifier_id=row["modifiers"],
            )
            menus.append(menu)
        db.session.bulk_save_objects(menus)

        db.session.commit()


if __name__ == "__main__":
    load_data_from_excel(r"./data/Weird Salads - Data Export.xlsx")
