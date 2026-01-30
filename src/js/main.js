/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */
let protein=50
let carbs=250
let fat=65
let sugar=50
let fiber=28
let saturatedFat=20
var todayCalories=0
  var todayProtein=0
  var todayCarbs=0
  var todayFat=0
  var itemsCounter=0
const now = new Date();

const time = now.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true
});
async function meals(params) {
  let response = await fetch(
    "https://nutriplan-api.vercel.app/api/meals/search?q=&page=1&limit=25"
  );
  let data = await response.json();
  const allRecipes = data.results.map((meal) => meal.area);
  const country = [...new Set(allRecipes)];
  var recipes = document.getElementById("all-recipes");
  var count = document.getElementById("recipes-count");
  var countNum = 0;
  var countryName;
  var typeOfMeal;
  var categories = document.getElementById("categories-grid");
  const allTypes = data.results.map((type) => type.category);
  const mealTypes = [...new Set(allTypes)];
  var recipesGrid = document.getElementById("recipes-grid");
  country.forEach((i) => {
    recipes.innerHTML += `
    <button
        class="area-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
            >
            ${i}
    </button>`;
  });
  function AllRecipes(i) {
    recipesGrid.innerHTML += `
    <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="${data.results[i].id}"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${data.results[i].thumbnail}"
                  alt="${data.results[i].name}"
                  data-index=${i}
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  >
                    ${data.results[i].category}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                    ${data.results[i].area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                  ${data.results[i].name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                  ${data.results[i].instructions}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                    ${data.results[i].category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${data.results[i].area}
                  </span>
                </div>
              </div>
            </div>
    `;
  }
  for (let i = 0; i < 25; i++) {
    AllRecipes(i);
  }
  count.innerHTML = `Showing 25 recipes`;
  recipes.addEventListener("click", (e) => {
    countNum = 0;
    recipesGrid.innerHTML = "";
    for (let i = 0; i < 25; i++) {
      if (e.target.id == "allRecipesBtn") {
        countNum++
        AllRecipes(i);
      }
      else if (e.target.outerText == data.results[i].area) {
        countNum++;
        AllRecipes(i);
        countryName = data.results[i].area;
      }

    }
    count.innerHTML = `Showing ${countNum} ${countryName} recipes`;
  });
  mealTypes.forEach((i) => {
    categories.innerHTML += `
    <div
              class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
              data-category="Beef"
            >
              <div class="flex items-center gap-2.5" >
                <div 
                  class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                >
                  <i class="fa-solid fa-drumstick-bite"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${i}</h3>
                </div>
              </div>
            </div>
    `;
  });
  categories.addEventListener("click", (e) => {
    recipesGrid.innerHTML = " ";
    countNum = 0;
    for (let i = 0; i < 25; i++) {
      if (e.target.outerText == data.results[i].category) {
        AllRecipes(i);
        countNum++;
        typeOfMeal = data.results[i].category;
      }
    }
    count.innerHTML = `Showing ${countNum} ${typeOfMeal} recipes`;
  });



  recipesGrid.addEventListener("click", async (e) => {
    document.getElementById("header").classList.add("hidden")
    document.getElementById("search-filters-section").classList.add("hidden")
    document.getElementById("meal-categories-section").classList.add("hidden")
    document.getElementById("all-recipes-section").classList.add("hidden")
    document.getElementById("meal-details").classList.remove("hidden")
    var index = e.target.dataset.index
    console.log(index);
    
    let ingredientsArray = []
    document.getElementById("ingredients").innerHTML = `
<h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto"
                    >${data.results[index].ingredients.length} items</span
                  >
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="ingredient">
                  
                </div>
`
    for (let i = 0; i < data.results[index].ingredients.length; i++) {
      document.getElementById('ingredient').innerHTML += `
  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">${data.results[index].ingredients[i].measure}</span>
                      ${data.results[index].ingredients[i].ingredient}
                    </span>
                  </div>
`
      ingredientsArray.push(data.results[index].ingredients[i].measure + " " + data.results[index].ingredients[i].ingredient)
    }
    for (let i = 0; i < data.results[index].instructions.length; i++) {
      document.getElementById("instructions").innerHTML += `
  
      <div
        class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div
          class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
        >
          ${i + 1}
        </div>
        <p class="text-gray-700 leading-relaxed pt-2">
          ${data.results[index].instructions[i]}
        </p>
      </div>
`
    }
    const youtubeUrl = data.results[index].youtube;
    const videoId = youtubeUrl.split("v=")[1];

    document.getElementById("videoSection").innerHTML = `
<h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-video text-red-500"></i>
                  Video Tutorial
                </h2>
                <div
                  class="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                >
                  <iframe
                    src="https://www.youtube.com/embed/${videoId}"
                    class="absolute inset-0 w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  >
                  </iframe>
                </div>
`
    document.getElementById("heroSection").innerHTML = `
    <div class="relative h-80 md:h-96">
              <img
                src="${e.target.src}"
                alt="${data.results[index].name}"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span
                    class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
                    >${data.results[index].category}</span
                  >
                  <span
                    class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
                    >${data.results[index].area}</span
                  >
                  <span
                    class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"
                    >Casserole</span
                  >
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                  ${data.results[index].name}
                </h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-clock"></i>
                    <span>30 min</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span id="hero-servings">Calculating...</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-fire"></i>
                    <span id="hero-calories">Calculating...</span>
                  </span>
                </div>
              </div>
            </div>
            `
    // ingredientsArray = JSON.stringify(ingredientsArray)
    let analyze = await analyzeRecipe(data.results[index].name, ingredientsArray)
    console.log(analyze);

    console.log(ingredientsArray);




document.getElementById("hero-servings").innerHTML=`${analyze.data.servings } servings`
document.getElementById("hero-calories").innerHTML=`${analyze.data.perServing.calories} cal/serving`


    document.getElementById("nutrition").innerHTML = `
  <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                  Nutrition Facts
                </h2>
                <div id="nutrition-facts-container">
                  <p class="text-sm text-gray-500 mb-4">Per serving</p>

                  <div
                    class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl"
                  >
                    <p class="text-sm text-gray-600">Calories per serving</p>
                    <p class="text-4xl font-bold text-emerald-600">${analyze.data.perServing.calories}</p>
                    <p class="text-xs text-gray-500 mt-1">Total: ${analyze.data.totals.calories} cal</p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                      </div>
                      <span class="font-bold text-gray-900">${analyze.data.perServing.protein}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-emerald-500 h-2 rounded-full"
                        style="width: ${Math.min(((analyze.data.perServing.protein) / (protein)) * 100,100)}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                      </div>
                      <span class="font-bold text-gray-900">${analyze.data.perServing.carbs}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full"
                        style="width: ${Math.min(((analyze.data.perServing.carbs) / (carbs)) * 100,100)}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                      </div>
                      <span class="font-bold text-gray-900">${analyze.data.perServing.fat}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-purple-500 h-2 rounded-full"
                        style="width:${Math.min(((analyze.data.perServing.fat) / (fat)) * 100,100)}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                      </div>
                      <span class="font-bold text-gray-900">${analyze.data.perServing.fiber}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-orange-500 h-2 rounded-full"
                        style="width:${Math.min(((analyze.data.perServing.fiber) / (fiber)) * 100,100)}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                      </div>
                      <span class="font-bold text-gray-900">${analyze.data.perServing.sugar}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-pink-500 h-2 rounded-full"
                        style="width:${Math.min(((analyze.data.perServing.sugar) / (sugar)) * 100 ,100)}%"
                      ></div>
                      </div>

                      <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Saturated Fat</span>
                      </div>
                      <span class="font-bold text-gray-900">${analyze.data.perServing.saturatedFat}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full"
                        style="width: ${Math.min((((analyze.data.perServing.saturatedFat) / (saturatedFat)) * 100),100)}%"
                      ></div>

                    </div>
                    </div>
                  </div>

                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-900 mb-3">
                      Other
                    </h3>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                        <span class="font-medium">${analyze.data.perServing.cholesterol}mg</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Sodium</span>
                        <span class="font-medium">${analyze.data.perServing.sodium}mg</span>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
`
const logBtn = document.getElementById('log-meal-btn')
  logBtn.replaceWith(logBtn.cloneNode(true)) 

document.getElementById('log-meal-btn').addEventListener('click',()=>{

  todayCalories+=analyze.data.perServing.calories
  todayProtein+=analyze.data.perServing.protein
  todayCarbs+=analyze.data.perServing.carbs
  todayFat+=analyze.data.perServing.fat
  itemsCounter++
  console.log(itemsCounter);
  

if(itemsCounter==0){
    document.getElementById('empty').classList.remove('hidden')
  }
else{
  document.getElementById('empty').classList.add('hidden')
}

  document.getElementById('progressBars').innerHTML =`
              <!-- Calories Progress -->
              <div class="bg-emerald-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Calories</span
                  >
                  <span class="text-sm text-gray-500">${todayCalories} / 2000 kcal</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-emerald-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCalories/2000)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Protein Progress -->
              <div class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Protein</span
                  >
                  <span class="text-sm text-gray-500">${todayProtein} / 50 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayProtein/50)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Carbs Progress -->
              <div class="bg-amber-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Carbs</span>
                  <span class="text-sm text-gray-500">${todayCarbs} / 250 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-amber-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCarbs/250)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Fat Progress -->
              <div class="bg-purple-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Fat</span>
                  <span class="text-sm text-gray-500">${todayFat} / 65 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-purple-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayFat/65)*100,100)}%"
                  ></div>
                </div>
              </div>
  `
document.getElementById('loggedItems').innerHTML =`
    <h4 class="text-sm font-semibold text-gray-700" >
                  Logged Items (${itemsCounter})
                </h4>
                
  `
  document.getElementById('todayCal').innerHTML=`${todayCalories}`
  console.log(data.results[e.target.dataset.index].name)

document.getElementById('logged-items-list').innerHTML +=`
<div class="logged-item border-t border-gray-200 pt-4" id="items" data-calories="${analyze.data.perServing.calories}"
       data-protein="${analyze.data.perServing.protein}"
       data-carbs="${analyze.data.perServing.carbs}"
       data-fat="${analyze.data.perServing.fat}">
            <div class="space-y-3 max-h-96 overflow-y-auto">
                
                    <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div class="flex items-center gap-4">
                            <img src="${data.results[index].thumbnail}" alt="${data.results[index].name}" class="w-14 h-14 rounded-xl object-cover">
                            <div>
                                <p class="font-semibold text-gray-900">${data.results[index].name}</p>
                                <p class="text-sm text-gray-500">
                                    1 serving
                                    <span class="mx-1">•</span>
                                    <span class="text-emerald-600">Recipe</span>
                                </p>
                                <p class="text-xs text-gray-400 mt-1">${time}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-lg font-bold text-emerald-600">${analyze.data.perServing.calories}</p>
                                <p class="text-xs text-gray-500">kcal</p>
                            </div>
                            <div class="hidden md:flex gap-2 text-xs text-gray-500">
                                <span class="px-2 py-1 bg-blue-50 rounded">${analyze.data.perServing.protein}g P</span>
                                <span class="px-2 py-1 bg-amber-50 rounded">${analyze.data.perServing.carbs}g C</span>
                                <span class="px-2 py-1 bg-purple-50 rounded">${analyze.data.perServing.fat}g F</span>
                            </div>
                            <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="0" fdprocessedid="wi6drx">
                                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash-can" data-prefix="fas" data-icon="trash-can" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"></path></svg></i>
                            </button>
                        </div>
                    </div>
                
            </div>
        </div>`

        
}) 
const logitems = document.getElementById('logged-items-list')
  logitems.replaceWith(logitems.cloneNode(true))
document.getElementById('logged-items-list').addEventListener('click',(e)=>{
  
  console.log(e.target.classList.contains('remove-foodlog-item'));

  itemsCounter--
  console.log(itemsCounter);
  const removeBtn = e.target.closest('.remove-foodlog-item');
  if (!removeBtn) return;

  const item = removeBtn.closest('.logged-item');
  if (!item) return;

  item.remove();

    todayCalories -= Number(item.dataset.calories);
  todayProtein -= Number(item.dataset.protein).toFixed(2);
  todayCarbs -= Number(item.dataset.carbs);
  todayFat -= (item.dataset.fat);
  console.log(item.dataset.fat);
  console.log(e.target.classList.contains('remove-foodlog-item'));
  
  // if (e.target.classList.contains('remove-foodlog-item')) {
  //   const item = e.target.closest('.logged-item');
  //   item.remove();
  // }
  if(itemsCounter==0){
    document.getElementById('empty').classList.remove('hidden')
  }
else{
  document.getElementById('empty').classList.add('hidden')
}
document.getElementById('progressBars').innerHTML =`
              <!-- Calories Progress -->
              <div class="bg-emerald-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Calories</span
                  >
                  <span class="text-sm text-gray-500">${todayCalories} / 2000 kcal</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-emerald-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCalories/2000)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Protein Progress -->
              <div class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Protein</span
                  >
                  <span class="text-sm text-gray-500">${todayProtein} / 50 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayProtein/50)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Carbs Progress -->
              <div class="bg-amber-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Carbs</span>
                  <span class="text-sm text-gray-500">${todayCarbs} / 250 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-amber-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCarbs/250)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Fat Progress -->
              <div class="bg-purple-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Fat</span>
                  <span class="text-sm text-gray-500">${todayFat} / 65 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-purple-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayFat/65)*100,100)}%"
                  ></div>
                </div>
              </div>
  `
document.getElementById('todayCal').innerHTML=`${todayCalories}`
document.getElementById('loggedItems').innerHTML =`
  Logged Items (${itemsCounter})
  `

})
document.getElementById('clear-foodlog').addEventListener('click',()=>{
document.getElementById('logged-items-list').innerHTML=""
  document.getElementById('logged-items-list').innerHTML=`
<div class="text-center py-8 text-gray-500 " id="empty">
                  <i
                    class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"
                  ></i>
                  <p class="font-medium">No meals logged today</p>
                  <p class="text-sm">
                    Add meals from the Meals page or scan products
                  </p>
                </div>`
itemsCounter=0
document.getElementById('empty').classList.remove('hidden')
console.log(itemsCounter);

document.getElementById('loggedItems').innerHTML =`
  Logged Items (${itemsCounter})
  `
  itemsCounter=0
todayCalories=0
todayProtein=0
todayCarbs=0
todayFat=0
itemsCounter=0
document.getElementById('todayCal').innerHTML=`${todayCalories}`
document.getElementById('progressBars').innerHTML =`
              <!-- Calories Progress -->
              <div class="bg-emerald-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Calories</span
                  >
                  <span class="text-sm text-gray-500">${todayCalories} / 2000 kcal</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-emerald-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCalories/2000)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Protein Progress -->
              <div class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Protein</span
                  >
                  <span class="text-sm text-gray-500">${todayProtein} / 50 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayProtein/50)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Carbs Progress -->
              <div class="bg-amber-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Carbs</span>
                  <span class="text-sm text-gray-500">${todayCarbs} / 250 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-amber-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCarbs/250)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Fat Progress -->
              <div class="bg-purple-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Fat</span>
                  <span class="text-sm text-gray-500">${todayFat} / 65 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-purple-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayFat/65)*100,100)}%"
                  ></div>
                </div>
              </div>
  `
 
})
  




});

const today = new Date();
var bgcolor=""
var todayId=""
for (let i =6; i >= 0; i--) {
  const d = new Date();
  d.setDate(today.getDate() - i);

if(i==0){
  bgcolor="bg-gray-100 px-5 py-3 rounded-xl"
  todayId=`id="todayCal"`
}
  const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
  const dayNumber = d.getDate();
document.getElementById("weekly-chart").innerHTML +=`
<div class="text-center ${bgcolor}">
<p class="text-gray-400">${dayName}</p>
<h4>${dayNumber}</h4>
<p class="text-gray-400" ${todayId}>0 </p>
<p class="text-gray-400">kcal</p>
</div>
`
const formattedDate = today.toLocaleDateString("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric"
});

document.getElementById('foodlog-date').innerHTML=`${formattedDate}`
}

  


  document.getElementById("back-to-meals-btn").addEventListener('click', () => {

    document.getElementById("header").classList.remove("hidden")
    document.getElementById("search-filters-section").classList.remove("hidden")
    document.getElementById("meal-categories-section").classList.remove("hidden")
    document.getElementById("all-recipes-section").classList.remove("hidden")
    document.getElementById("meal-details").classList.add("hidden")
  })
}
meals();




