// Calculates the area of a polygon.
export function polygonArea(vertices){
  var a = 0;

  for (var i = 0, l = vertices.length; i < l; i++) {
    var v0 = vertices[i],
        v1 = vertices[i === l - 1 ? 0 : i + 1];

    a += v0[0] * v1[1];
    a -= v1[0] * v0[1];
  }

  return Math.abs(a / 2);
}