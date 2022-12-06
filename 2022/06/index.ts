import { getInput, unique } from '../../utils';

const START_OF_PACKET_MARKER_LENGTH = 4;
const START_OF_MESSAGE_MARKER_LENGTH = 14;

function findMarkerPosition(input: string[], markerLength: number) : number | undefined {
  for (let i = 0; i < input.length - markerLength; i++) {
    const chars = input.slice(i, i + markerLength);
    if (unique(chars).length === markerLength) {
      return i + markerLength;
      break;
    }
  }
  return undefined;
}

async function partOne() {
  const input = (await getInput())[0].split('');
  console.log(findMarkerPosition(input, START_OF_PACKET_MARKER_LENGTH));
}

async function partTwo() {
  const input = (await getInput())[0].split('');
  console.log(findMarkerPosition(input, START_OF_MESSAGE_MARKER_LENGTH));
} 

partOne();
partTwo();