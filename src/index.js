const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex } = require("ethereum-cryptography/utils");
const {
  hashProof,
  sha256,
  concatHash,
  concatLetters,
} = require("../test/utilities");
const MerkleTree = require("./MerkleTree");
const niceList = require("./niceList.json");

//const leaves = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
const leaves = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
];

const root = "eb100814abc896ab18bcf6c37b6550eeadeae0c312532286a4cf4be132ace526";
const hashTree = new MerkleTree(leaves.map(sha256), concatHash);
const lettersTree = new MerkleTree(leaves, concatLetters);

const concatProject = (left, right) => keccak256(Buffer.concat([left, right]));
//const niceNamesTree = new MerkleTree(niceList, concatProject);
const niceNamesTree = new MerkleTree(niceList, concatLetters);
const name = "Norman Block";
const index = niceList.findIndex((n) => n === name);
console.log(name + " is index: " + index);

//console.log(lettersTree.getRoot());
//console.log(lettersTree.getProof(7));
//console.log(hashTree.getRoot());
//console.log(hashTree.getProof(7));
//console.log("niceNamesTree Root: " + bytesToHex(niceNamesTree.getRoot()));
//console.log("niceNamesTree Root: " + niceNamesTree.getRoot());
console.log(
  "niceNamesTree Proof for list item: " +
    name +
    "  " +
    niceNamesTree.getProof(index)
);
console.log(niceNamesTree.printNiceList()[index]);
