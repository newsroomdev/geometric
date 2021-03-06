// https://github.com/HarryStevens/geometric#readme Version 1.1.0. Copyright 2019 Harry Stevens.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.geometric = {})));
}(this, (function (exports) { 'use strict';

  // Calculates the angle of a line, in degrees.
  function lineAngle(line){
    return Math.atan2(line[1][1] - line[0][1], line[1][0] - line[0][0]) * 180 / Math.PI;
  }

  // Calculates the distance between the endpoints of a line segment.
  function lineLength(line){
    return Math.sqrt(Math.pow(line[1][0] - line[0][0], 2) + Math.pow(line[1][1] - line[0][1], 2));
  }

  // Calculates the midpoint of a line segment.
  function lineMidpoint(line){
    return [(line[0][0] + line[1][0]) / 2, (line[0][1] + line[1][1]) / 2];
  }

  // Rotates a point by an angle in degrees around an origin.
  function pointRotate(point, angle, origin){
    angle = angle / 180 * Math.PI;
    if (!origin || origin === [0, 0]){
      return rotate(point, angle);
    }

    else {
      // See: https://math.stackexchange.com/questions/1964905/rotation-around-non-zero-point
      var p0 = point.map(function(c, i){ return c - origin[i]; });
      var r = rotate(p0, angle);
      return r.map(function(c, i){ return c + origin[i]; });
    }
    
    function rotate(point, angle){
      // See: https://en.wikipedia.org/wiki/Cartesian_coordinate_system#Rotation
      return [(point[0] * Math.cos(angle)) - point[1] * Math.sin(angle), (point[0] * Math.sin(angle)) + point[1] * Math.cos(angle)];
    }
  }

  // Translates a point by an angle in degrees and distance
  function pointTranslate(point, angle, distance){
    angle = angle / 180 * Math.PI;
    return [point[0] + distance * Math.cos(angle), point[1] + distance * Math.sin(angle)];
  }

  // Calculates the area of a polygon.
  function polygonArea(vertices){
    var a = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
      var v0 = vertices[i],
          v1 = vertices[i === l - 1 ? 0 : i + 1];

      a += v0[0] * v1[1];
      a -= v1[0] * v0[1];
    }

    return Math.abs(a / 2);
  }

  // Calculates the bounds of a polygon.
  function polygonBounds(polygon){
    var xMin = polygon[0][0],
        xMax = xMin,
        yMin = polygon[0][1],
        yMax = yMin;

    for (var i = 1, l = polygon.length; i < l; i++){
      var p = polygon[i],
          x = p[0],
          y = p[1];

      if (x < xMin){
        xMin = x;
      }

      if (x > xMax){
        xMax = x;
      }

      if (y < yMin){
        yMin = y;
      }

      if (y > yMax){
        yMax = y;
      }
    }

    return [[xMin, yMin], [xMax, yMax]];
  }

  // Calculates the weighted centroid a polygon.
  function polygonCentroid(vertices){
    var a = 0, x = 0, y = 0, l = vertices.length;

    for (var i = 0; i < l; i++) {
      var s = i === l - 1 ? 0 : i + 1,
          v0 = vertices[i],
          v1 = vertices[s],
          f = (v0[0] * v1[1]) - (v1[0] * v0[1]);

      a += f;
      x += (v0[0] + v1[0]) * f;
      y += (v0[1] + v1[1]) * f;
    }

    var d = a * 3;

    return [x / d, y / d];
  }

  // See https://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain#JavaScript
  // and https://math.stackexchange.com/questions/274712/calculate-on-which-side-of-a-straight-line-is-a-given-point-located
  function cross (a, b, o){
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])     
  }

  // Caclulates the convex hull of a set of points.
  // See https://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain#JavaScript
  function polygonHull(points){
    if (points.length < 3) { return null; }

    points.sort(function(a, b) {
      return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0];
    });

    var lower = [];
    for (var i0 = 0; i0 < points.length; i0++) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i0]) <= 0) {
         lower.pop();
      }
      lower.push(points[i0]);
    }

    var upper = [];
    for (var i1 = points.length - 1; i1 >= 0; i1--) {
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i1]) <= 0) {
         upper.pop();
      }
      upper.push(points[i1]);
    }

    upper.pop();
    lower.pop();

    return lower.concat(upper);
  }

  // Calculates the length of a polygon's perimeter. See https://github.com/d3/d3-polygon/blob/master/src/length.js
  function polygonLength(vertices){
    var i = -1,
        n = vertices.length,
        b = vertices[n - 1],
        xa,
        ya,
        xb = b[0],
        yb = b[1],
        perimeter = 0;

    while (++i < n) {
      xa = xb;
      ya = yb;
      b = vertices[i];
      xb = b[0];
      yb = b[1];
      xa -= xb;
      ya -= yb;
      perimeter += Math.sqrt(xa * xa + ya * ya);
    }

    return perimeter;
  }

  // Calculates the arithmetic mean of a polygon's vertices.
  function polygonMean(vertices){
    var x = 0, y = 0, l = vertices.length;

    for (var i = 0; i < l; i++) {
      var v = vertices[i];        

      x += v[0];
      y += v[1];
    }

    return [x / l, y / l];
  }

  // Rotates a polygon by an angle in degrees around an origin.
  function polygonRotate(polygon, angle, origin){
    var out = [];
    for (var i = 0, l = polygon.length; i < l; i++){
      out.push(pointRotate(polygon[i], angle, origin));
    }
    return out;
  }

  // Scales a polygon by a scale factor (where 1 is the original size) from an origin point.
  // The origin defaults to the polygon's centroid.
  function polygonScale(polygon, scale, origin){
    if (!origin){
      origin = polygonCentroid(polygon);
    }

    var output = [];

    for (var i = 0, l = polygon.length; i < l; i++){
      var v = polygon[i];
      var d = lineLength([origin, v]);
      var a = lineAngle([origin, v]);
      output.push(pointTranslate(origin, a, d * scale));
    }

    return output;
  }

  // Translates a polygon by an angle in degrees and distance.
  function polygonTranslate(polygon, angle, distance){
    var p = [];
    for (var i = 0, l = polygon.length; i < l; i++){
      p.push(pointTranslate(polygon[i], angle, distance));
    }
    return p;
  }

  // Determines if lineA intersects lineB. 
  // See: https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function/24392281#24392281
  // Returns a boolean.
  function lineIntersectsLine(lineA, lineB) {
    var a = lineA[0][0],
        b = lineA[0][1],
        c = lineA[1][0],
        d = lineA[1][1],
        p = lineB[0][0],
        q = lineB[0][1],
        r = lineB[1][0],
        s = lineB[1][1],
        det, gamma, lambda;

    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  }

  // Determines whether a line intersects a polygon.
  // Returns a boolean.
  function lineIntersectsPolygon(line, polygon){
    var intersects = false;
    
    // Make it a closed polygon.
    if (polygon[0] !== polygon[polygon.length - 1]){
      polygon.push(polygon[0]);
    }

    for (var i = 0, l = polygon.length - 1; i < l; i++){
      if (lineIntersectsLine(line, [polygon[i], polygon[i + 1]])) {
        intersects = true;
        break;
      }
    }

    return intersects;
  }

  // Determines whether a point is inside of a polygon, represented as an array of vertices.
  // From https://github.com/substack/point-in-polygon/blob/master/index.js,
  // based on the ray-casting algorithm from https://web.archive.org/web/20180115151705/https://wrf.ecse.rpi.edu//Research/Short_Notes/pnpoly.html
  // Wikipedia: https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm
  // Returns a boolean.
  function pointInPolygon(point, polygon) {
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var xi = polygon[i][0], yi = polygon[i][1];
      var xj = polygon[j][0], yj = polygon[j][1];
    
      if (((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) { inside = !inside; }
    }
    
    return inside;
  }

  // See https://math.stackexchange.com/questions/274712/calculate-on-which-side-of-a-straight-line-is-a-given-point-located
  function topPointFirst(line){
    return line[1][1] > line[0][1] ? line : [line[1], line[0]];
  }

  function pointLeftofLine(point, line){
    var t = topPointFirst(line);
    return cross(point, t[1], t[0]) < 0;
  }
  function pointRightofLine(point, line){
    var t = topPointFirst(line);
    return cross(point, t[1], t[0]) > 0;
  }
  function pointOnLine(point, line){
    return cross(point, line[0], line[1]) === 0;
  }

  // Determines whether a polygon is contained by another polygon.
  // Polygons are represented as an array of vertices, each of which is an array of two numbers,
  // where the first number represents its x-coordinate and the second its y-coordinate.
  // Returns a boolean.
  function polygonInPolygon(polygonA, polygonB){
    var inside = true;

    for (var i = 0, l = polygonA.length; i < l; i++){
      var p = polygonA[i];
      if (!pointInPolygon(p, polygonB)){
        inside = false;
        break;
      }
    }

    return inside;
  }

  // Determines whether a polygon intersects but is not contained by another polygon.
  // Polygons are represented as an array of vertices, each of which is an array of two numbers,
  // where the first number represents its x-coordinate and the second its y-coordinate.
  // Returns a boolean.
  function polygonIntersectsPolygon(polygonA, polygonB){
    var intersects = false;

    // Make it a closed polygon
    if (polygonA[0] !== polygonA[polygonA.length - 1]){
      polygonA.push(polygonA[0]);
    }

    for (var i = 0, l = polygonA.length - 1; i < l; i++){
      if (lineIntersectsPolygon([polygonA[i], polygonA[i + 1]], polygonB)){
        intersects = true;
        break;
      }
    }

    return intersects;
  }

  // Returns the angle of reflection given an angle of incidence and a surface angle.
  function angleReflect(incidenceAngle, surfaceAngle){
    var a = surfaceAngle * 2 - incidenceAngle;
    return a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
  }

  // Converts degrees to radians.
  function degreesToRadians(angle){
    return angle / 180 * Math.PI;
  }

  // Converts radians to degrees.
  function radiansToDegrees(angle){
    return angle * 180 / Math.PI;
  }

  exports.lineAngle = lineAngle;
  exports.lineLength = lineLength;
  exports.lineMidpoint = lineMidpoint;
  exports.pointRotate = pointRotate;
  exports.pointTranslate = pointTranslate;
  exports.polygonArea = polygonArea;
  exports.polygonBounds = polygonBounds;
  exports.polygonCentroid = polygonCentroid;
  exports.polygonHull = polygonHull;
  exports.polygonLength = polygonLength;
  exports.polygonMean = polygonMean;
  exports.polygonRotate = polygonRotate;
  exports.polygonScale = polygonScale;
  exports.polygonTranslate = polygonTranslate;
  exports.lineIntersectsLine = lineIntersectsLine;
  exports.lineIntersectsPolygon = lineIntersectsPolygon;
  exports.pointInPolygon = pointInPolygon;
  exports.pointLeftofLine = pointLeftofLine;
  exports.pointRightofLine = pointRightofLine;
  exports.pointOnLine = pointOnLine;
  exports.polygonInPolygon = polygonInPolygon;
  exports.polygonIntersectsPolygon = polygonIntersectsPolygon;
  exports.angleReflect = angleReflect;
  exports.degreesToRadians = degreesToRadians;
  exports.radiansToDegrees = radiansToDegrees;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