async function analyzeRecipe(Name, ingredients) {


  let response = await fetch('https://nutriplan-api.vercel.app/api/nutrition/analyze'
    , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'eLK1pgRvFxwlnJvcG5Eip948ywkgtB6K8WZJfgvb'
      },
      body: JSON.stringify({
        title: `${Name}`,
        ingredients: ingredients
      })
    }
  );
  var nutritionFacts = await response.json();
  return nutritionFacts
}

























async function GetProductByBarcode(barcode) {
  let response = await fetch(
    `https://nutriplan-api.vercel.app/api/products/barcode/${barcode}`
  );
  let data = await response.json();
  return data
}
document.getElementById('productScanner').addEventListener('click', () => {
  document.getElementById("header").classList.add("hidden")
  document.getElementById("search-filters-section").classList.add("hidden")
  document.getElementById("meal-categories-section").classList.add("hidden")
  document.getElementById("all-recipes-section").classList.add("hidden")
  document.getElementById("meal-details").classList.add("hidden")
  document.getElementById('products-section').classList.remove("hidden")

})
document.getElementById('lookup-barcode-btn').addEventListener('click', async () => {
  const barcode = document.getElementById('barcode-input').value;
  document.getElementById('products-grid').innerHTML =`
  <div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
</div>`
  var data = await GetProductByBarcode(barcode)
  const res = data.result;
  document.getElementById('products-grid').innerHTML = ""
  console.log(res);

  let protein = 0
  let carbs = 0
  let fat = 0
  let sugar = 0
  let novaGroup = "hidden"
  if (res.nutrients) {
    if (res.nutrients.protein != null) { protein = res.nutrients.protein }
    if (res.nutrients.carbs != null) { carbs = res.nutrients.carbs }
    if (res.nutrients.fat != null) { fat = res.nutrients.fat }
    if (res.nutrients.sugar != null) { sugar = res.nutrients.sugar }
  }
  if (res.novaGroup != null) { novaGroup = "" }

  document.getElementById('products-grid').innerHTML += `
      <div
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-barcode="${res.barcode}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${res.image}"
                    alt="${res.name}"
                    data-barcode="${res.barcode}"
                    loading="lazy"
                    
                  />

                  <!-- Nutri-Score Badge -->
                  <div
                    class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase"
                  >
                    Nutri-Score ${res.nutritionGrade}
                  </div>

                  <!-- NOVA Badge -->
                  <div
                    class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${novaGroup}"
                    title="NOVA ${res.novaGroup}"
                  >
                    ${res.novaGroup}
                  </div>
                </div>

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                    ${res.brand}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                    ${res.name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    <span
                      ><i class="fa-solid fa-weight-scale mr-1"></i>250g</span
                    >
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>350 kcal/100g</span
                    >
                  </div>
                  <!-- Mini Nutrition -->
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${protein}g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${carbs}g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${fat}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${sugar}g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>`


})




