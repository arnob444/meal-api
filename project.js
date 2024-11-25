document.addEventListener('DOMContentLoaded', () => {
	const searchBar = document.getElementById('search-bar');
	const foodCartsContainer = document.getElementById('food-carts');
	const modal = document.getElementById('modal');
	const closeModal = document.getElementById('close-modal');

	const foodDetails = {
		name: document.getElementById('food-name'),
		ingredients: document.getElementById('ingredients-list'),
	};

	searchBar.addEventListener('input', async () => {
		const query = searchBar.value.trim();
		if (query) {
			const response = await fetch(
				`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
			);
			const data = await response.json();

			foodCartsContainer.innerHTML = '';

			if (data.meals) {
				data.meals.forEach((meal) => {
					const cart = document.createElement('div');
					cart.classList.add('food-cart');
					cart.innerHTML = `
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <h3>${meal.strMeal}</h3>
            `;
					cart.addEventListener('click', () =>
						displayMealDetails(meal.idMeal)
					);
					foodCartsContainer.appendChild(cart);
				});
			} else {
				foodCartsContainer.innerHTML = '<p>No food found.</p>';
			}
		} else {
			foodCartsContainer.innerHTML = '';
		}
	});

	async function displayMealDetails(mealId) {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
		);
		const data = await response.json();

		if (data.meals && data.meals.length > 0) {
			const meal = data.meals[0];
			const modalImage = document.getElementById('modal-food-image');
			const foodName = document.getElementById('food-name');
			const ingredientsList = document.getElementById('ingredients-list');

			modalImage.src = meal.strMealThumb;
			foodName.textContent = meal.strMeal;

			ingredientsList.innerHTML = '';
			for (let i = 1; i <= 20; i++) {
				const ingredient = meal[`strIngredient${i}`];
				const measure = meal[`strMeasure${i}`];
				if (ingredient && ingredient.trim() !== '') {
					const li = document.createElement('li');
					li.textContent = `${ingredient} - ${measure}`;
					ingredientsList.appendChild(li);
				}
			}

			const modal = document.getElementById('modal');
			modal.style.display = 'flex';
		}
	}

	closeModal.addEventListener('click', () => {
		modal.style.display = 'none';
	});

	window.addEventListener('click', (event) => {
		if (event.target === modal) {
			modal.style.display = 'none';
		}
	});
});
