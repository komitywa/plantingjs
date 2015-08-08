var plantingJSInstance;

$(document).ready(
    function () {
      plantingJSInstance = new PlantingJS({showHelp: true});
      plantingJSInstance.initFromMap($("#viewport"), "/manifesto.json", simple_save_callback);
    }
);
