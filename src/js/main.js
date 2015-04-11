
function simple_save_callback() {
    console.log('save callback');
}

var plantingJSInstance;

$(document).ready(
    function () {
      plantingJSInstance = new PlantingJS();
      plantingJSInstance.initFromMap($("#viewport"), "/manifesto.json", simple_save_callback);
    }
);
