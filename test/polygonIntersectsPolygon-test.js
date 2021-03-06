var tape = require("tape"),
    geometric = require("../");

tape("polygonIntersectsPolygon(polygonA, polygonB) determines whether two polygons intersect but neither contains the other", function(test) {
  var polygon = [[0, 0], [2, 0], [2, 2], [0, 2]];
  test.equal(geometric.polygonIntersectsPolygon([[.5, .5], [1.5, .5], [1.5, 1.5], [.5, 1.5]], polygon), false);
  test.equal(geometric.polygonIntersectsPolygon([[.5, .5], [2.5, .5], [2.5, 2.5], [.5, 2.5]], polygon), true);
  test.equal(geometric.polygonIntersectsPolygon([[3, 3], [3, 4], [4, 4]], polygon), false);

  // Test cases where lines overlap but no points are inside
  var polygonA = [[5, 3], [10, 3], [10, 8], [5, 8]],
      polygonB = [[4, 6], [8, 2], [11, 6]],
      polygonC = [[4, 6], [11, 6], [11, 9], [4, 9]];
  test.equal(geometric.polygonIntersectsPolygon(polygonA, polygonB), true);
  test.equal(geometric.polygonIntersectsPolygon(polygonB, polygonA), true);
  test.equal(geometric.polygonIntersectsPolygon(polygonA, polygonC), true);
  test.equal(geometric.polygonIntersectsPolygon(polygonC, polygonA), true);
  
  test.end();
});