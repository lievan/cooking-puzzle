import React from "react";

function Ingredient(props) {
  function deleteIngredient() {
    props.onDelete(props.ingredientKey);
  }
  return (
    <div class="ingredient">
      <p>{props.content}</p>
      <button
        class="dishbutton-delete"
        onClick={deleteIngredient}
        type="submit"
      >
        --
      </button>
    </div>
  );
}

export default Ingredient;
