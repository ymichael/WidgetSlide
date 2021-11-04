// This is a counter widget with buttons to increment and decrement the number.

const { widget } = figma;
const {
  AutoLayout,
  Text,
  Frame,
  Image,
  useSyncedState,
  usePropertyMenu,
  useEffect,
} = widget;

const images = [
  "https://static.figma.com/uploads/57566c4070341fc6d9a59bee5f419b576925c164",
  "https://static.figma.com/uploads/01d84f685df407d3691bf6074fa12fc56b73a462",
  "https://static.figma.com/uploads/93ab4490ab6fdbb3cadf92cb4a1374bce90e5962",
  "https://static.figma.com/uploads/3f077a24bd6a50b8cd31f6b04c55194d1ff38db9",
  "https://static.figma.com/uploads/716a9f15e7f24265332e4734e5d4c9e4bfbe3804",
  "https://static.figma.com/uploads/9b0730e5cfdae0caac5f44ab8dfbc234cd8d8513",
  "https://static.figma.com/uploads/1c091497e2cc693efdd1032da42881311e92fca8",
  "https://static.figma.com/uploads/bc696f9be22e946f90fa0c1822ff3d8b23389c17",
];

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

function SlideTile({
  row,
  col,
  imgSrc,
}: {
  imgSrc: string;
  row: number;
  col: number;
}) {
  return (
    <AutoLayout stroke="#123456" strokeWidth={1} cornerRadius={10}>
      <Frame width={TILE_SIZE} height={TILE_SIZE}>
        <Frame width={IMAGE_SIZE} height={IMAGE_SIZE} fill="#FDF6EB" />
        <Image
          x={-TILE_SIZE * col - TILE_GAP * col}
          y={-TILE_SIZE * row - TILE_GAP * row}
          src={imgSrc}
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

function getRandomElement<T = any>(arr: T[]): T {
  return arr[Math.floor(arr.length * Math.random())];
}

const getRandomInitialState = () => {
  return getRandomElement(shuffledSolvableInitialStates);
};

const getRandomImage = () => {
  return getRandomElement(images);
};

const isSolved = (tiles: number[]): boolean => {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] > tiles[i + 1]) {
      return false;
    }
  }
  return true;
};

function SlidePuzzle() {
  const [tiles, setTiles] = useSyncedState("puzzle", null);
  const [imgSrc, setImgSrc] = useSyncedState("imgSrc", null);
  useEffect(() => {
    if (!imgSrc) {
      setImgSrc(getRandomImage());
    }
    if (!tiles) {
      setTiles(getRandomInitialState());
    } else if (isSolved(tiles)) {
      figma.notify("You solved it!");
    }
  });
  usePropertyMenu(
    [
      {
        itemType: "action",
        propertyName: "shuffle",
        tooltip: "Shuffle",
      },
      {
        itemType: "action",
        propertyName: "image",
        tooltip: "Change Image",
      },
      {
        itemType: "action",
        propertyName: "solve",
        tooltip: "Solve",
      },
    ],
    ({ propertyName }) => {
      if (propertyName === "shuffle") {
        setTiles(getRandomInitialState());
      } else if (propertyName === "image") {
        setTiles(getRandomInitialState());
        setImgSrc(getRandomImage());
      } else if (propertyName === "solve") {
        const solved = [...tiles].sort();
        setTiles(solved);
      }
    }
  );

  const emptyTileIdx = tiles ? tiles.indexOf(8) : 0;
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
        {tiles && imgSrc && (
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
                        <SlideTile imgSrc={imgSrc} row={x} col={y} />
                      </AutoLayout>
                    );
                  })}
                </AutoLayout>
              );
            })}
          </AutoLayout>
        )}
      </Frame>
    </AutoLayout>
  );
}

widget.register(SlidePuzzle);
