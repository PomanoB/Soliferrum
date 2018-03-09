
goog.provide("Falarica.Render.Canvas.Utils");
goog.provide("Falarica.Render.Canvas.Utils.Drawing");


Falarica.Render.Canvas.Utils.Drawing.MoveTransition = function(obj, speed)
{
	var lastX = -1;
	var lastY = -1;
	var lastDrawTime = 0;
	speed /= 1000;
	var originalDraw = obj.draw;
	obj.draw = function(ctx, timeStamp, x, y) {
		if ((x !== lastX || y !== lastY) && lastX >= 0 && lastY >= 0)
		{
			var absX = Math.abs(x - lastX);
			var absY = Math.abs(y - lastY);
			var totalDist = Math.sqrt(absX*absX + absY*absY);
			var moveDist = speed * (timeStamp - lastDrawTime);
			if (moveDist >= totalDist)
			{
				lastX = x;
				lastY = y;
			}
			else
			{
				var normalized = Falarica.Render.Canvas.Utils.VecSubAndNormalize([lastX, lastY], [x, y]);
				lastX += normalized[0] * moveDist;
				lastY += normalized[1] * moveDist;
			}
		}
		else
		{
			lastX = x;
			lastY = y;
		}
		originalDraw.call(obj, ctx, timeStamp, lastX, lastY);
		lastDrawTime = timeStamp;
	};
};

Falarica.Render.Canvas.Utils.Drawing.Offset = function(obj, coord)
{
	var originalDraw = obj.draw;
	obj.draw = function(ctx, timeStamp, x, y){
		originalDraw.call(obj, ctx, timeStamp, x + coord.x, y + coord.y);
	};
};

Falarica.Render.Canvas.Utils.VecSubAndNormalize = function(vec1, vec2)
{
	var vec = [
		vec2[0] - vec1[0],
		vec2[1] - vec1[1]
	];

	var invlen = 1/Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
	vec[0] *= invlen;
	vec[1] *= invlen;
	return vec;
};
