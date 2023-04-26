import { getGoal } from "./goal";
import { getMeals } from "./meal";
import { getSavedMeals } from "./savedMeal";
import { getSavedIngredients } from './savedIngredient'

export function initData() {
	getGoal();
	getMeals();
	getSavedMeals();
	getSavedIngredients();
}
