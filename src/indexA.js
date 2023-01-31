const {
  hashProof,
  sha256,
  concatHash,
  concatLetters,
} = require("../test/utilities");

class MerkleTree {
  constructor(leaves, concat) {
    this.leaves = leaves;
    this.concat = concat;
  }
  getRoot(leaves = this.leaves) {
    if (leaves.length === 1) {
      return leaves[0];
    }
    const layer = [];
    for (let i = 0; i < leaves.length; i += 2) {
      const left = leaves[i];
      const right = leaves[i + 1];
      if (right) {
        layer.push(this.concat(left, right));
      } else {
        layer.push(left);
      }
    }
    return this.getRoot(layer);
  }
  getProof(index, layer = this.leaves, proof = []) {
    if (layer.length === 1) return proof;
    const newLayer = [];
    for (let i = 0; i < layer.length; i += 2) {
      let left = layer[i];
      let right = layer[i + 1];
      if (!right) {
        newLayer.push(left);
      } else {
        newLayer.push(this.concat(left, right));

        if (i === index || i === index - 1) {
          let isLeft = !(index % 2);
          proof.push({
            data: isLeft ? right : left,
            left: !isLeft,
          });
        }
      }
    }
    return this.getProof(Math.floor(index / 2), newLayer, proof);
  }
}

const leaves = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const root = "eb100814abc896ab18bcf6c37b6550eeadeae0c312532286a4cf4be132ace526";
const hashTree = new MerkleTree(leaves.map(sha256), concatHash);
const lettersTree = new MerkleTree(leaves, concatLetters);
//console.log(hashTree.getRoot());
//console.log(lettersTree.getRoot());
console.log(lettersTree.getProof(7));
//console.log(hashTree.getProof(8));

module.exports = MerkleTree;
