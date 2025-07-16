import React from 'react';
import { Hex, Hexagon, Text } from 'react-hexgrid';

const HexTile = React.memo((hexTile: { index: number, q: number, r: number, s: number, tileSize: {x: number, y: number}, scale: {w: number, h: number}, imgType: string | undefined, hoveredKey: number, setHoveredKey: (...args: any) => void }) =>
{
  return (
    <Hexagon
      className="hex"
      key={hexTile.index}
      q={hexTile.q}
      r={hexTile.r}
      s={hexTile.s}
      style={{ opacity: hexTile.hoveredKey === hexTile.index ? 0.75 : 1 }}
      onMouseEnter={() => hexTile.setHoveredKey(hexTile.index)}
      onMouseLeave={() => hexTile.setHoveredKey(-1)}
    >
      <image
        href={hexTile.imgType}
        x={-hexTile.tileSize.x / 2}
        y={-hexTile.tileSize.y / 2}
        width={hexTile.tileSize.x}
        height={hexTile.tileSize.y}
        preserveAspectRatio="xMidYMid slice"
        style={{
          pointerEvents: 'none',
          transform: `scale(${hexTile.scale.w - 0.1},-${hexTile.scale.h - 0.1})`,
        }}
      />
    </Hexagon>
  );
});

export default HexTile;
