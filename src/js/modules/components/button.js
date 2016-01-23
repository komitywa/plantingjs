import { View } from '../../core';
import Template from './button.hbs';
import { Model } from 'backbone';

export default View.extend({
  tagName: 'a',
  template: Template,
  attributes: {
    href: '#',
  },

  constructor(args) {
    const defaults = {...args.defaults};
    this.model = new Model(defaults);

    const modifier = this.model.get('modifier');
    const blockName = 'plantingjs-component-button';
    const classes = [`${blockName}`];

    if (modifier) {
      classes.push(`${blockName}-${modifier}`);
    }

    this.className = classes.join(' ');
    View.call(this, args);
  },

  initialize() {
    this.model.on('change', this.render, this);
    this.render();
  },

  render() {
    const view = this.template(this.model.toJSON());
    this.$el
        .html(view)
        .toggleClass('hidden', !this.model.get('visible'));
  },
});
