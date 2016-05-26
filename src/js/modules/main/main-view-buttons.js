import Button from '../components/button';

function createButton(label, eventHash, eventContext) {
  const instance = new Button({
    modifier: 'accept',
    visible: false,
    label });

  for (const event in eventHash) {
    instance.on(event, eventHash[event], eventContext);
  }

  return instance;
}

export const submitButton = (...args) =>
  createButton('zrobione!', ...args);

export const initButton = (...args) =>
  createButton('zacznij wysadzać!', ...args);

export const selectButton = (...args) =>
  createButton('wybierz', ...args);
