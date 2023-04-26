<script lang="ts">
  import { displayRatio } from "../util";

  import {
    mkDateString,
    type Meal,
    type MealDto,
    type AddMeal,
    type Ingredient,
    type IngredientDto,
  } from "../types";
  import { mkMealDto } from "../types";
  import NewIngredient from "./NewIngredient.svelte";

  export let title: string;
  export let addMeal: AddMeal;
  export let autofillMeals: Meal[] | null;
  export let autofillIngredients: Ingredient[] | null;

  let newMealDto: MealDto = mkMealDto();
  let ingredientCount = 0;
  let currentIngredientAmount = 0;

  let handleSubmit = async () => {
    const r = await addMeal(newMealDto);
    if (r.ok) {
      // reset newMeal
      newMealDto = mkMealDto();
    }
  };

  let handleAutofillChange = (e: any) => {
    const v = JSON.parse(e.target.value);
    if (v === null) {
      newMealDto = mkMealDto();
    } else {
      const { name, calories, protein } = v;
      newMealDto = { name, calories, protein, date: mkDateString() };
    }
  };

  function addIngredientRow() {
    ingredientCount += 1;
  }

  function addIngredient(igrDto: IngredientDto) {
    const ratio = currentIngredientAmount / igrDto.grams;
    newMealDto.calories += Math.round(ratio * igrDto.calories);
    newMealDto.protein += Math.round(ratio * igrDto.protein);
    currentIngredientAmount = 0;
    return { ok: true };
  }
</script>

<h1 class="sectionTitle">{title}</h1>
{#if autofillMeals && autofillMeals.length > 0}
  <label for="saved">Saved Meals</label>
  <select name="saved" id="" on:change={handleAutofillChange}>
    <option value={null}>-</option>
    {#each autofillMeals as savedMeal}
      <option value={JSON.stringify(savedMeal)}>{savedMeal.name}</option>
    {/each}
  </select>
{/if}
<form on:submit|preventDefault={handleSubmit} method="post">
  <label for="new-meal-name"
    >Name
    <input
      type="text"
      name="newMeal.name"
      bind:value={newMealDto.name}
      id="new-meal-name"
    />
  </label>
  <label for="new-meal-calories"
    >Calories
    <input
      type="number"
      name="newMeal.calories"
      bind:value={newMealDto.calories}
      id="new-meal-calories"
    />
  </label>
  <label for="new-meal-protein"
    >Protein
    <input
      type="number"
      name="newMeal.protein"
      bind:value={newMealDto.protein}
      id="new-meal-protein"
    />
  </label>
  <label for="new-meal-ratio" class="ratio"
    >c/p
    <input
      class="ratio"
      type="text"
      value={displayRatio(newMealDto.calories / newMealDto.protein)}
      id="new-meal-ratio"
      disabled
    />
  </label>
  {#each Array(ingredientCount) as _}
    <NewIngredient
      title={null}
      {autofillIngredients}
      condenseView={true}
      {addIngredient}
    />
    <label for="new-meal-igr-amount"
      >Amount (g)
      <input
        type="number"
        name="new-meal-igr-amount"
        bind:value={currentIngredientAmount}
        id="new-meal-igr-amount"
      />
    </label>
  {/each}
  <button on:click|preventDefault={addIngredientRow} class="ingredient-button"
    >+ Add Ingredient</button
  >
  <input type="submit" value="Add Meal" />
</form>

<style>
  .ingredient-button {
    display: block;
    text-align: center;
    margin: 0 auto 1vh;
  }
</style>
