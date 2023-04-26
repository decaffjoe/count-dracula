<script lang="ts">
  import NewMeal from "../components/NewMeal.svelte";
  import MealHistory from "../components/MealHistory.svelte";
  import type { Meal, Ingredient } from "../types";
  import { savedMealsS, savedIngredientsS } from "../stores";
  import {
    addSavedMeal,
    deleteSavedMeal,
    updateSavedMeal,
  } from "../actions/savedMeal";
  import {
    addSavedIngredient,
    deleteSavedIngredient,
    updateSavedIngredient,
  } from "../actions/savedIngredient";
  import Goal from "../components/Goal.svelte";
  import { goToMain } from "../actions/page";
  import Split from "./Split.svelte";
  import IngredientHistory from "../components/IngredientHistory.svelte";
  import NewIngredient from "../components/NewIngredient.svelte";

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
  <Goal slot="Top" />
  <NewMeal
    slot="Right"
    title="Save Meal"
    addMeal={addSavedMeal}
    autofillMeals={null}
    autofillIngredients={savedIngredients}
  />
  <MealHistory
    slot="Left"
    title="Saved Meals"
    meals={savedMeals}
    updateMeal={updateSavedMeal}
    deleteMeal={deleteSavedMeal}
  />
  <svelte:fragment slot="Actions">
    <button on:click={goToMain} class="actionButton"
      ><i class="home" /> Home</button
    >
  </svelte:fragment>
  <NewIngredient
    slot="Right2"
    title="Save Ingredient"
    addIngredient={addSavedIngredient}
    autofillIngredients={null}
    condenseView={false}
  />
  <IngredientHistory
    slot="Left2"
    title="Saved Ingredients"
    ingredients={savedIngredients}
    updateIngredient={updateSavedIngredient}
    deleteIngredient={deleteSavedIngredient}
  />
</Split>

<style>
  .home {
    background-image: url("/home.png");
  }
</style>
