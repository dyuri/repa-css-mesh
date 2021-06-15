# repa-css-mesh

CSS Paint Worklet (Houdini) to generate cellular noise based mesh.

## Parameters

- `--mesh-seed` - random seed, system time by default
- `--mesh-count` - number of cells per row
- `--mesh-phase` - animation phase
- `--mesh-node-color` - color of nodes
- `--mesh-line-color` - color of lines
- `--mesh-fill-color` - fill color of cells
- `--mesh-starmap` - `min, max` - starmap mode minimum/maximum distance
  - if distance is less than `min` then the line is fully solid
  - if distance is more than `max` then the line is transparent
  - alpha value is set linearly in between `min` and `max`

## Example

See [index.html](index.html) ([live](https://dyuri.github.io/repa-css-mesh/index.html)).
