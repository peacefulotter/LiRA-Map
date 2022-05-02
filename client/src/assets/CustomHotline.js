
import L from 'leaflet'

L.Hotline = function (latlngs, options, distances) {

	if ( latlngs.length !== distances.length )
		throw new Error('latlngs and distances should have the same length')

	let projectedData = undefined
	// Plugin is already added to Leaflet
	// if (L.Hotline) {
	// 	return L;
	// }

	/**
	 * Core renderer.
	 * @constructor
	 * @param {HTMLElement | string} canvas - &lt;canvas> element or its id
	 * to initialize the instance on.
	 */
	var Hotline = function (canvas) {
		if (!(this instanceof Hotline)) { return new Hotline(canvas); }

		var defaultPalette = {
			0.0: 'green',
			0.5: 'yellow',
			1.0: 'red'
		};

		this._canvas = canvas = typeof canvas === 'string'
			? document.getElementById(canvas)
			: canvas;

		this._ctx = canvas.getContext('2d');
		this._width = canvas.width;
		this._height = canvas.height;

		this._weight = 5;
		this._weightFunc = undefined
		this._outlineWidth = 1;
		this._outlineColor = 'black';

		this._min = 0;
		this._max = 1;

		this._data = [];

		this.palette(defaultPalette);
	};

	Hotline.prototype = {
		/**
		 * Sets the width of the canvas. Used when clearing the canvas.
		 * @param {number} width - Width of the canvas.
		 */
		width: function (width) {
			this._width = width;
			return this;
		},

		/**
		 * Sets the height of the canvas. Used when clearing the canvas.
		 * @param {number} height - Height of the canvas.
		 */
		height: function (height) {
			this._height = height;
			return this;
		},

		/**
		 * Sets the weight of the path.
		 * @param {number} weight - Weight of the path in px.
		 */
		weight: function (weight) {
			this._weight = weight;
			return this;
		},


		/**
		 * Sets the weight function for the path.
		 * @param {(i: number) => number} weightFunc - Weight Function for the path in px.
		 */
		 weightFunc: function (weightFunc) {
			this._weightFunc = weightFunc;
			return this;
		},

		/**
		 * Sets the width of the outline around the path.
		 * @param {number} outlineWidth - Width of the outline in px.
		 */
		outlineWidth: function (outlineWidth) {
			this._outlineWidth = outlineWidth;
			return this;
		},

		/**
		 * Sets the color of the outline around the path.
		 * @param {string} outlineColor - A CSS color value.
		 */
		outlineColor: function (outlineColor) {
			this._outlineColor = outlineColor;
			return this;
		},

		/**
		 * Sets the palette gradient.
		 * @param {Object.<number, string>} palette  - Gradient definition.
		 * e.g. { 0.0: 'white', 1.0: 'black' }
		 */
		palette: function (palette) {
			var canvas = document.createElement('canvas'),
					ctx = canvas.getContext('2d'),
					gradient = ctx.createLinearGradient(0, 0, 0, 256);

			canvas.width = 1;
			canvas.height = 256;

			for (var i in palette) {
				gradient.addColorStop(i, palette[i]);
			}

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, 1, 256);

			this._palette = ctx.getImageData(0, 0, 1, 256).data;

			return this;
		},

		/**
		 * Sets the value used at the start of the palette gradient.
		 * @param {number} min
		 */
		min: function (min) {
			this._min = min;
			return this;
		},

		/**
		 * Sets the value used at the end of the palette gradient.
		 * @param {number} max
		 */
		max: function (max) {
			this._max = max;
			return this;
		},

		/**
		 * A path to rander as a hotline.
		 * @typedef Array.<{x:number, y:number, z:number}> Path - Array of x, y and z coordinates.
		 */

		/**
		 * Sets the data that gets drawn on the canvas.
		 * @param {(Path|Path[])} data - A single path or an array of paths.
		 */
		data: function (data) {
			this._data = data;
			return this;
		},

		/**
		 * Adds a path to the list of paths.
		 * @param {Path} path
		 */
		add: function (path) {
			this._data.push(path);
			return this;
		},

		/**
		 * Draws the currently set paths.
		 */
		draw: function () {
			var ctx = this._ctx;

			ctx.globalCompositeOperation = 'source-over';
			ctx.lineCap = 'round';

			this._drawOutline(ctx);
			this._drawHotline(ctx);

			return this;
		},

		/**
		 * Gets the RGB values of a given z value of the current palette.
		 * @param {number} value - Value to get the color for, should be between min and max.
		 * @returns {Array.<number>} The RGB values as an array [r, g, b]
		 */
		getRGBForValue: function (value) {
			var valueRelative = Math.min(Math.max((value - this._min) / (this._max - this._min), 0), 0.999);
			var paletteIndex = Math.floor(valueRelative * 256) * 4;

			return [
				this._palette[paletteIndex],
				this._palette[paletteIndex + 1],
				this._palette[paletteIndex + 2]
			];
		},

		getWeight: function (i) {
			return this._weightFunc ? this._weightFunc(i) : this._weight
		},

		/**
		 * Draws the outline of the graphs.
		 * @private
		 */
		_drawOutline: function (ctx) {
			var i, j, dataLength, path, pathLength, pointStart, pointEnd;

			if (this._outlineWidth) {
				for (i = 0, dataLength = this._data.length; i < dataLength; i++) {
					path = this._data[i];

					for (j = 1, pathLength = path.length; j < pathLength; j++) {
						pointStart = path[j - 1];
						pointEnd = path[j];

						ctx.lineWidth = this.getWeight(j - 1) + 2 * this._outlineWidth;

						ctx.strokeStyle = this._outlineColor;
						ctx.beginPath();
						ctx.moveTo(pointStart.x, pointStart.y);
						ctx.lineTo(pointEnd.x, pointEnd.y);
						ctx.stroke();
					}
				}
			}
		},

		_addColorGradient(gradient, point, dist) {
			const rgb = this.getRGBForValue(point.z)
			gradient.addColorStop(dist, 'rgb(' + rgb.join(',') + ')');
		},

		_addGradient: function(ctx, j, pointStart, pointEnd) {
			ctx.lineWidth = this.getWeight(j - 1) 

			// Create a gradient for each segment, pick start and end colors from palette gradient
			const gradient = ctx.createLinearGradient(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y);

			const deltaIndex = pointEnd.i - pointStart.i
			const deltaDist = pointEnd.d - pointStart.d

			for ( let k = pointStart.i; k <= pointEnd.i; k++ )
			{
				const point = projectedData[0][k]
				const dist = distances !== undefined 
					? (point.d - pointStart.d) / (deltaDist  !== 0 ? deltaDist  : 1)
					: (point.i - pointStart.i) / (deltaIndex !== 0 ? deltaIndex : 1)
				this._addColorGradient(gradient, point, dist)
			}

			ctx.strokeStyle = gradient;
			ctx.beginPath();
			ctx.moveTo(pointStart.x, pointStart.y);
			ctx.lineTo(pointEnd.x, pointEnd.y);
			ctx.stroke();
		},

		/**
		 * Draws the color encoded hotline of the graphs.
		 * @private
		 */
		_drawHotline: function (ctx) {
			var i, j, dataLength, path, pathLength, pointStart, pointEnd;

			for (i = 0, dataLength = this._data.length; i < dataLength; i++) 
			{
				path = this._data[i];
				for (j = 1, pathLength = path.length; j < pathLength; j++) 
				{
					pointStart = path[j - 1];
					pointEnd = path[j];
					if ( pointStart.i !== pointEnd.i )
						this._addGradient(ctx, j, pointStart, pointEnd);
				}
			}
		}
	};


	var Renderer = L.Canvas.extend({
		_initContainer: function () {
			L.Canvas.prototype._initContainer.call(this);
			this._hotline = new Hotline(this._container);
		},

		_update: function () {
			L.Canvas.prototype._update.call(this);
			this._hotline.width(this._container.width);
			this._hotline.height(this._container.height);
		},

		_updatePoly: function (layer) {
			if (!this._drawing) { return; }

			var parts = layer._parts;

			if (!parts.length) { return; }

			this._updateOptions(layer);

			console.log(parts);

			// const dataOnView = parts.map(part => {
			// 	const first = part[0].i
			// 	const last = part[part.length - 1].i
			// 	return projectedData[0].slice(first, last + 1)
			// })

			this._hotline
				.data(parts)
				.draw();
		},

		_updateOptions: function (layer) {
			if (layer.options.min != null) {
				this._hotline.min(layer.options.min);
			}
			if (layer.options.max != null) {
				this._hotline.max(layer.options.max);
			}
			if (layer.options.weight != null) {
				this._hotline.weight(layer.options.weight);
			}
			if (layer.options.weightFunc != null) {
				this._hotline.weightFunc(layer.options.weightFunc);
			}
			if (layer.options.outlineWidth != null) {
				this._hotline.outlineWidth(layer.options.outlineWidth);
			}
			if (layer.options.outlineColor != null) {
				this._hotline.outlineColor(layer.options.outlineColor);
			}
			if (layer.options.palette) {
				this._hotline.palette(layer.options.palette);
			}
		}
	});

	var renderer = function (options) {
		return L.Browser.canvas ? new Renderer(options) : null;
	};


	var Util = {
		/**
		 * This is just a copy of the original Leaflet version that support a third z coordinate.
		 * @see {@link http://leafletjs.com/reference.html#lineutil-clipsegment|Leaflet}
		 */
		clipSegment: function (a, b, bounds, useLastCode, round) {
			var codeA = useLastCode ? this._lastCode : L.LineUtil._getBitCode(a, bounds),
					codeB = L.LineUtil._getBitCode(b, bounds),
					codeOut, p, newCode;

			// save 2nd code to avoid calculating it on the next segment
			this._lastCode = codeB;

			while (true) {
				// if a,b is inside the clip window (trivial accept)
				if (!(codeA | codeB)) {
					return [a, b];
				// if a,b is outside the clip window (trivial reject)
				} else if (codeA & codeB) {
					return false;
				// other cases
				} else {
					codeOut = codeA || codeB;
					p = L.LineUtil._getEdgeIntersection(a, b, codeOut, bounds, round);
					newCode = L.LineUtil._getBitCode(p, bounds);

					if (codeOut === codeA) {
						p.z = a.z;
						p.i = a.i
						p.d = a.d
						a = p;
						codeA = newCode;
					} else {
						p.z = b.z;
						p.i = b.i
						p.d = b.d
						b = p;
						codeB = newCode;
					}
				}
			}
		}
	};


	const _hotline = L.Polyline.extend({
		statics: {
			Renderer: Renderer,
			renderer: renderer
		},

		options: {
			renderer: renderer(),
			min: 0,
			max: 1,
			palette: {
				0.0: 'green',
				0.5: 'yellow',
				1.0: 'red'
			},
			weight: 5,
			outlineColor: 'black',
			outlineWidth: 1
		},

		getRGBForValue: function (value) {
			return this._renderer._hotline.getRGBForValue(value);
		},

		/**
		 * Just like the Leaflet version, but with support for a z coordinate.
		 */
		_projectLatlngs: function (latlngs, result, projectedBounds) {
			const len = latlngs.length;
			var i, ring;

			if (latlngs[0] instanceof L.LatLng) {
				ring = [];
				for (i = 0; i < len; i++) {
					ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
					// console.log(latlngs[i]);
					// Add the altitude of the latLng as the z coordinate to the point
					ring[i].z = latlngs[i].alt;
					ring[i].i = i
					ring[i].d = distances[i];
					projectedBounds.extend(ring[i]);
				}
				result.push(ring);
			} else if (Array.isArray(latlngs[0]) ) {
				for (i = 0; i < len; i++) {
					this._projectLatlngs(latlngs[i], result, projectedBounds);
				}
			}
			
			projectedData = [...result];
		},

		/**
		 * Just like the Leaflet version, but uses `Util.clipSegment()`.
		 */
		_clipPoints: function () {
			if (this.options.noClip) {
				this._parts = this._rings;
				return;
			}

			this._parts = [];

			var parts = this._parts,
					bounds = this._renderer._bounds,
					i, j, k, len, len2, segment, points;

			for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
				points = this._rings[i];

				for (j = 0, len2 = points.length; j < len2 - 1; j++) {
					segment = Util.clipSegment(points[j], points[j + 1], bounds, j, true);

					if (!segment) { continue; }

					parts[k] = parts[k] || [];
					parts[k].push(segment[0]);

					// if segment goes out of screen, or it's the last one, it's the end of the line part
					if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
						parts[k].push(segment[1]);
						k++;
					}
				}
			}
		},

		_clickTolerance: function () {
			return this.options.weight / 2 + this.options.outlineWidth + (L.Browser.touch ? 10 : 0);
		}
	});

	return new _hotline(latlngs, options)
};