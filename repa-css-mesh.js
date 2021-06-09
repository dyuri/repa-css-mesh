// Mulberry PRNG from https://github.com/bryc/code/blob/master/jshash/PRNGs.md
function mulberry32(a) {
  return function(min = 0, max = 1) {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return (((t ^ t >>> 14) >>> 0) / 4294967296) * (max - min) + min;
  };
}

const _now = +(new Date());

class RepaMesh {
  static get contextOptions() {
    return { alpha: true };
  }

  static get inputProperties() {
    return [
      "--mesh-seed",
      "--mesh-count",
      "--mesh-phase",
      "--mesh-node-color",
      "--mesh-line-color",
      "--mesh-fill-color"
    ];
  }

  parseProp(prop, num = false) {
    const value = prop?.toString()?.trim();
    return num ? parseFloat(value) : value;
  }

  paint(ctx, size, props) {
    const seed = this.parseProp(props.get("--mesh-seed"), true) || _now;
    const count = this.parseProp(props.get("--mesh-count"), true) || 10;
    const phase = this.parseProp(props.get("--mesh-phase"), true) || 0;
    const node_color = this.parseProp(props.get("--mesh-node-color")) || "#888";
    const line_color = this.parseProp(props.get("--mesh-line-color")) || "#aaa";
    const fill_color = this.parseProp(props.get("--mesh-fill-color"));
    const rng = mulberry32(seed);

    // generate grid
    const cellsize = Math.ceil(size.width / count);
    const vcount = Math.ceil(size.height / cellsize);
    const grid = [];

    for (let j = -1; j <= vcount; j++) {
      let line = [];
      for (let i = -1; i <= count; i++) {
        line.push({
          x: .5 + .5 * Math.sin(phase + 6.2831 * rng()),
          y: .5 + .5 * Math.sin(phase + 6.2831 * rng())
        });
      }
      grid.push(line);
    }

    for (let j = -1; j <= vcount; j++) {
      let line = [];
      for (let i = -1; i <= count; i++) {
        let node = grid[j+1][i+1];
        let cx = (i + node.x) * cellsize;
        let cy = (j + node.y) * cellsize;

        // lines
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        [[i, j+1], [i+1, j+1], [i+1, j]].forEach(n => {
          const [ni, nj] = n;
          const nnode = grid[nj+1]?.[ni+1];
          if (nnode) {
            let nx = (ni + nnode.x) * cellsize;
            let ny = (nj + nnode.y) * cellsize;

            ctx.lineTo(nx, ny);
          }
        });
        ctx.closePath();
        if (line_color) {
          ctx.strokeStyle = line_color;
          ctx.stroke();
        }
        if (fill_color) {
          ctx.fillStyle = fill_color;
          ctx.fill();
        }

        // dot
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = node_color;
        ctx.fill();
      }
    }
  }
}

registerPaint("repa-mesh", RepaMesh);
