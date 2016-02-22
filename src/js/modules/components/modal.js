import { View } from 'backbone';
import modalTemplate from './modal.hbs';

const HIDDEN_CLASS = 'hidden';

export default View.extend({
  initialize() {
    this.render();
    this.$el
      .toggleClass(HIDDEN_CLASS, false);
  },

  _removeElement() {
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
