<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { displayRatio } from "../util";
  import {
    mkIngredientDto,
    type Ingredient,
    type IngredientDto,
    type AddIngredient,
  } from "../types";

  export let title: string;
  export let addIngredient: AddIngredient;
  export let autofillIngredients: Ingredient[] | null;

  let newIgrDto: IngredientDto = mkIngredientDto();

  let handleSubmit = async () => {
    const r = await addIngredient(newIgrDto);
    if (r.ok) {
      // reset newIgr
      newIgrDto = mkIngredientDto();
    }
  };

  let handleAutofillChange = (e: any) => {
    const v = JSON.parse(e.target.value);
    if (v === null) {
      newIgrDto = mkIngredientDto();
    } else {
      const { name, calories, protein, grams } = v;
      newIgrDto = {
        name,
        servingCalories: calories,
        servingProtein: protein,
        servingGrams: grams,
      };
    }
    sendDataUpdateMsg();
  };

  // listened to by <NewMeal />
  const dispatch = createEventDispatcher();
  function sendDataUpdateMsg() {
    dispatch("newIgrUpdate", {
      ...newIgrDto,
    });
  }
</script>

{#if title}
  <h1 class="sectionTitle">{title}</h1>
{/if}
{#if autofillIngredients?.length > 0}
  <label for="saved">Saved Ingredients</label>
  <select name="saved" id="" on:change={handleAutofillChange}>
    <option value={null}>-</option>
    {#each autofillIngredients as igr}
      <option value={JSON.stringify(igr)}>{igr.name}</option>
    {/each}
  </select>
{/if}
<form
  on:input={sendDataUpdateMsg}
  on:submit|preventDefault={handleSubmit}
  method="post"
>
  <label for="new-igr-name"
    >Name
    <input
      type="text"
      name="newIgr.name"
      bind:value={newIgrDto.name}
      id="new-igr-name"
    />
  </label>
  <label for="new-igr-grams"
    >Grams
    <input
      type="number"
      name="newIgr.grams"
      bind:value={newIgrDto.servingGrams}
      id="new-igr-grams"
    />
  </label>
  <label for="new-igr-calories"
    >Calories
    <input
      type="number"
      name="newIgr.calories"
      bind:value={newIgrDto.servingCalories}
      id="new-igr-calories"
    />
  </label>
  <label for="new-igr-protein"
    >Protein
    <input
      type="number"
      name="newIgr.protein"
      bind:value={newIgrDto.servingProtein}
      id="new-igr-protein"
    />
  </label>
  <label for="new-igr-ratio" class="ratio"
    >c/p
    <input
      class="ratio"
      type="text"
      value={displayRatio(newIgrDto.servingCalories / newIgrDto.servingProtein)}
      id="new-igr-ratio"
      disabled
    />
  </label>
  <input type="submit" value="Add Ingredient" />
</form>

<style>
</style>
