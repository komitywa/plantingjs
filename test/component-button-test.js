/* global describe:false */
/* global before:false */
/* global beforeEach:false */
/* global afterEach:false */
/* global it:false */
import environment from './env/client';
import { equal, notEqual, strictEqual } from 'assert';
import Button from '../src/js/modules/components/button';

const buttonValues = {
  label: 'test',
  modifier: 'tester',
  visible: true,
};

describe('Button Component',  function () {
  before((done) => {
    environment.then(() => {
      done();
    });
  });

  beforeEach(function() {
    this.button = new Button(buttonValues);
  });

  afterEach(function() {
    this.button = null;
  });

  it('has proper label', function() {
    const label = this.button.el.innerHTML.trim();
    equal(label, buttonValues.label);
  });

  it('updates label on label change', function() {
    const newLabel = 'test2';
    let label;

    this.button.model.set('label', newLabel);
    label = this.button.el.innerHTML.trim();
    equal(label, newLabel);
  });

  it('has custom classname', function() {
    const className = `plantingjs-component-button-${buttonValues.modifier}`;
    const classes = Array.from(this.button.el.classList);

    notEqual(classes.indexOf(className), -1);
  });

  it('shown because I wanted it', function() {
    strictEqual(this.button.$el.hasClass('hidden'), false);
  });

  it('hides on demand', function() {
    this.button.model.set('visible', false);
    strictEqual(this.button.$el.hasClass('hidden'), true);
  });

  it('emits click event', function (done) {
    this.button.on('click', () => done());

    setTimeout(() => {
      this.button.el.click();
    }, 50);
  });
});
