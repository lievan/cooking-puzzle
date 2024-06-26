import React from "react";
import Header from "./Header";
import Ingredient from "./Ingredient";
import Warning from "./Warning"
import { v4 as uuidv4 } from 'uuid';


const ingredients = [];

function App(props) {
  const [__, setDeletedIngredient] = React.useState("");

  var [formText, setFormText] = React.useState(null);
  var [dishTitle, setDishTitle] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [showWarning, setShowWarning] = React.useState(false);


  var [dishDescription, setDishDescription] = React.useState(
    "Generate a dish here..."
  );
  const [ingredientContent, setIngredientContent] = React.useState("");

  function handleIngredientContent(event) {
    setIngredientContent(event.target.value);
  }

  const addIngredient = async (event) => {
    
    event.preventDefault();
    setShowWarning(false)
  
    // don't add to actual ingredients yet
    var submittedIngredients = ingredients.map((item, index) => (item['content']))
    submittedIngredients.push(ingredientContent)

    try {
      setIsLoading(true)
      const response = await fetch('/dish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: submittedIngredients,
          newIngredient: ingredientContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const responseData = await response.json();

      console.log(responseData)
    
      if (responseData["success"] == false) {
        setShowWarning(true)
        setIsLoading(false); // Set loading state to false
      } else {
        ingredients.push({
          // use random uiud as key
          key: uuidv4(),
          content: ingredientContent,
        });
        dishTitle = responseData["dishTitle"]
        dishDescription = responseData["dishDescription"]
        setIsLoading(false); // Set loading state to false
        setDishTitle(dishTitle);
        setDishDescription(dishDescription);
      }
    } catch (error) {
      console.error('Error submitting form:', error);

      setIsLoading(false); // Set loading state to false
    }
  }


  const onDeleteIngredient = async (key) => {
    setDeletedIngredient(key);
    ingredients.map((ingredient) => {
      if (ingredient.key === key) {
        ingredients.splice(ingredients.indexOf(ingredient), 1);
      }
    });

    if (ingredients.length == 0) {
      // return to empty state if no ingredients
      setDishTitle("");
      setDishDescription("Generate a dish here...");
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/dish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredients.map((item, index) => (item['content'])),
          newIngredient: "[NONE]"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const responseData = await response.json();

      console.log(responseData)

      dishTitle = responseData["dishTitle"]
      dishDescription = responseData["dishDescription"]
      setDishTitle(dishTitle);
      setDishDescription(dishDescription);

      setIsLoading(false); // Set loading state to false
    } catch (error) {
      console.error('Error submitting form:', error);

      setIsLoading(false); // Set loading state to false
    }

  }

  function createIngredient(ingredient) {
    return (
      <Ingredient
        ingredientKey={ingredient.key}
        content={ingredient.content}
        onDelete={onDeleteIngredient}
      />
    );
  }

  return (
    <div className="App">
      <Header />
      <form onSubmit={addIngredient} className="addForm">
        <input
          onChange={handleIngredientContent}
          type="text"
          value={formText}
          placeholder="Add an ingredient..."
        />
        <button class="dishbutton" onClick={addIngredient} type="submit">
          +
        </button>
      </form>
      {showWarning && <Warning message="Invalid ingredient submission!" />}
      <div class="dish">
        {isLoading ? (
           <div className="spinner-container">
             <div className="spinner"></div>
           </div>
        ) : (
          <div>    
            <div>
              <b>{dishTitle}</b>
            </div>
            <div>{dishDescription}</div>
          </div>
        )}
      </div>
      <div>{ingredients.map(createIngredient)}</div>
    </div>
  );
}

export default App;
