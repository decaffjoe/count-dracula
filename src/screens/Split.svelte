<script lang="ts">
</script>

<section>
  <div class="top">
    <slot name="Top" />
  </div>
  <div class="left">
    <slot name="Left" />
  </div>
  <div class="right">
    <slot name="Right" />
  </div>
  <div class="left2">
    <slot name="Left2" />
  </div>
  <div class="right2">
    <slot name="Right2" />
  </div>
</section>
<div class="actions">
  <slot name="Actions" />
</div>

<style>
  section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-areas: "top top" "left right" "left2 right2";
    row-gap: 5vh;
    justify-items: center;
    align-items: center;
    margin-bottom: 5vh;
  }
  .top {
    grid-area: top;
  }
  .left {
    grid-area: left;
  }
  .right {
    grid-area: right;
  }
  .left2 {
    grid-area: left2;
  }
  .right2 {
    grid-area: right2;
  }
  .actions {
    position: absolute;
    top: 2vh;
    right: 12vw;
  }

  @media (max-width: 1200px) {
    section {
      grid-template-columns: 1fr;
      grid-template-areas: "top" "right" "left" "right2" "left2";
      padding-top: 6vh;
    }
  }

  @media (max-width: 600px) {
    .actions {
      top: 1vh;
      right: 8vw;
    }
  }
</style>
