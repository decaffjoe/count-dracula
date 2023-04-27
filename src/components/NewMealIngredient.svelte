<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { displayRatio } from "../util";
  import {
    type Ingredient,
    type AddIngredient,
    type MealIngredientDto,
    mkMealIngredientDto,
  } from "../types";

  export let addIngredient: AddIngredient;
  export let autofillIngredients: Ingredient[] | null;
  export let newMealIgrDto: MealIngredientDto;
  export let idx: number;
  export let isEdit: boolean;

  let handleSubmit = async () => {
    const r = await addIngredient(newMealIgrDto);
    if (r.ok) {
      // reset newIgr
      newMealIgrDto = mkMealIngredientDto();
    }
  };

  let handleAutofillChange = (e: any) => {
    const v = JSON.parse(e.target.value);
    if (v === null) {
      newMealIgrDto = mkMealIngredientDto();
    } else {
      const { name, servingCalories, servingProtein, servingGrams } = v;
      newMealIgrDto = {
        name,
        servingCalories,
        servingProtein,
        servingGrams,
        amountGrams: 0,
        added: false,
      };
    }
    sendDataUpdateMsg();
  };

  // listened to by <NewMeal />
  const dispatch = createEventDispatcher();

  function sendDataUpdateMsg() {
    dispatch("newMealIgrUpdate", {
      idx,
      ...newMealIgrDto,
    });
  }

  function sendAddMsg() {
    if (
      newMealIgrDto.amountGrams <= 0 ||
      newMealIgrDto.servingGrams <= 0 ||
      newMealIgrDto.servingCalories <= 0 ||
      newMealIgrDto.servingProtein <= 0
    ) {
      console.error("Must provide all numbers greater than 0");
    } else {
      dispatch("newMealIgrAdd", {
        idx,
      });
    }
  }

  function sendCancelMsg() {
    dispatch("newMealIgrCancel", {
      idx,
    });
  }

  function sendEditMsg() {
    dispatch("newMealIgrEdit", {
      idx,
    });
  }

  function sendDeleteMsg() {
    dispatch("newMealIgrDelete", {
      idx,
    });
  }
</script>

{#if isEdit && autofillIngredients?.length > 0}
  <label for="saved">Saved Ingredients</label>
  <select name="saved" id="" on:change={handleAutofillChange}>
    <option value={null}>-</option>
    {#each autofillIngredients as igr}
      <option value={JSON.stringify(igr)}>{igr.name}</option>
    {/each}
  </select>
{/if}
{#if isEdit}
  <form
    class="condense-form"
    on:input={sendDataUpdateMsg}
    on:submit|preventDefault={handleSubmit}
    method="post"
  >
    <div class="row-one">
      <label for="new-igr-name"
        >Name
        <input
          type="text"
          name="newIgr.name"
          bind:value={newMealIgrDto.name}
          id="new-igr-name"
          class="condense-input"
        />
      </label>
      <label for="new-igr-grams"
        >Grams
        <input
          type="number"
          name="newIgr.grams"
          bind:value={newMealIgrDto.servingGrams}
          id="new-igr-grams"
          class="condense-input"
        />
      </label>
      <label for="new-igr-calories"
        >Calories
        <input
          type="number"
          name="newIgr.calories"
          bind:value={newMealIgrDto.servingCalories}
          id="new-igr-calories"
          class="condense-input"
        />
      </label>
      <label for="new-igr-protein"
        >Protein
        <input
          type="number"
          name="newIgr.protein"
          bind:value={newMealIgrDto.servingProtein}
          id="new-igr-protein"
          class="condense-input"
        />
      </label>
      <label for="new-igr-ratio" class="ratio"
        >c/p
        <input
          class="condense-input ratio"
          type="text"
          value={displayRatio(
            newMealIgrDto.servingCalories / newMealIgrDto.servingProtein
          )}
          id="new-igr-ratio"
          disabled
        />
      </label>
    </div>
    <div class="row-two">
      <label for="new-meal-igr-amount"
        >Amt (g)
        <input
          type="number"
          name="new-meal-igr-amount"
          bind:value={newMealIgrDto.amountGrams}
          id="new-meal-igr-amount"
          class="condense-input"
        />
      </label>
      <button on:click|preventDefault={sendAddMsg}>Add</button>
      <button on:click|preventDefault={sendCancelMsg}>Cancel</button>
    </div>
  </form>
{:else}
  <div class="static">
    <label for="static-new-igr-name"
      >Name
      <input
        type="text"
        name="static-new-igr-name"
        bind:value={newMealIgrDto.name}
        id="static-new-igr-name"
        class="condense-input"
        disabled
      />
    </label>
    <label for="static-new-meal-igr-calories"
      >Calories
      <input
        type="number"
        name="static-new-meal-igr-calories"
        value={Math.round(
          (newMealIgrDto.amountGrams / newMealIgrDto.servingGrams) *
            newMealIgrDto.servingCalories
        )}
        id="static-new-meal-igr-calories"
        class="condense-input"
        disabled
      />
    </label>
    <label for="static-new-meal-igr-protein"
      >Protein
      <input
        type="number"
        name="static-new-meal-igr-protein"
        value={Math.round(
          (newMealIgrDto.amountGrams / newMealIgrDto.servingGrams) *
            newMealIgrDto.servingProtein
        )}
        id="static-new-meal-igr-protein"
        class="condense-input"
        disabled
      />
    </label>
    <label for="static-new-meal-igr-amount"
      >Amt (g)
      <input
        type="number"
        name="static-new-meal-igr-amount"
        bind:value={newMealIgrDto.amountGrams}
        id="static-new-meal-igr-amount"
        class="condense-input"
        disabled
      />
    </label>
    <button on:click|preventDefault={sendEditMsg}>Edit</button>
    <button on:click|preventDefault={sendDeleteMsg}>Delete</button>
  </div>
{/if}

<style>
  .row-one {
    grid-area: row-one;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 1vw;
  }

  .row-two {
    grid-area: row-two;
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
  }

  .static {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 0.2vw;
  }

  .condense-form {
    display: grid;
    grid-template-areas: "row-one" "row-two";
  }

  .condense-input {
    max-width: calc(30vw / 5);
  }

  @media (max-width: 1200px) {
    .condense-input {
      max-width: calc(85vw / 5);
    }
  }
</style>
