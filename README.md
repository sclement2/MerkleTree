# MerkleTree

*This repository is part of the homework problems for week 2 - Blockchain Storage of the Ethereum Dev. Bootcamp*

[Checkout Alchemy University](https://university.alchemy.com)

## Merkle Trees in Blockchains
Merkle Trees are awesome! They allow us to verify if a piece of data is part of a larger data structure, **without having all of the data within that structure**. This means they can be used to check for inconsistencies in all kinds of distributed systems!

For Blockchain, storing transactions as Merkle Trees allows us to look at a block and verify that a transaction was part of it by only having part of the data set!

> Remember that the data within a blockchain block is just a set of transactions.

Let's take a look at an example:

## ABCDEFGHIJ Merkle Tree

In this tree each letter represents a hash, and combined letters represent concatenating hashes and hashing those together.
```AsciiDoc
          Root 
        /      \
    ABCD        EFGHIJ
     |          /    \
    ABCD     EFGH     IJ
    / \      /   \     |
   AB  CD   EF   GH   IJ
  / \  / \  / \  / \  / \      
  A B  C D  E F  G H  I J 
```

To prove that the hash `A` is a part of the Merkle Root we don't need to know hash `C` or `D`, we just need to know hash `CD`. The necessary proof for `A` is:
```AsciiDoc
 Hash(Hash(Hash(A + B) + CD) + EFGHIJ)
```
Where we only need to know the hashes `B`, `CD`, and `EFGHIJ` to prove that `A` is in the merkle root.

The items in this repository deal with the following use cases:
- Combining two leaves
- Larger Merkle Trees with multiple layers
- Merkle Trees with odd number of leaves
- Building proof that a particular leaf node exists with the Merkle Tree
- Verify a proof


## Additional Information Surrounding Merkle Trees

### Merkle Trees In Bitcoin
The design of merkle trees makes them extremely efficient for data verification. In Bitcoin, Merkle trees are used to store every transaction mined on the Bitcoin network in an efficient way:

<img src="./images/Bitcoin-block-structure.png" alt="Bitcoin block structure" width="400" />

The diagram above shows the architecture of a bitcoin block. Did you think a bitcoin block contains all of the transactions per block? In a way it does... but via merkle trees!

What happens is, all of the transactions per block are arranged into a big Merkle tree. What actually ends up getting committed into the block and immutable blockchain is that Merkle tree's root hash.

By committing the root hash of the tree, the transaction data can be stored off-chain (full nodes, for example, store these transaction records on a LevelDB integrated into all full nodes).

Thanks to Merkle trees, storage on the blockchain is efficient - you must only commit one piece of data instead of thousands of transactions per block, which would really bloat the system!

> A main design purpose behind using Merkle trees to commit a lot of data elements (typically transactions) per block is to keep the size of the blockchain as small as possible. Given the nature of their usage, blockchains grow perpetually, so you must account for efficient data storage. Keeping the blockchain size from becoming bloated means more people can support running full nodes which helps network decentralization.

Thanks to Merkle trees, there is an efficient way to verify that some data exists in a root hash. Much better to store just ONE root hash representing all the transactions per block!

### Merkle Proofs
The benefit of the Merkle tree design -- a recursive hashing-based algorithm -- is that it allows for efficient proof that some data exists within the root hash construction (actually contained in the block!); in other words, it allows for Merkle proofs. A Merkle proof confirms specific transactions represented by a leaf or branch hash within a Merkle hash root.

So if anyone ever needs to prove that a transaction existed at one point in time in the blockchain, they just need to provide a Merkle proof.


![alt text](https://ethereum.org/static/d971703e4ef95e42df0d02a9ec51ec0b/ba4d9/proof-c.png)


In the diagram above, say you want to prove that C (some random tx) exists in this block. Thanks to Merkle proofs, you only need 3 total pieces of data:

`D`, `H(A-B)`, `H(E-H)` to construct the tree root hash: `H(A-H)`. 

That might not seem like much with such a small tree, but what about a tree containing over 10,000 transactions? If one is able to successfully construct the root hash, then that is proof enough that their transaction was indeed part of that Merkle tree at that time. Data verification FTW!

### Merkle Trees Use Cases
Merkle trees are:
- space and computationally efficient
- good for scalability and decentralization
- no need to pack a block full of transactions… just commit a Merkle root hash to it and keep transactions in other places that can handle them

In deeper terms, they:
1. They significantly reduce the memory needed to verify that data has maintained its integrity and hasn’t been altered.
2. They require less data to be broadcast across the blockchain network to verify data and transactions. This improves the efficiency of a blockchain.
3. They allow for [Simple Payment Verification (SPV)](https://wiki.bitcoinsv.io/index.php/Simplified_Payment_Verification), which helps you to verify a transaction without downloading an entire block or blockchain. This allows you to send and receive transactions using a light-client node — more commonly known as a *crypto wallet*.

When verifying data using a Merkle tree, there is a **Prover** and a **Verifier**:
- A Prover: Does all the calculation to create the merkle root (just a hash!)
- A Verifier: Does not need to know all the values to know *for certain* one value is in the tree

Merkle trees are a huge benefit to the **Verifier**. You either produce a proof successfully, meaning data verification passes, or you don't, meaning your piece of data was not present when the Merkle root hash was calculated (or you performed the calculation wrong!).

### Merkle Tree Vocabulary Summary

Final terminology for Merkle trees:

- **Merkle tree**: a structure used in computer science to validate data
- **Merkle root**: the hash contained in the block header, which is derived from the hashes of all other transactions in the block
- **Merkle path**: represents the information which the user needs to calculate the expected value for the Merkle root for a block, from their own transaction hash contained in that block. The Merkle path is used as part of of the Merkle proof
- **Merkle proof**: proves the existence of a specific transaction in a specific block (without the user needing to examine all the transactions in the block). It includes the Merkle root and the Merkle path

### Conclusion

Merkle trees are a very popular data structure in blockchains. It's important to understand the low-level of blockchain storage and the implications of such decisions. Keeping data storage lean and efficient is the reason behind using structures like Merkle trees - this understanding is essential as you start building out dApps, you always want to be lean and efficient with your data storage. Why? Because on Ethereum, the less efficient your use of data storage, the more expensive your program will be for you and your users.

