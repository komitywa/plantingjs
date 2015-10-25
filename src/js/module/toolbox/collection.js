import Core from 'core';
import ToolboxModel from './model';

const ToolboxCollection = Core.Collection.extend({
  model: ToolboxModel,
});

module.exports = ToolboxCollection;
