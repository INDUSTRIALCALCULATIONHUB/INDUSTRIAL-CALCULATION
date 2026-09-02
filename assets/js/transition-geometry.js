(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TransitionGeometry = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const EPS = 1e-9;
  const point3 = (x, y, z) => ({ x, y, z });
  const point2 = (x, y) => ({ x, y });
  const distance3 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  const distance2 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const rad = degrees => degrees * Math.PI / 180;

  function circleIntersections(c0, r0, c1, r1) {
    const d = distance2(c0, c1);
    if (d < EPS || d > r0 + r1 + EPS || d < Math.abs(r0 - r1) - EPS) return [];
    const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, r0 * r0 - a * a));
    const x = c0.x + a * (c1.x - c0.x) / d;
    const y = c0.y + a * (c1.y - c0.y) / d;
    const rx = -(c1.y - c0.y) * h / d;
    const ry = (c1.x - c0.x) * h / d;
    return [point2(x + rx, y + ry), point2(x - rx, y - ry)];
  }

  function chooseOuter(points, baseY) {
    if (!points.length) throw new Error("The selected dimensions cannot be unfolded.");
    return points.reduce((best, p) => p.y > best.y ? p : best, points[0].y >= baseY ? points[0] : points[points.length - 1]);
  }

  function flattenPanel(bottom, upper, splitIndex) {
    const length = distance3(bottom[0], bottom[1]);
    const b0 = point2(0, 0);
    const b1 = point2(length, 0);
    const flatUpper = new Array(upper.length);
    flatUpper[splitIndex] = chooseOuter(circleIntersections(
      b0, distance3(bottom[0], upper[splitIndex]),
      b1, distance3(bottom[1], upper[splitIndex])
    ), 0);

    for (let i = splitIndex - 1; i >= 0; i -= 1) {
      flatUpper[i] = chooseOuter(circleIntersections(
        b0, distance3(bottom[0], upper[i]),
        flatUpper[i + 1], distance3(upper[i], upper[i + 1])
      ), 0);
    }
    for (let i = splitIndex + 1; i < upper.length; i += 1) {
      flatUpper[i] = chooseOuter(circleIntersections(
        b1, distance3(bottom[1], upper[i]),
        flatUpper[i - 1], distance3(upper[i], upper[i - 1])
      ), 0);
    }

    const triangles = [];
    for (let i = 0; i < splitIndex; i += 1) triangles.push([b0, flatUpper[i], flatUpper[i + 1]]);
    triangles.push([b0, b1, flatUpper[splitIndex]]);
    for (let i = splitIndex; i < upper.length - 1; i += 1) triangles.push([b1, flatUpper[i], flatUpper[i + 1]]);
    return { bottom: [b0, b1], upper: flatUpper, triangles };
  }

  function side(a, b, p) { return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x); }
  function centroid(points) { return points.reduce((s, p) => point2(s.x + p.x / points.length, s.y + p.y / points.length), point2(0, 0)); }
  function segmentTransform(sourceA, sourceB, targetA, targetB, reflected) {
    const sa = Math.atan2(sourceB.y - sourceA.y, sourceB.x - sourceA.x);
    const ta = Math.atan2(targetB.y - targetA.y, targetB.x - targetA.x);
    const angle = reflected ? ta + sa : ta - sa;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    return p => {
      const x = p.x - sourceA.x, y = reflected ? -(p.y - sourceA.y) : p.y - sourceA.y;
      return point2(targetA.x + x * cos - y * sin, targetA.y + x * sin + y * cos);
    };
  }
  function stitchPanels(panels) {
    const placed = [];
    panels.forEach((panel, index) => {
      if (index === 0) {
        placed.push({ ...panel, placedBottom: panel.flat.bottom.map(p => point2(p.x, p.y)), placedUpper: panel.flat.upper.map(p => point2(p.x, p.y)) });
        return;
      }
      const previous = placed[index - 1], targetA = previous.placedBottom[1], targetB = previous.placedUpper[previous.placedUpper.length - 1];
      const candidates = [false, true].map(reflected => {
        const transform = segmentTransform(panel.flat.bottom[0], panel.flat.upper[0], targetA, targetB, reflected);
        return { ...panel, placedBottom: panel.flat.bottom.map(transform), placedUpper: panel.flat.upper.map(transform) };
      });
      const priorSide = side(targetA, targetB, centroid([...previous.placedBottom, ...previous.placedUpper]));
      placed.push(candidates.find(candidate => side(targetA, targetB, centroid([...candidate.placedBottom, ...candidate.placedUpper])) * priorSide < 0) || candidates[0]);
    });
    const lower = [placed[0].placedBottom[0], ...placed.map(panel => panel.placedBottom[1])];
    const upper = [placed[0].placedUpper[0], ...placed.flatMap(panel => panel.placedUpper.slice(1))];
    return { panels: placed, lower, upper, boundary: [...lower, ...upper.slice().reverse()] };
  }

  function validate(input) {
    const required = ["width", "depth", "diameter", "height", "divisions"];
    required.forEach(key => {
      if (!Number.isFinite(input[key]) || input[key] <= 0) throw new Error(`${key} must be greater than zero.`);
    });
    if (!Number.isInteger(input.divisions) || input.divisions < 2 || input.divisions > 24) {
      throw new Error("Divisions per quarter must be a whole number from 2 to 24.");
    }
    if (!Number.isFinite(input.offsetX) || !Number.isFinite(input.offsetY)) throw new Error("Offsets must be valid numbers.");
  }

  function buildTransition(raw) {
    const insideInput = {
      width: Number(raw.width), depth: Number(raw.depth), diameter: Number(raw.diameter),
      height: Number(raw.height), offsetX: Number(raw.offsetX || 0), offsetY: Number(raw.offsetY || 0),
      divisions: Number(raw.divisions), thickness: Number(raw.thickness || 0)
    };
    if (!Number.isFinite(insideInput.thickness) || insideInput.thickness < 0) throw new Error("Plate thickness must be zero or greater.");
    const input = {
      width: insideInput.width + insideInput.thickness,
      depth: insideInput.depth + insideInput.thickness,
      diameter: insideInput.diameter + insideInput.thickness,
      height: insideInput.height,
      offsetX: insideInput.offsetX,
      offsetY: insideInput.offsetY,
      divisions: insideInput.divisions
    };
    validate(input);
    const hw = input.width / 2, hd = input.depth / 2, r = input.diameter / 2;
    const corners = {
      frontLeft: point3(-hw, -hd, 0), frontRight: point3(hw, -hd, 0),
      backRight: point3(hw, hd, 0), backLeft: point3(-hw, hd, 0)
    };
    const specs = [
      { name: "Front", bottom: [corners.frontLeft, corners.frontRight], start: 225 },
      { name: "Right", bottom: [corners.frontRight, corners.backRight], start: 315 },
      { name: "Back", bottom: [corners.backRight, corners.backLeft], start: 45 },
      { name: "Left", bottom: [corners.backLeft, corners.frontLeft], start: 135 }
    ];
    const panels = specs.map(spec => {
      const upper = Array.from({ length: input.divisions + 1 }, (_, i) => {
        const a = rad(spec.start + 90 * i / input.divisions);
        return point3(input.offsetX + r * Math.cos(a), input.offsetY + r * Math.sin(a), input.height);
      });
      const splitIndex = Math.floor(input.divisions / 2);
      const flat = flattenPanel(spec.bottom, upper, splitIndex);
      const generators = upper.map((p, i) => ({
        point: i,
        from: i <= splitIndex ? "A" : "B",
        length: distance3(spec.bottom[i <= splitIndex ? 0 : 1], p)
      }));
      const boundary = [flat.bottom[0], ...flat.upper, flat.bottom[1]];
      return { name: spec.name, bottom3d: spec.bottom, upper3d: upper, flat, boundary, generators };
    });
    const slantValues = panels.flatMap(p => p.generators.map(g => g.length));
    const complete = stitchPanels(panels);
    return {
      input, insideInput, panels, complete,
      summary: {
        circleSegments: input.divisions * 4,
        circumference: Math.PI * input.diameter,
        minimumGenerator: Math.min(...slantValues),
        maximumGenerator: Math.max(...slantValues)
      }
    };
  }

  function bounds(points) {
    return points.reduce((b, p) => ({
      minX: Math.min(b.minX, p.x), minY: Math.min(b.minY, p.y),
      maxX: Math.max(b.maxX, p.x), maxY: Math.max(b.maxY, p.y)
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
  }

  return { buildTransition, bounds, distance2, distance3 };
});
