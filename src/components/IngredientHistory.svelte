<script lang="ts">
  import { prec } from "../util";

  import type {
    Ingredient,
    UpdateIngredient,
    DeleteIngredient,
  } from "../types";

  export let title: string;
  export let ingredients: Ingredient[];
  export let updateIngredient: UpdateIngredient;
  export let deleteIngredient: DeleteIngredient;

  let editId: number | undefined;
</script>

<h1 class="sectionTitle">{title}</h1>
<div class="grid">
  {#each ingredients as igr}
    <div class="meal">
      {#if editId !== igr.id}
        <!-- Regular display -->
        <h3>{igr.name}</h3>
        <p>Grams {igr.servingGrams}</p>
        <p>Calories {igr.servingCalories}</p>
        <p>Protein {igr.servingProtein}</p>
        <p class="ratio">
          c/p {prec(igr.servingCalories / igr.servingProtein)}
        </p>
        <button on:click={() => (editId = igr.id)}>Edit</button>
        <button on:click={() => deleteIngredient(igr.id)}>Delete</button>
      {:else}
        <!-- Editing display -->
        <label for="igr-name"
          >Name
          <input
            type="text"
            name="igr.name"
            bind:value={igr.name}
            id="igr-name"
          />
        </label>
        <label for="igr-grams"
          >Grams
          <input
            type="number"
            name="igr.grams"
            bind:value={igr.servingGrams}
            id="igr-grams"
          />
        </label>
        <label for="igr-calories"
          >Calories
          <input
            type="number"
            name="igr.calories"
            bind:value={igr.servingCalories}
            id="igr-calories"
          />
        </label>
        <label for="igr-protein"
          >Protein
          <input
            type="number"
            name="igr.protein"
            bind:value={igr.servingProtein}
            id="igr-protein"
          />
        </label>
        <button
          on:click={() => {
            updateIngredient(igr);
            editId = undefined;
          }}>Save</button
        >
        <button on:click={() => (editId = undefined)}>Cancel</button>
      {/if}
    </div>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 2vw;
    row-gap: 2vh;
  }
  .meal {
    padding: 1vh 2vw;
    border: 2px solid #ddd;
  }
  @media (max-width: 1200px) {
    .grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
