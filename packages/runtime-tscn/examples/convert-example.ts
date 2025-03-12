// Example script to convert a Vue component to TSCN
import { compileVueToTSCN } from '../src/vueToTSCN';
import * as path from 'path';

// Define input and output paths
const inputFile = path.resolve(__dirname, 'example.vue');
const outputFile = path.resolve(__dirname, 'example.tscn');

// Compile the Vue component to TSCN
console.log(`Converting ${inputFile} to TSCN...`);

try {
  const tscnContent = compileVueToTSCN(inputFile, {
    outFile: outputFile,
    appId: 'GameScene',
    rootNodeType: 'Node2D',
  });

  console.log('Conversion successful!');
  console.log('Generated TSCN file:');
  console.log('-----------------------------------');
  console.log(tscnContent);
  console.log('-----------------------------------');
  console.log(`Output saved to ${outputFile}`);
} catch (error) {
  console.error('Error during conversion:', error);
} 