async function GetProductByName(Name) {
  let response = await fetch(
    `https://nutriplan-api.vercel.app/api/products/search?q=${Name}&page=1&limit=24`
  );
  let data = await response.json();
  return data
}

document.getElementById('search-product-btn').addEventListener('click', async () => {
  const productName = document.getElementById('product-search-input').value;
  document.getElementById('products-grid').innerHTML =`
  <div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
</div>`
  var data = await GetProductByName(productName)
  const res = data.results;
  document.getElementById('products-grid').innerHTML = ""
  // console.log(res[i]);
  for (let i = 0; i < data.results.length; i++) {
    let protein = 0
    let carbs = 0
    let fat = 0
    let sugar = 0
    let novaGroup = "hidden"
    let nutritionGrade = " "
    if (res[i].nutrients) {
      if (res[i].nutrients.protein != null) { protein = res[i].nutrients.protein }
      if (res[i].nutrients.carbs != null) { carbs = res[i].nutrients.carbs }
      if (res[i].nutrients.fat != null) { fat = res[i].nutrients.fat }
      if (res[i].nutrients.sugar != null) { sugar = res[i].nutrients.sugar }
    }
    if (res[i].novaGroup != null) { novaGroup = "" }

    document.getElementById('products-grid').innerHTML += `
      <div
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-barcode="${res[i].barcode}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${res[i].image}"
                    alt="${res[i].name}"
                    loading="lazy"
                    data-barcode="${res[i].barcode}"
                  />

                  <!-- Nutri-Score Badge -->
                  <div
                    class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase"
                  >
                    Nutri-Score ${res[i].nutritionGrade}
                  </div>

                  <!-- NOVA Badge -->
                  <div
                    class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${novaGroup}"
                    title="NOVA ${res[i].novaGroup}"
                  >
                    ${res[i].novaGroup}
                  </div>
                </div>

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                    ${res[i].brand}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                    ${res[i].name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    <span
                      ><i class="fa-solid fa-weight-scale mr-1"></i>250g</span
                    >
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>350 kcal/100g</span
                    >
                  </div>
                  <!-- Mini Nutrition -->
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${protein}g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${carbs}g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${fat}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${sugar}g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>`

  }



})



