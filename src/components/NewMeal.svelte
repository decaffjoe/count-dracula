<script lang="ts">
  import { displayRatio } from "../util";

  import {
    mkDateString,
    type Meal,
    type MealDto,
    type AddMeal,
    type Ingredient,
    type MealIngredientDto,
    mkMealIngredientDto,
  } from "../types";
  import { mkMealDto } from "../types";
  import NewMealIngredient from "./NewMealIngredient.svelte";

  export let title: string;
  export let addMeal: AddMeal;
  export let autofillMeals: Meal[] | null;
  export let autofillIngredients: Ingredient[] | null;

  let newMealDto: MealDto = mkMealDto();
  let newMealIgrDtos: MealIngredientDto[] = [];
  let currentMealIgrEditIdx: number | null = null;

  let handleSubmit = async () => {
    const r = await addMeal(newMealDto);
    if (r.ok) {
      // reset dtos
      newMealDto = mkMealDto();
      newMealIgrDtos = [];
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

  function addToMeal(igr: MealIngredientDto) {
    const ratio = igr.amountGrams / igr.servingGrams;
    newMealDto.calories += Math.round(ratio * igr.servingCalories);
    newMealDto.protein += Math.round(ratio * igr.servingProtein);
  }

  function subtractFromMeal(igr: MealIngredientDto) {
    const ratio = igr.amountGrams / igr.servingGrams;
    newMealDto.calories -= Math.round(ratio * igr.servingCalories);
    newMealDto.protein -= Math.round(ratio * igr.servingProtein);
  }

  let handleNewMealIgrUpdate = (e: any) => {
    const {
      idx,
      name,
      servingCalories,
      servingProtein,
      servingGrams,
      amountGrams,
      added,
    } = e.detail;

    newMealIgrDtos = [
      ...newMealIgrDtos.slice(0, idx),
      {
        name,
        servingCalories,
        servingProtein,
        servingGrams,
        amountGrams,
        added,
      },
      ...newMealIgrDtos.slice(idx + 1),
    ];
  };

  let handleNewMealIgrAdd = (e: any) => {
    const { idx } = e.detail;
    const igr = newMealIgrDtos[idx];
    if (!igr.added) {
      igr.added = true;
      newMealIgrDtos = [
        ...newMealIgrDtos.slice(0, idx),
        igr,
        ...newMealIgrDtos.slice(idx + 1),
      ];
    }
    // Turn edit mode off
    currentMealIgrEditIdx = null;
    // Add totals to meal
    addToMeal(igr);
  };

  let handleNewMealIgrCancel = (e: any) => {
    const { idx } = e.detail;
    const igr = newMealIgrDtos[idx];
    // If not added, remove idx from array
    if (!igr.added) {
      newMealIgrDtos = [
        ...newMealIgrDtos.slice(0, idx),
        ...newMealIgrDtos.slice(idx + 1),
      ];
    } else {
      // Re-add totals
      addToMeal(igr);
    }
    // Turn edit mode off
    currentMealIgrEditIdx = null;
  };

  let handleNewMealIgrEdit = (e: any) => {
    const { idx } = e.detail;
    const igr = newMealIgrDtos[idx];
    // Subtract totals
    subtractFromMeal(igr);
    // Turn edit mode on
    currentMealIgrEditIdx = idx;
  };

  let handleNewMealIgrDelete = (e: any) => {
    const { idx } = e.detail;
    const igr = newMealIgrDtos[idx];
    // Subtract totals from meal
    subtractFromMeal(igr);
    // Remove idx from array
    newMealIgrDtos = [
      ...newMealIgrDtos.slice(0, idx),
      ...newMealIgrDtos.slice(idx + 1),
    ];
  };
</script>

<h1 class="sectionTitle">{title}</h1>
{#if autofillMeals?.length > 0}
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
  {#each newMealIgrDtos as igr, idx}
    <NewMealIngredient
      newMealIgrDto={igr}
      {idx}
      {autofillIngredients}
      isEdit={idx === currentMealIgrEditIdx}
      addIngredient={async () => ({ ok: true })}
      on:newMealIgrUpdate={handleNewMealIgrUpdate}
      on:newMealIgrAdd={handleNewMealIgrAdd}
      on:newMealIgrCancel={handleNewMealIgrCancel}
      on:newMealIgrEdit={handleNewMealIgrEdit}
      on:newMealIgrDelete={handleNewMealIgrDelete}
    />
  {/each}
  {#if currentMealIgrEditIdx === null}
    <button
      on:click|preventDefault={() => {
        newMealIgrDtos = [...newMealIgrDtos, mkMealIngredientDto()];
        currentMealIgrEditIdx = newMealIgrDtos.length - 1;
      }}
      class="ingredient-button">+ Add Ingredient</button
    >
    <input type="submit" value="Add Meal" />
  {/if}
</form>

<style>
  .ingredient-button {
    display: block;
    text-align: center;
    margin: 0 auto 1vh;
  }
</style>
