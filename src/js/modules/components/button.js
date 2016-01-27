import Template from './button.hbs';
import { Model, View } from 'backbone';

export default View.extend({
  tagName: 'a',
  template: Template,
  attributes: {
    href: '#',
  },
  events: {
    'click': 'proxyEvent',
  },

  constructor({ modifier, label, visible = true, ...args }) {
    this.model = new Model({ modifier, label, visible });

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

  proxyEvent(event) {
    this.trigger(event.type, event);
  },
});
