
const map1 = `
#########
#.......#
#.##.##.#
#.##.##.#
#.##....#
#.##.##.#
#.##.##.#
#.......#
#########
`.trim();
const map2 = `
###################################
#......###.......#.......##.......#
#.####...#.##.##...#####..#.##.##.#
#.##.#.#...#####.####.##....#####.#
#..#.....####....#..#....#####....#
#.##.##.##....####.##.##.##....##.#
#.##.#####.##.##...##.#####.#####.#
#.....#.....#....#.....#......#...#
#.##.#####.##.##...##.#####.#######
#.##.##....##.####.##.##.##....##.#
#..#....#####....#..#....#####....#
#.##.##....#####.####.##....#####.#
#.#####..#.##.##.#.#####..#.##.##.#
#.......##...............##.......#
###################################
`.trim();

function toKey(x, y) {
  return `${x}:${y}`;
}

function fromKey(key) {
  let [x, y] = key.split(":");
  x = parseInt(x, 10);
  y = parseInt(y, 10);
  return [x, y];
}

// Return adjacent key
function keyOffset(key, dir) {
  let [x, y] = fromKey(key);
  if (dir === "up") {
    y--;
  } else if (dir === "down") {
    y++;
  } else if (dir === "left") {
    x--;
  } else if (dir === "right") {
    x++;
  }
  return `${x}:${y}`;
}

function parseMap(data) {
  const m = new Map();
  const lines = data.split("\n");
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y].split("");
    for (let x = 0; x < line.length; x++) {
      m.set(toKey(x, y), line[x]);
    }
    m.width = line.length;
    m.height = lines.length;
  }
  return m;
}

// Build a graph from each vertex to its neighbours
function navGraph(map) {
  const dirs = ["up", "down", "left", "right"];
  const g = new Map();
  for (let [key, value] of map.entries()) {
    if (value !== ".") {
      continue;
    }

    if (!g.has(key)) {
      g.set(key, []);
    }
    const edges = g.get(key);
    for (const dir of dirs) {
      const neighbour = keyOffset(key, dir);
      if (map.get(neighbour) === ".") {
        edges.push(neighbour);
      }
    }
  }
  return g;
}

function findPath(graph, start, end) {
  if (!graph.has(start) || !graph.has(end) || start === end) {
    return [];
  }

  const queue = [start];
  const visited = new Set(start);
  const predecessor = new Map();
  const result = [];

  // BFS to find end target while remembering where coming from
  while (queue.length) {
    const vertex = queue.shift();

    if (visited.has(vertex)) {
      continue;
    }

    visited.add(vertex);

    if (vertex === end) {
      result.push(end);
      let prev = end;
      // Walk back from end to start by visiting predecessors and reverse the path
      while (prev = predecessor.get(prev)) {
        result.push(prev);
      }
      result.reverse();
      break;
    }

    for (const neighbour of graph.get(vertex)) {
      if (!visited.has(neighbour) && !predecessor.has(neighbour)) {
        // Remember where we came to visit each vertex from
        predecessor.set(neighbour, vertex);
      }
      queue.push(neighbour);
    }
  }

  return result;
}

function render(map, path) {
  const a = new Array(map.height);
  for (let y = 0; y < map.height; y++) {
    a[y] = new Array(map.width);
    a[y].fill("x");
  }

  for (const [key, value] of map.entries()) {
    const [x, y] = fromKey(key);
    a[y][x] = value === "#" ? "█" : " ";
  }
  for (const key of path) {
    const [x, y] = fromKey(key);
    a[y][x] = "+";
  }

  const s = a.map(l => l.join("")).join("\n");

  document.querySelector("#output").innerText = s;
}

function renderTable(map, path) {
  const t = document.querySelector("table") || document.createElement("table");
  if (!document.body.contains(t)) {
    for (let y = 0; y < map.height; y++) {
      const tr = document.createElement("tr");
      for (let x = 0; x < map.width; x++) {
        const td = document.createElement("td");
        td.dataset.cell = toKey(x, y);
        tr.appendChild(td);
      }
      t.appendChild(tr);
    }
    document.body.appendChild(t);
  }
  for (const [key, value] of map.entries()) {
    const el = t.querySelector(`td[data-cell="${key}"]`);
    el.dataset.type = value === "#" ? "wall" : "";
  }
  for (const key of path) {
    const el = t.querySelector(`td[data-cell="${key}"]`);
    el.dataset.type = "fill";
  }
  return t;
}


function time(name, fn) {
  const s = performance.now();
  const result = fn();
  const e = performance.now();
  console.debug(`${name} took ${(e-s).toFixed(3)}ms`);
  return result;
}

{
  const start = "1:1";
  const end = "7:5";

  const map = parseMap(map1);
  const graph = navGraph(map);
  const path = time("findPath", () => findPath(graph, start, end));

  console.log(map);
  console.log(graph);
  console.log(path);

  render(map, path);
}

{
  let start = "1:1";
  let end = "7:5";

  const map = parseMap(map2);
  const graph = navGraph(map);
  const table = renderTable(map, findPath(graph, start, end));

  table.addEventListener("click", (ev) => {
    if (ev.target.dataset.cell && ev.target.dataset.type !== "wall") {
      start = ev.target.dataset.cell;
      // console.log("new start:", start);
    }
  });
  table.addEventListener("mousemove", (ev) => {
    if (ev.target.dataset.cell && ev.target.dataset.type !== "wall" && end !== ev.target.dataset.cell) {
      end = ev.target.dataset.cell;
      // console.log("new end:", end);
      renderTable(map, findPath(graph, start, end));
    }
  });
}