document.getElementById("mealsAndResipes").addEventListener('click',()=>{
  document.getElementById("header").classList.remove("hidden")
  document.getElementById("search-filters-section").classList.remove("hidden")
  document.getElementById("meal-categories-section").classList.remove("hidden")
  document.getElementById("all-recipes-section").classList.remove("hidden")
  document.getElementById("meal-details").classList.remove("hidden")
  document.getElementById('products-section').classList.add("hidden")
  document.getElementById('foodlog-section').classList.remove("hidden")

})

document.getElementById("foodLog").addEventListener('click',()=>{
  document.getElementById("header").classList.add("hidden")
  document.getElementById("search-filters-section").classList.add("hidden")
  document.getElementById("meal-categories-section").classList.add("hidden")
  document.getElementById("all-recipes-section").classList.add("hidden")
  document.getElementById("meal-details").classList.add("hidden")
  document.getElementById('products-section').classList.add("hidden")
  document.getElementById('foodlog-section').classList.remove("hidden")

})










document.getElementById('products-grid').addEventListener('click', async(e) => {

    console.log(e.target);
    const card = e.target.closest('.product-card');
  if (!card) return;

  const img = card.querySelector('img');
  if (!img) return;
 console.log(img.src);
  console.log(img.dataset);
  console.log(img.dataset.barcode);
  var data = await GetProductByBarcode(img.dataset.barcode)
  const res = data.result;
  console.log(res);


  document.getElementById('modal-content').innerHTML =`<div class="p-6">
            <!-- Header -->
            <div class="flex items-start gap-6 mb-6">
                <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    
                        <img src="${res.image}" alt="${res.name}" class="w-full h-full object-contain">
                    
                </div>
                <div class="flex-1">
                    <p class="text-sm text-emerald-600 font-semibold mb-1">${res.brand}/p>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${res.name}</h2>
                    <p class="text-sm text-gray-500 mb-3">${res.nutrients.calories} cl</p>
                    
                    <div class="flex items-center gap-3">
                        
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: #03814120">
                                <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: #038141">
                                    ${res.nutritionGrade}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: #038141">Nutri-Score</p>
                                    <p class="text-[10px] text-gray-600">${res.nutritionGrade} </p>
                                </div>
                            </div>
                        
                        
                        
                    </div>
                </div>
                <button class="close-product-modal text-gray-400 hover:text-gray-600">
                    <i class="text-2xl" data-fa-i2svg=""><svg class="svg-inline--fa fa-xmark" data-prefix="fas" data-icon="xmark" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"></path></svg></i>
                </button>
            </div>
            
            <!-- Nutrition Facts -->
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="text-emerald-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-chart-pie" data-prefix="fas" data-icon="chart-pie" role="img" viewBox="0 0 576 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M512.4 240l-176 0c-17.7 0-32-14.3-32-32l0-176c0-17.7 14.4-32.2 31.9-29.9 107 14.2 191.8 99 206 206 2.3 17.5-12.2 31.9-29.9 31.9zM222.6 37.2c18.1-3.8 33.8 11 33.8 29.5l0 197.3c0 5.6 2 11 5.5 15.3L394 438.7c11.7 14.1 9.2 35.4-6.9 44.1-34.1 18.6-73.2 29.2-114.7 29.2-132.5 0-240-107.5-240-240 0-115.5 81.5-211.9 190.2-234.8zM477.8 288l64 0c18.5 0 33.3 15.7 29.5 33.8-10.2 48.4-35 91.4-69.6 124.2-12.3 11.7-31.6 9.2-42.4-3.9L374.9 340.4c-17.3-20.9-2.4-52.4 24.6-52.4l78.2 0z"></path></svg></i>
                    Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                </h3>
                
                <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                    <p class="text-4xl font-bold text-gray-900">${res.nutrients.calories}</p>
                    <p class="text-sm text-gray-500">Calories</p>
                </div>
                
                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-emerald-500 h-2 rounded-full" style="width: ${Math.min((res.nutrients.protein/protein)*100,100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-emerald-600">${res.nutrients.protein}g</p>
                        <p class="text-xs text-gray-500">Protein</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min((res.nutrients.carbs/carbs)*100,100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-blue-600">${res.nutrients.carbs}g</p>
                        <p class="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-purple-500 h-2 rounded-full" style="width:${Math.min((res.nutrients.fat/fat)*100,100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-purple-600">${res.nutrients.fat}g</p>
                        <p class="text-xs text-gray-500">Fat</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-orange-500 h-2 rounded-full" style="width: ${Math.min((res.nutrients.sugar/sugar)*100,100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-orange-600">${res.nutrients.sugar}g</p>
                        <p class="text-xs text-gray-500">Sugar</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
                  
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${res.nutrients.fiber}g</p>
                        <p class="text-xs text-gray-500">Fiber</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${res.nutrients.sodium}g</p>
                        <p class="text-xs text-gray-500">Sodium</p>
                    </div>
                    
                </div>
            </div>
            
            <!-- Additional Info -->
            
                <div class="bg-gray-50 rounded-xl p-5 mb-6">
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-list" data-prefix="fas" data-icon="list" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"></path></svg></i>
                        Ingredients
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed">OBD1 999 999 1112606 266963207 mb</p>
                </div>
            
            
            
            
            <!-- Actions -->
            <div class="flex gap-3">
                <button id="addLogProduct" class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="6111035000430">
                    <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>Log This Food
                </button>
                <button id="close-modal" class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Close
                </button>
            </div>
        </div>`;

        document.getElementById('addLogProduct').addEventListener('click',()=>{
        todayCalories+=res.nutrients.calories
  todayProtein+=res.nutrients.protein
  todayCarbs+=res.nutrients.carbs
  todayFat+=res.nutrients.fat
  itemsCounter++
  console.log(itemsCounter);
if(itemsCounter==0){
    document.getElementById('empty').classList.remove('hidden')
  }
else{
  document.getElementById('empty').classList.add('hidden')
}
document.getElementById('todayCal').innerHTML=`${todayCalories}`
document.getElementById('progressBars').innerHTML =`
              <!-- Calories Progress -->
              <div class="bg-emerald-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Calories</span
                  >
                  <span class="text-sm text-gray-500">${todayCalories} / 2000 kcal</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-emerald-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCalories/2000)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Protein Progress -->
              <div class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Protein</span
                  >
                  <span class="text-sm text-gray-500">${todayProtein} / 50 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayProtein/50)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Carbs Progress -->
              <div class="bg-amber-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Carbs</span>
                  <span class="text-sm text-gray-500">${todayCarbs} / 250 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-amber-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCarbs/250)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Fat Progress -->
              <div class="bg-purple-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Fat</span>
                  <span class="text-sm text-gray-500">${todayFat} / 65 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-purple-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayFat/65)*100,100)}%"
                  ></div>
                </div>
              </div>
  `
  document.getElementById('loggedItems').innerHTML =`
    <h4 class="text-sm font-semibold text-gray-700" >
                  Logged Items (${itemsCounter})
                </h4>
                
  `
  document.getElementById('logged-items-list').innerHTML+=`
        <div class="logged-item flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all" 
        data-calories="${res.nutrients.calories}"
       data-protein="${res.nutrients.protein}"
       data-carbs="${res.nutrients.carbs}"
       data-fat="${res.nutrients.fat}">
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <i class="text-blue-600 text-xl" data-fa-i2svg=""><svg class="svg-inline--fa fa-box" data-prefix="fas" data-icon="box" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"></path></svg></i>
                                </div>
                            <div>
                                <p class="font-semibold text-gray-900">${res.name}</p>
                                <p class="text-sm text-gray-500">
                                    ${res.brand}
                                    <span class="mx-1">•</span>
                                    <span class="text-blue-600">Product</span>
                                </p>
                                <p class="text-xs text-gray-400 mt-1">${time}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-lg font-bold text-emerald-600">${res.nutrients.calories}</p>
                                <p class="text-xs text-gray-500">kcal</p>
                            </div>
                            <div class="hidden md:flex gap-2 text-xs text-gray-500">
                                <span class="px-2 py-1 bg-blue-50 rounded">${res.nutrients.protein}g P</span>
                                <span class="px-2 py-1 bg-amber-50 rounded">${res.nutrients.carbs}g C</span>
                                <span class="px-2 py-1 bg-purple-50 rounded">${res.nutrients.fat}g F</span>
                            </div>
                            <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="1">
                                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash-can" data-prefix="fas" data-icon="trash-can" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"></path></svg></i>
                            </button>
                        </div>
                    </div>`
document.querySelectorAll('.remove-foodlog-item').forEach(remove=>{
  remove.addEventListener('click',(e)=>{

  
  itemsCounter--
  console.log(itemsCounter);
  const removeBtn = e.target.closest('.remove-foodlog-item');
  if (!removeBtn) return;

  const item = removeBtn.closest('.logged-item');
  if (!item) return;

  item.remove();
    todayCalories -= Number(item.dataset.calories);
  todayProtein -= Number(item.dataset.protein).toFixed(2);
  todayCarbs -= Number(item.dataset.carbs);
  todayFat -= (item.dataset.fat);
  console.log(item.dataset.fat);
  console.log(e.target.classList.contains('remove-foodlog-item'));
  
  // if (e.target.classList.contains('remove-foodlog-item')) {
  //   const item = e.target.closest('.logged-item');
  //   item.remove();
  // }
  if(itemsCounter==0){
    document.getElementById('empty').classList.remove('hidden')
  }
else{
  document.getElementById('empty').classList.add('hidden')
}
document.getElementById('progressBars').innerHTML =`
              <!-- Calories Progress -->
              <div class="bg-emerald-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Calories</span
                  >
                  <span class="text-sm text-gray-500">${todayCalories} / 2000 kcal</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-emerald-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCalories/2000)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Protein Progress -->
              <div class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Protein</span
                  >
                  <span class="text-sm text-gray-500">${todayProtein} / 50 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayProtein/50)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Carbs Progress -->
              <div class="bg-amber-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Carbs</span>
                  <span class="text-sm text-gray-500">${todayCarbs} / 250 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-amber-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCarbs/250)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Fat Progress -->
              <div class="bg-purple-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Fat</span>
                  <span class="text-sm text-gray-500">${todayFat} / 65 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-purple-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayFat/65)*100,100)}%"
                  ></div>
                </div>
              </div>
  `
document.getElementById('todayCal').innerHTML=`${todayCalories}`
document.getElementById('loggedItems').innerHTML =`
  Logged Items (${itemsCounter})
  `
})
})

  document.getElementById('clear-foodlog').addEventListener('click',()=>{
document.getElementById('logged-items-list').innerHTML=""
  document.getElementById('logged-items-list').innerHTML=`
<div class="text-center py-8 text-gray-500 " id="empty">
                  <i
                    class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"
                  ></i>
                  <p class="font-medium">No meals logged today</p>
                  <p class="text-sm">
                    Add meals from the Meals page or scan products
                  </p>
                </div>`
itemsCounter=0
todayCalories=0
todayProtein=0
todayCarbs=0
todayFat=0
itemsCounter=0
document.getElementById('progressBars').innerHTML =`
              <!-- Calories Progress -->
              <div class="bg-emerald-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Calories</span
                  >
                  <span class="text-sm text-gray-500">${todayCalories} / 2000 kcal</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-emerald-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCalories/2000)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Protein Progress -->
              <div class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Protein</span
                  >
                  <span class="text-sm text-gray-500">${todayProtein} / 50 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayProtein/50)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Carbs Progress -->
              <div class="bg-amber-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Carbs</span>
                  <span class="text-sm text-gray-500">${todayCarbs} / 250 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-amber-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayCarbs/250)*100,100)}%"
                  ></div>
                </div>
              </div>
              <!-- Fat Progress -->
              <div class="bg-purple-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Fat</span>
                  <span class="text-sm text-gray-500">${todayFat} / 65 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-purple-500 h-2.5 rounded-full"
                    style="width: ${Math.min((todayFat/65)*100,100)}%"
                  ></div>
                </div>
              </div>
  `
document.getElementById('empty').classList.remove('hidden')
console.log(itemsCounter);
document.getElementById('todayCal').innerHTML=`${todayCalories}`
document.getElementById('loggedItems').innerHTML =`
  Logged Items (${itemsCounter})
  `
})
  })
        





  const modal = document.getElementById('product-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('product-modal').classList.add('hidden');
  document.getElementById('product-modal').classList.remove('flex');
});
});

