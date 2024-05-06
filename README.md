# cooking-puzzle

Add ingredients and generate a dish based on those ingredients. You can also take away ingredients and a new dish will be generated based off of the updated set of ingredients.

<img width="1135" alt="image" src="https://github.com/lievan/cooking-puzzle/assets/42917263/a2ae5ca9-d49b-4623-b56e-7ebe0b7d8974">


## Setup


### Get an openai api key
Set `OPENAI_API_KEY` env var to be your openai api key


### Start the backend server
The backend server takes a request of a list of ingredients and a new ingredient and it returns a generated dish.
1. There is an gaurdrails step that checks if the new input ingredient is a valid ingredient. It does this via an openai call
2. If the new ingredient is a valid ingredient, then it will return a dish description and title
3. In instances where there is no new ingredient, which happens in cases where generations are triggered by deleting an ingredient, pass in ingredient as '[NONE]'

To run the backend server:
`cd server`

`nodemon server`


### Start the front-end
To start the front-end cd into `client` directory and run `npm start`. 

Add ingredients using the add ingredient form. This should trigger a new generation. Subtract ingredients by pressing the subtract button on the ingredient. This should also subtract a new generation.

If you delete all your ingredients, the dish returns to it's empty state.


