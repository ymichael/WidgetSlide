// This is a counter widget with buttons to increment and decrement the number.

const { widget } = figma;
const { AutoLayout, Text, Frame, Image, useSyncedState } = widget;

const IMG_SRC =
  "https://static.figma.com/uploads/1de864b6d7a59b5cfeb7ad47537c8316f7341cd2";
const TILE_SIZE = 100;
const TILE_GAP = 8;
const IMAGE_SIZE = TILE_SIZE * 3 + TILE_GAP * 2;

function EmptyTile() {
  return (
    <AutoLayout
      cornerRadius={10}
      width={TILE_SIZE}
      height={TILE_SIZE}
    ></AutoLayout>
  );
}

function SlideTile({ row, col }: { row: number; col: number }) {
  return (
    <AutoLayout stroke="#123456" strokeWidth={1} cornerRadius={10}>
      <Frame width={TILE_SIZE} height={TILE_SIZE}>
        <Frame width={IMAGE_SIZE} height={IMAGE_SIZE} fill="#FDF6EB" />
        <Image
          x={-TILE_SIZE * col - TILE_GAP * col}
          y={-TILE_SIZE * row - TILE_GAP * row}
          src={IMG_SRC}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
        />
      </Frame>
    </AutoLayout>
  );
}

const INITIAL_TILES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function tileIdxToCoords(idx: number): [number, number] {
  return [Math.floor(idx / 3), Math.floor(idx % 3)];
}

function coordsToIdx(row: number, col: number): number {
  return row * 3 + col;
}

function countInversions(tiles: number[]): number {
  let inversions = 0;
  for (var i = 0; i < tiles.length; i++) {
    for (var j = i + 1; j < tiles.length; j++) {
      if (tiles[i] !== 8 && tiles[j] !== 8 && tiles[i] > tiles[j]) {
        inversions += 1;
      }
    }
  }
  return inversions;
}

function isSolvable(tiles: number[]): boolean {
  return countInversions(tiles) % 2 === 0;
}

function shuffleArray(arr: number[]): number[] {
  const array = [...arr];
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

const shuffledSolvableInitialStates = [
  [8, 3, 1, 2, 5, 4, 7, 0, 6],
  [4, 1, 8, 6, 0, 5, 7, 3, 2],
  [7, 8, 2, 5, 6, 3, 0, 4, 1],
  [5, 3, 0, 8, 2, 6, 4, 1, 7],
  [4, 5, 3, 7, 2, 1, 0, 8, 6],
  [6, 4, 8, 2, 3, 0, 5, 7, 1],
  [0, 7, 2, 8, 3, 6, 5, 4, 1],
  [4, 1, 7, 0, 6, 5, 3, 8, 2],
];

const randomInitialState =
  shuffledSolvableInitialStates[
    Math.floor(shuffledSolvableInitialStates.length * Math.random())
  ];

function SlidePuzzle() {
  const [tiles, setTiles] = useSyncedState("puzzle", randomInitialState);

  const emptyTileIdx = tiles.indexOf(8);
  const [emptyRow, emptyCol] = tileIdxToCoords(emptyTileIdx);

  return (
    <AutoLayout
      direction="vertical"
      width={388}
      height={457}
      horizontalAlignItems="center"
    >
      <Frame width={388} height={457} cornerRadius={15} fill="#A66300">
        <Frame
          y={71}
          x={19}
          fill="#955C06"
          cornerRadius={15}
          width={350}
          height={350}
        />
        <Frame
          width={388}
          height={457}
          fill={{
            type: "image",
            src: "https://static.figma.com/uploads/db163379fd786cb127d6bfd3e0a77fe422721147",
          }}
        />
        <AutoLayout
          x={25}
          y={75}
          direction="vertical"
          cornerRadius={15}
          spacing={10}
          padding={10}
        >
          {[0, 1, 2].map((row) => {
            return (
              <AutoLayout direction="horizontal" spacing={10} key={row}>
                {[0, 1, 2].map((col) => {
                  const idx = coordsToIdx(row, col);
                  const remappedIdx = tiles[idx];
                  if (remappedIdx === 8) {
                    return <EmptyTile key={remappedIdx} />;
                  }
                  const [x, y] = tileIdxToCoords(remappedIdx);
                  const isMovable =
                    (col === emptyCol &&
                      (row === emptyRow - 1 || row === emptyRow + 1)) ||
                    (row === emptyRow &&
                      (col === emptyCol - 1 || col === emptyCol + 1));
                  const additionalProps = isMovable
                    ? {
                        onClick: () => {
                          const newTiles = [...tiles];
                          newTiles[emptyTileIdx] = remappedIdx;
                          newTiles[idx] = 8;
                          setTiles(newTiles);
                        },
                      }
                    : {};
                  return (
                    <AutoLayout key={remappedIdx} {...additionalProps}>
                      <SlideTile row={x} col={y} />
                    </AutoLayout>
                  );
                })}
              </AutoLayout>
            );
          })}
        </AutoLayout>
      </Frame>
    </AutoLayout>
  );
}

widget.register(SlidePuzzle);
