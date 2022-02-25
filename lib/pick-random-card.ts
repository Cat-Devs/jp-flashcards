export const pickRandomCards = (cardsInput: string[], cardsToPick: number = 1, result: string[] = []) => {
  if (!cardsInput.length) {
    return result;
  }

  const randomCardIndex = Math.floor(Math.random() * cardsInput.length);
  const newResult = [...result, cardsInput[randomCardIndex]];

  // Exit before exceeding the input size
  if (result.length >= cardsInput.length) {
    return newResult;
  }

  // Exit once reached the target result size
  if (cardsToPick === result.length + 1) {
    return newResult;
  }

  const newCardsInput = cardsInput.slice(0, randomCardIndex).concat(cardsInput.slice(randomCardIndex + 1));

  return pickRandomCards(newCardsInput, cardsToPick, newResult);
};
