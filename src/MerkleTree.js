const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex } = require("ethereum-cryptography/utils");

class MerkleTree {
  constructor(leaves, concat) {
    //this.leaves = leaves;
    this.leaves = leaves.map(Buffer.from).map(keccak256);
    this.concat = concat;
    this.root = [];
  }

  printNiceList() {
    console.log(this.leaves[200]);
    console.log(this.leaves.length);
    return this.leaves;
  }

  getRoot() {
    let origArr = this.leaves.slice();
    let i = 0;
    while (origArr.length !== 1) {
      i++;
      origArr = this.rootRecurse(origArr);
    }
    this.root = origArr;
    //console.log(bytesToHex(origArr));
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
