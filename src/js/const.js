const DefaultSettings = {
  ROTATABILITY: false,
  SCALABILITY: false,
  LAYERABILITY: false,
};

const Event = {
  VISIBLE_CHANGED: 'visible_changed',
  START_PLANTING: 'start_planting',
  SAVE_REQUEST: 'save_request',
  STATE_CHANGED: 'state_changed',
};

const State = {
  INITING: 'initing',
  MAP: 'map',
  PLANTING: 'planting',
  VIEWER: 'viewer',
};

export default { Event, State, DefaultSettings };
