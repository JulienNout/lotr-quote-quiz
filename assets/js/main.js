const characterNames = ["Frodo", "Gandalf", "Aragorn", "Legolas", "Gimli", "Gollum"];
const characterIds = ["5cd99d4bde30eff6ebccfc15", "5cd99d4bde30eff6ebccfea0", "5cd99d4bde30eff6ebccfbe6", "5cd99d4bde30eff6ebccfd81", "5cd99d4bde30eff6ebccfd23", "5cd99d4bde30eff6ebccfe9e"];
const characterImages = {
  "Frodo": { url: "img/characters/frodo.png", color: "#aec6cf" },
  "Gandalf": { url: "img/characters/gandalf.png", color: "#ffb347" },
  "Aragorn": { url: "img/characters/aragorn.png", color: "#cdb5cd" },
  "Legolas": { url: "img/characters/legolas.png", color: "#77dd77" },
  "Gimli": { url: "img/characters/gimli.png", color: "#fdfd96" },
  "Gollum": { url: "img/characters/gollum.png", color: "#ff6961" }
};

document.addEventListener('DOMContentLoaded', (event) => {
  startQuiz();
});

async function startQuiz() {
  const headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer xvi06TocPJvBmrQC4yZv'
  }

  try {
    const fetchPromises = characterIds.map(characterId => {
      return fetch(`https://the-one-api.dev/v2/quote?character=${characterId}`, { headers: headers })
        .then(response => response.json());
    });

    const quotesResponses = await Promise.all(fetchPromises);
    const quotes = quotesResponses.flatMap(response => response.docs);
    const filteredQuotes = quotes.filter(quote => characterIds.includes(quote.character));

    if (filteredQuotes.length === 0) {
      displayNoQuotesMessage();
      return;
    }

    const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    displayQuote(quote.dialog);

    const shuffledCharacterNames = shuffleArray([...characterNames]);
    const correctCharacterName = characterNames[characterIds.indexOf(quote.character)];

    if (!shuffledCharacterNames.includes(correctCharacterName)) {
      shuffledCharacterNames.pop();
      shuffledCharacterNames.push(correctCharacterName);
    }

    const finalOptions = shuffleArray(shuffledCharacterNames);
    displayOptions(finalOptions, quote.character);
    clearFeedbackMessage();

  } catch (error) {
    handleFetchError(error);
  }
}

function displayQuote(quoteText) {
  const quoteDisplay = document.getElementById('quote');
  quoteDisplay.innerText = `"${quoteText}"`;
}

function displayOptions(options, correctCharacterId) {
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  options.forEach((name) => {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('flex', 'flex-col', 'items-center', 'mb-4');

    const button = document.createElement('button');
    button.classList.add('w-24', 'h-24', 'bg-cover', 'bg-center', 'rounded-full', 'shadow-md', 'cursor-pointer', 'mb-2');
    button.style.backgroundImage = `url(${characterImages[name].url})`;
    button.style.backgroundColor = characterImages[name].color;
    button.addEventListener('click', () => checkAnswer(name, correctCharacterId));

    const label = document.createElement('span');
    label.innerText = name;
    label.classList.add('text-center', 'font-medium');

    optionDiv.appendChild(button);
    optionDiv.appendChild(label);
    optionsContainer.appendChild(optionDiv);
  });
}

function clearFeedbackMessage() {
  const feedbackDisplay = document.getElementById('feedback');
  feedbackDisplay.innerText = '';
}

function displayNoQuotesMessage() {
  const quoteDisplay = document.getElementById('quote');
  quoteDisplay.innerText = 'No quotes found for the selected characters.';
  clearOptions();
}

function clearOptions() {
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
}

function handleFetchError(error) {
  console.error('Error fetching data:', error);
  const quoteDisplay = document.getElementById('quote');
  quoteDisplay.innerText = 'Failed to load quote. Please try again.';
  clearOptions();
  clearFeedbackMessage();
}

function checkAnswer(selectedName, correctCharacterId) {
  const correctName = characterNames[characterIds.indexOf(correctCharacterId)];
  if (selectedName === correctName) {
    displayFeedbackMessage('Correct!');
    setTimeout(() => {
      startQuiz();
    }, 1000);
  } else {
    displayFeedbackMessage('Wrong!');
  }
}

function displayFeedbackMessage(message) {
  const feedbackDisplay = document.getElementById('feedback');
  feedbackDisplay.innerText = message;
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
