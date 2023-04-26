<script lang="ts">
  import { displayRatio } from "../util";
  import {
    mkIngredientDto,
    type Ingredient,
    type IngredientDto,
    type AddIngredient,
  } from "../types";

  export let title: string | null;
  export let addIngredient: AddIngredient;
  export let autofillIngredients: Ingredient[] | null;
  export let condenseView: boolean;

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
      newIgrDto = { name, calories, protein, grams };
    }
  };
</script>

{#if title}
  <h1 class="sectionTitle">{title}</h1>
{/if}
{#if autofillIngredients && autofillIngredients.length > 0}
  <label for="saved">Saved Ingredients</label>
  <select name="saved" id="" on:change={handleAutofillChange}>
    <option value={null}>-</option>
    {#each autofillIngredients as igr}
      <option value={JSON.stringify(igr)}>{igr.name}</option>
    {/each}
  </select>
{/if}
<form
  on:submit|preventDefault={handleSubmit}
  method="post"
  class={condenseView ? "condenseForm" : ""}
>
  <label for="new-igr-name"
    >Name
    <input
      type="text"
      name="newIgr.name"
      bind:value={newIgrDto.name}
      id="new-igr-name"
      class={condenseView ? "condenseInput" : ""}
    />
  </label>
  <label for="new-igr-grams"
    >Grams
    <input
      type="number"
      name="newIgr.grams"
      bind:value={newIgrDto.grams}
      id="new-igr-grams"
      class={condenseView ? "condenseInput" : ""}
    />
  </label>
  <label for="new-igr-calories"
    >Calories
    <input
      type="number"
      name="newIgr.calories"
      bind:value={newIgrDto.calories}
      id="new-igr-calories"
      class={condenseView ? "condenseInput" : ""}
    />
  </label>
  <label for="new-igr-protein"
    >Protein
    <input
      type="number"
      name="newIgr.protein"
      bind:value={newIgrDto.protein}
      id="new-igr-protein"
      class={condenseView ? "condenseInput" : ""}
    />
  </label>
  <label for="new-igr-ratio" class="ratio"
    >c/p
    <input
      class="ratio"
      type="text"
      value={displayRatio(newIgrDto.calories / newIgrDto.protein)}
      id="new-igr-ratio"
      disabled
    />
  </label>
  <input type="submit" value="Add ingredient" />
</form>

<style>
  .condenseForm {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 1vw;
  }

  .condenseInput {
    max-width: 30vw;
  }
</style>
