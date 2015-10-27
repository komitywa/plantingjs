import { Collection } from 'core';
import ToolboxModel from './model';

const ToolboxCollection = Collection.extend({
  model: ToolboxModel,
});

module.exports = ToolboxCollection;
