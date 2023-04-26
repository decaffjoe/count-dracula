<script lang="ts">
  import MealHistory from "../components/MealHistory.svelte";
  import NewMeal from "../components/NewMeal.svelte";
  import Overview from "../components/Overview.svelte";
  import { addMeal, deleteMeal, updateMeal } from "../actions/meal";
  import type { Meal, Ingredient } from "../types";
  import { mealsS, savedMealsS, savedIngredientsS } from "../stores";
  import { goToConfig } from "../actions/page";
  import Split from "./Split.svelte";

  let meals: Meal[];
  mealsS.subscribe((v) => {
    meals = v;
  });

  let savedMeals: Meal[];
  savedMealsS.subscribe((v) => {
    savedMeals = v;
  });

  let savedIngredients: Ingredient[];
  savedIngredientsS.subscribe((v) => {
    savedIngredients = v;
  });
</script>

<Split>
  <Overview slot="Top" />
  <MealHistory
    slot="Left"
    title="Today's Meals"
    {meals}
    {updateMeal}
    {deleteMeal}
  />
  <NewMeal
    slot="Right"
    title="Add Meal"
    {addMeal}
    autofillMeals={savedMeals}
    autofillIngredients={savedIngredients}
  />
  <svelte:fragment slot="Actions">
    <button on:click={goToConfig} class="actionButton"
      ><i class="gear" /> Configuration</button
    >
  </svelte:fragment>
</Split>

<style>
  .gear {
    background-image: url("/gear.png");
  }
</style>
