import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // Display loading spinner while recipe loads
    recipeView.renderSpinner();
    // await new Promise(resolve => setTimeout(resolve, 1000));  Add delay to make spinner more visible

    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    // Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage());

    // Render pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlServings = function (newServings) {
  // Update recipe servings - state
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  // Render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render pagination buttons
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  // Add bookmark
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addRenderEventHandler(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
