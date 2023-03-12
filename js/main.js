/*
	SYST24444 Assignment2
     Project name: My Recipe APP
     Author: Wenya Guo 991661274
     Date: Feb 18, 2023 */

$(document).ready(function () {
  let ingredList = [];
  $("#recipeform").on("submit", function (e) {
    let recipe = {
      id: guidGenerator(),
      dishname: $("#dishname").val(),
      type: $("#type").val(),
      ingredList: ingredList,
      calories: $("#calories").val(),
      desert: $('input[name="radio-choice"]:checked').val(),
      description: $("#description").val(),
    };
    //console.log(recipe);
    addRecipe(recipe);
    ingredList = [];
    e.preventDefault();
  });

  //button click for add ingredient
  $("#addIngredBtn").on("click", function (e) {
    if (ingredList.length < 7) {
      ingredList.push($("#ingred").val());
      $("#ingred").val("");
    } else {
      alert("Sorry, ingredient list is full...");
      $("#ingred").val("");
    }
    e.preventDefault();
  });

  //clear recipes button click
  $("#clearBtn").on("click", function (e) {
    localStorage.removeItem("recipes");
    getRecipes();
    e.preventDefault();
  });
});

//Before homepage loads
$(document).on("pagebeforeshow", "#home", function () {
  getRecipes();
});

//Before detail page loads
$(document).on("pagebeforeshow", "#recipe", function () {
  getRecipe();
});

$(document).on("click", "#recipe", function () {
  getRecipe();
});

//function to generate ID
function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

//function to save meal to Local Storage
function addRecipe(recipe) {
  if (localStorage.getItem("recipes") === null) {
    let recipes = [];
    recipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));
  } else {
    let recipes = JSON.parse(localStorage.getItem("recipes"));
    recipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }
  //clear fields
  $("#dishname").val("");
  $("#type").val("");
  $("#ingred").val("");
  $("#calories").val("");
  $("#description").val("");

  //change page to home page
  $.mobile.changePage("#home");
}

//Function get meals from local storage
function getRecipes() {
  let output = "";
  if (
    localStorage.getItem("recipes") == null ||
    localStorage.getItem("recipes") == "[]"
  ) {
    output = "<li> No recipe now...</li>";
    $("#recipes").html(output).listview("refresh");
  } else {
    let recipes = JSON.parse(localStorage.getItem("recipes"));
    $.each(recipes, function (index, recipe) {
      output += `
				<li>
				<a href="#" onclick="recipeClicked('${recipe.id}')">${recipe.dishname}</a>
				<a href="#" onclick="deleteRecipe('${recipe.id}')"/>
				</li>		
			`;
      $("#recipes").html(output).listview("refresh");
    });
  }
}

//Function to recipeClicked
function recipeClicked(recipeId) {
  sessionStorage.setItem("recipeId", recipeId);
  $.mobile.changePage("#recipe");
}

//function to get recipe details
function getRecipe() {
  if (sessionStorage.getItem("recipeId") === null) {
    $.mobile.changePage("#home");
  } else {
    let recipes = JSON.parse(localStorage.getItem("recipes"));
    $.each(recipes, function (index, recipe) {
      if (recipe.id === sessionStorage.getItem("recipeId")) {
        let output = `
					<h1>${recipe.dishname}</h1>
					<p><strong>Level: </strong> ${recipe.type} </p>
					<p><strong>Ingredients: </strong></p> 
					<p class="longtext"> ${recipe.ingredList} </p>
					<p><strong>Calories: </strong> ${recipe.calories}</p>
					<p><strong>Desert: </strong>${recipe.desert}</p>
					<p class="longtext"><strong>Description: </strong></p>
					
					<p> ${recipe.description}</p>
				`;

        $("#recipeDetails").html(output);
      }
    });
  }
}

//Function to delete recipe
function deleteRecipe(recipeId) {
  let indexToDel = -1;
  let recipes = JSON.parse(localStorage.getItem("recipes"));
  $.each(recipes, function (index, recipe) {
    console.log(index, recipeId, recipe);
    if (recipe.id === recipeId) {
      indexToDel = index;
    }
  });

  if (indexToDel >= 0) recipes.splice(indexToDel, 1);

  localStorage.setItem("recipes", JSON.stringify(recipes));
  getRecipes();
}
