const express = require("express");
const { OpenAI } = require("openai");

const app = express();
const openai = new OpenAI();

app.use(express.json());

GAURDRAILS_PROMPT = `Your goal is to categorize whether the user's text string is a specific edible ingredient or not.

Strictly following these instructions:
- if the string is an edible ingredient, output SUCCESS
- if the string is not an edible ingredient, output FAILED

Examples of edible ingredients: pasta, flour, eggs, milk, steak, broccoli, bell peppers, peanut butter, dark chocalate, rasberries
Examples of non-edible ingredient: staplers, hey whats up, yo yo yo, rock, anime, world wide web, america`

SYSTEM_PROMPT =  `Your goal is to generate a dish that can be made based on a set of ingredients. 

Adhere to the following guidelines:
- You must generate a dish title and a description of the dish. 
- Assume you have access to various common cooking supplies, such as an oven, microwave, pan, wok, pot, water, cooking oil, etc. 
- Do not assume access to any ingredients or seasonings.
- In your description, also mention how to make the dish out of the given ingredients. 
= The quantity of each ingredient does not matter in the recipe - feel free to generate dishes based on any quantity of the ingredients.
- In your description, make sure to mention every ingredient you were given
- DO NOT INCLUDE ANY INGREDIENTS NOT MENTIONED IN THE INGREDIENTS LIST IN YOUR DISH

Please adhere strictly to the following JSON format:
{

    "dish_title": <dish title here>,
    "dish_description": <dish description here>
}

You may be inspired by the following examples:
Given the input of "egg"

You might generate
{
    "dish": "Boiled Egg",
    "description": "A boiled egg is an egg cooked in boiling hot water. You can make a boiled egg by placing an egg in boiling hot water for around eight minutes.
    Then, place the egg in ice water so peeling the shell is easier. If you want the egg yolk to be more or less runny, you can consider boiling for 1-2 minutes more/less"
}

Given the input of "egg, cheese"

You might generate
{
    "dish": "Cheese omelette",
    "description": "A cheese omelette is usually pan-fried mixed up eggs with cheese in between. You can make different types of omelettes by adding different ingredients, such as veggies or ham"
}

Given the input of "pasta, garlic, black pepper, parmesean, san marzano tomatoes, onions, mushrooms, chicken stock"

You might generate
{
    "dish": "Pasta with Marinara Sauce",
    "description": "Pasta with Marina Sauce is a dish consisting of pasta and a red tomato sauce. To make the red sauce, pan fry your aromatics with tomatoes and mushrooms. 
    Then, add chicken stock and wait for the sauce to come to a simmer. In the meantime, start cooking your pasta in boiling water. Make sure you salt the water. When the pasta finishes
    boiling, take out the pasta water and put a bit in the sauce. Then, place combine the pasta with the red sauce and garnish with some more parmesean."
}
`

async function gaurdRails(newIngredient) {
    if (newIngredient == "[NONE]") {
        return true
    }
    completion1  = await openai.chat.completions.create({
        messages: [{ role: "system", content: GAURDRAILS_PROMPT}, {role: "user", content: newIngredient}],
        model: "gpt-3.5-turbo"
    });
    
    res = completion1.choices[0].message.content
    console.log(res)

    if (res == "FAILED") {
            return false
    }
    return true
}

async function getDish(ingredients) {

    processedIngredients = ingredients.join(", ")

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: SYSTEM_PROMPT}, {role: "user", content: processedIngredients}],
        model: "gpt-3.5-turbo",
        response_format: { "type": "json_object" },
      });
    
    res = completion.choices[0].message.content

    console.log(res)
    
    jsonRes = JSON.parse(res)
    return jsonRes
}



app.post("/dish", async (req, res) => {

    ingredients = req.body.ingredients
    newIngredient = req.body.newIngredient

    if (ingredients.length <= 0 || !(typeof newIngredient === 'string')) {
        return res.status(404)
    }

    try {
        // gaurdrailsstep
        validReq = await gaurdRails(newIngredient)
        if (!validReq) {
            try {
                return res.status(200).json(
                    {
                        success: false,
                        message: "Sorry, but you can only input specific edible ingredients",
                    }
                )
            } catch (error) {
                console.log(error.message)
            }
        }
        ret = await getDish(ingredients)
        return res.status(200).json(
            {
                success: true,
                dishTitle: ret["dish_title"],
                dishDescription: ret["dish_description"],
            }
        )
    } catch (error) {
        return res.status(500)
    }
})

app.listen(5050, () => {console.log("server started on port 5050")})
