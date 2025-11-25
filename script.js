document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/jokebook';

    // Elementy DOM
    const categoriesList = document.getElementById('categories-list');
    const categoriesError = document.getElementById('categories-error');
    const jokeCategorySelect = document.getElementById('joke-category-select');
    const addCategorySelect = document.getElementById('add-category-select');
    const getJokeBtn = document.getElementById('get-joke-btn');
    const jokeOutput = document.getElementById('joke-output');
    const jokeError = document.getElementById('joke-error');
    const addJokeForm = document.getElementById('add-joke-form');
    const addJokeBtn = document.getElementById('add-joke-btn');
    const addJokeStatus = document.getElementById('add-joke-status');

    let availableCategories = [];

    // --- Funkcja do pobierania i wyświetlania kategorii ---
    async function fetchCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) {
                throw new Error(`Błąd HTTP! Status: ${response.status}`);
            }
            const data = await response.json();
            availableCategories = data.categories;

            // Wyświetlanie listy kategorii
            categoriesList.innerHTML = availableCategories.map(cat => `<li>${cat}</li>`).join('');

            // Wypełnianie rozwijanych list
            const selectOptions = availableCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
            jokeCategorySelect.innerHTML = selectOptions;
            addCategorySelect.innerHTML = selectOptions;

            // Włączanie przycisków po wczytaniu kategorii
            getJokeBtn.disabled = false;
            addJokeBtn.disabled = false;

        } catch (error) {
            console.error('Błąd podczas pobierania kategorii:', error);
            categoriesList.innerHTML = '';
            categoriesError.textContent = 'Nie udało się wczytać kategorii. Upewnij się, że serwer działa.';
            getJokeBtn.disabled = true;
            addJokeBtn.disabled = true;
        }
    }

    // --- Funkcja do pobierania losowego dowcipu ---
    getJokeBtn.addEventListener('click', async () => {
        const category = jokeCategorySelect.value;
        jokeOutput.innerHTML = '<p>Ładowanie...</p>';
        jokeError.textContent = '';

        if (!category) {
            jokeError.textContent = 'Wybierz kategorię.';
            jokeOutput.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/joke/${category}`);
            const data = await response.json();

            if (!response.ok) {
                // Obsługa błędu 404 lub innego błędu serwera
                throw new Error(data.error || `Błąd podczas pobierania dowcipu: Status ${response.status}`);
            }
            console.log(data);
            // Wyświetlanie dowcipu
            jokeOutput.innerHTML = `
                <p class="joke-category">Kategoria: <strong>${category}</strong></p>
                ${data.joke ? `<p class="joke-question">${data.joke}</p>` : ''}
                <p class="joke-answer">Odpowiedź: ${data.response}</p>
            `;

        } catch (error) {
            console.error('Błąd podczas pobierania dowcipu:', error);
            jokeError.textContent = `Błąd: ${error.message}`;
            jokeOutput.innerHTML = '';
        }
    });

    // --- Funkcja do dodawania nowego dowcipu ---
    addJokeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        addJokeStatus.className = '';
        addJokeStatus.textContent = 'Wysyłanie...';

        const category = addCategorySelect.value;
        const question = document.getElementById('joke-question').value.trim();
        const answer = document.getElementById('joke-answer').value.trim();

        if (!category || !answer || !question) {
            addJokeStatus.textContent = 'Wymagana jest kategoria, pytanie i odpowiedź.';
            addJokeStatus.classList.add('failure');
            return;
        }

        const newJoke = { response: answer };
        if (question) {
            newJoke.joke = question;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/joke/${category}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newJoke)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Błąd podczas dodawania dowcipu: Status ${response.status}`);
            }

            addJokeStatus.textContent = `Pomyślnie dodano dowcip do kategorii: ${category}!`;
            addJokeStatus.classList.add('success');
            
            // Opcjonalnie: wyczyść formularz
            addJokeForm.reset();

        } catch (error) {
            console.error('Błąd podczas dodawania dowcipu:', error);
            addJokeStatus.textContent = `Błąd: ${error.message}`;
            addJokeStatus.classList.add('failure');
        }
    });

    // Uruchomienie pobierania kategorii po załadowaniu strony
    fetchCategories();
});