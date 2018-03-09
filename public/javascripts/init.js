
goog.require("goog.dom");

goog.require("Falarica.Application");

goog.provide("Falarica.Init");

(function(){
	var app = Falarica.Application.getInstance();
	app.setRenderOutput(goog.dom.getElement("game"));
	app.start();
})();