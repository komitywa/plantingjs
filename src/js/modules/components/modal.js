import { View } from 'backbone';
import modalTemplate from './modal.hbs';

const HIDDEN_CLASS = 'hidden';
const CONTENT_CLASS = 'plantingjs-modal-content';

export default View.extend({
  events: {
    'click .plantingjs-modal-background': 'hide',
    'click .plantingjs-modal-close-btn': 'hide',
  },

  constructor({ childView, ...opts }) {
    this.childView = childView;
    View.call(this, opts);
  },

  initialize() {
    this.render();
    this.$el
      .toggleClass(HIDDEN_CLASS, false)
      .find(`.${CONTENT_CLASS}`)
        .html(this.childView.$el);
  },

  hide() {
    this.$el
      .toggleClass(HIDDEN_CLASS, true);
  },

  show() {
    this.$el
      .toggleClass(HIDDEN_CLASS, false);
  },

  _removeElement() {
    this.childView
      .remove();
    this.$el
      .toggleClass(HIDDEN_CLASS, true)
      .children()
      .remove();
  },

  render() {
    this.$el
      .html(modalTemplate());
  },
});
