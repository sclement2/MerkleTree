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
    this.root = [];
  }

  getRoot() {
    let origArr = this.leaves.slice();
    let i = 0;
    while (origArr.length !== 1) {
      i++;
      origArr = this.rootRecurse(origArr);
    }
    this.root = origArr;
    return origArr;
  }

  rootRecurse(leafArray) {
    let a = "";
    let b = "";
    let c = "";
    a = leafArray.shift();
    b = leafArray.shift();
    if (!b) {
      c = a;
    } else {
      c = this.concat(a, b);
    }
    this.root.push(c);
    if (leafArray.length === 0) {
      leafArray = this.root;
      this.root = [];
    } else if (leafArray.length === 1) {
      this.root.push(leafArray.pop());
      leafArray = this.root;
      this.root = [];
    }
    return leafArray;
  }

  getProof(index) {
    let startLeaf = this.leaves[index];
    let workingLeaves = this.leaves.slice();
    let proof = [];
    let level = 0;
    do {
      level++;
      if (index % 2 === 0 && index + 1 <= workingLeaves.length - 1) {
        proof.push({ data: workingLeaves[index + 1], left: false });
        index = Math.floor(index / 2);
        workingLeaves = this.proofRecurse(workingLeaves);
      } else if (index % 2 !== 0 && index - 1 >= 0) {
        proof.push({ data: workingLeaves[index - 1], left: true });
        index = Math.floor(index / 2);
        workingLeaves = this.proofRecurse(workingLeaves);
      } else {
        index = Math.floor(index / 2);
        workingLeaves = this.proofRecurse(workingLeaves);
      }
    } while (level < 4);
    return proof;
  }

  proofRecurse(leafArray) {
    let tempArray = [];
    let lengthA = leafArray.length / 2;
    let a = "";
    let b = "";
    let c = "";
    let i = 0;
    while (i < lengthA) {
      i++;
      a = leafArray.shift();
      b = leafArray.shift();
      if (!b) {
        c = a;
      } else {
        c = this.concat(a, b);
      }
      tempArray.push(c);

      if (leafArray.length === 0) {
        leafArray = tempArray;
        tempArray = [];
      }
    }
    return leafArray;
  }
}

module.exports = MerkleTree;

const leaves = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const root = "eb100814abc896ab18bcf6c37b6550eeadeae0c312532286a4cf4be132ace526";
const hashTree = new MerkleTree(leaves.map(sha256), concatHash);
const lettersTree = new MerkleTree(leaves, concatLetters);
//console.log(hashTree.getRoot());
//console.log(lettersTree.getRoot());
console.log(lettersTree.getProof(7));
//console.log(hashTree.getProof(3));
