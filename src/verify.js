const MerkleTree = require("./index");
const {
  hashProof,
  sha256,
  concatHash,
  concatLetters,
} = require("../test/utilities");

function verifyProof(proof, node, root, concat) {
  let a = "";
  let b = "";
  let currentNode = node;

  for (let i = 0; i < proof.length; i++) {
    if (proof[i].left === true) {
      a = proof[i].data;
      b = currentNode;
    } else {
      a = currentNode;
      b = proof[i].data;
    }
    currentNode = concat(a, b);
  }

  if (currentNode === root) {
    return true;
  } else {
    return false;
  }
}

module.exports = verifyProof;

const leaves = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
const root =
  "Hash(Hash(Hash(Hash(A + B) + Hash(C + D)) + Hash(Hash(E + F) + Hash(G + H))) + Hash(Hash(I + J) + K))";
const badRoot =
  "Hash(Hash(Hash(Hash(B + A) + Hash(C + D)) + Hash(Hash(E + F) + Hash(G + H))) + Hash(Hash(I + J) + K))";
const hashTree = new MerkleTree(leaves.map(sha256), concatHash);
const lettersTree = new MerkleTree(leaves, concatLetters);
//console.log(hashTree.getRoot());
console.log(lettersTree.getRoot());
console.log(lettersTree.getProof(7));
//const proof = lettersTree.getProof(7);
//console.log(hashTree.getProof(7));

console.log(verifyProof(lettersTree.getProof(7), "H", root, concatLetters));
console.log(verifyProof(lettersTree.getProof(7), "H", badRoot, concatLetters));
