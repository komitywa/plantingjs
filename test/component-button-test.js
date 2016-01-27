/* global describe:false */
/* global before:false */
/* global it:false */
import environment from './env/client';
import { equal, notEqual, strictEqual } from 'assert';

const buttonValues = {
  label: 'test',
  modifier: 'tester',
  visible: true,
};

describe('Button Component', () => {
  before((done) => {
    environment.then(() => {
      done();
    });
  });

  let button;

  it('initializes', () => {
    const Button = require('../src/js/modules/components/button');

    button = new Button(buttonValues);
  });

  it('has proper label', () => {
    const label = button.el.innerHTML.trim();

    equal(label, buttonValues.label);
  });

  it('updates label on label change', () => {
    const newLabel = 'test2';
    let label;

    button.model.set('label', newLabel);
    label = button.el.innerHTML.trim();
    equal(label, newLabel);
  });

  it('has custom classname', () => {
    const className = `plantingjs-component-button-${buttonValues.modifier}`;
    const classes = Array.from(button.el.classList);

    notEqual(classes.indexOf(className), -1);
  });

  it('shown because I wanted it', () => {
    strictEqual(button.$el.hasClass('hidden'), false);
  });

  it('hides on demand', () => {
    button.model.set('visible', false);
    strictEqual(button.$el.hasClass('hidden'), true);
  });

  it('emits click event', (done) => {
    button.on('click', () => done());

    setTimeout(() => {
      button.el.click();
    }, 50);
  });
});
