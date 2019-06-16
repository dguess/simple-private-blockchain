const Blockchain = require('../src/blockchain').Blockchain;
const Block = require('../src/block').Block;

const address = "1QTjurwpLqq5fCaPVt6Tjc31xUgfscduV";
const message = "1QTjurwpLqq5fCaPVt6Tjc31xUgfscduV:1560653634:starRegistry";
const signature = "H0i/iGYnBNj9cvUxC6HHUA8WNj0WVtreybhVwNqbhbIXarSb4gutWBlcn9zN1EyI858tlTkxnd/mQ7F89GO6Nx4=";
const star = "test star"

test('the block that has not been tampered with', () => {
  // create new block
  let blockchain = new Blockchain();
  blockchain._addBlock(new Block({ data: 'Test Block' }));

  return blockchain.getBlockByHeight(1)
    .then(block => {
      // validate the block
      return block.validate();

    }).then(isValid => {
      expect(isValid).toBe(true);

    })
});

test('the block has been tampered with', () => {
  // create new block and mess with the hash
  let blockchain = new Blockchain();
  blockchain._addBlock(new Block({ data: 'Test Block' }));
  blockchain.chain[1].hash = blockchain.chain[1].hash + 'changed';

  return blockchain.getBlockByHeight(1)
    .then(block => {
      // validate the block
      return block.validate();

    }).then(isValid => {
      expect(isValid).toBe(false);

    })
});

test('the block has data in it', () => {
  // create new block 
  let blockchain = new Blockchain();
  blockchain._addBlock(new Block({ data: 'Test Block' }));

  // get the block data
  return blockchain.getBlockByHeight(1)
    .then(block => {
      return block.getBData();

    }).then(body => {
      expect(body.data).toBe('Test Block');

    })

});

test('the genesis block returns an error when you try and get the data', () => {
  // create new block 
  let blockchain = new Blockchain();

  // get the block data
  return blockchain.getBlockByHeight(0)
    .then(block => {
      return block.getBData();

    }).catch(error => {
      expect(error).toBe('Error cannot get data for genesis block');

    })

});

test('the block was added to the blockchain with the correct previous hash', () => {
  // create new block
  let blockchain = new Blockchain();
  blockchain._addBlock(new Block({ data: 'Test Block' }));

  return blockchain.getBlockByHeight(1)
    .then(block => {
      // check the hash
      expect(block.previousBlockHash === blockchain.chain[0].hash).toBe(true);
    })
});

test('the block was added to the blockchain with the correct height', () => {
  // create new block
  let blockchain = new Blockchain();
  blockchain._addBlock(new Block({ data: 'Test Block 1' }));
  blockchain._addBlock(new Block({ data: 'Test Block 2' }));

  return blockchain.getBlockByHeight(2)
    .then(block => {
      // check the height is correct
      expect(block.height).toBe(2);
    })
});

test('the message ownership verification is correct for the address', () => {
  // create new block
  let blockchain = new Blockchain();

  return blockchain.requestMessageOwnershipVerification("1QTjurwpLqq5fCaPVt6Tjc31xUgfscduV")
    .then(message => {
      // first segment should be the address
      expect(message.split(":")[0]).toBe("1QTjurwpLqq5fCaPVt6Tjc31xUgfscduV");
      // last segment should be starRegistry     
      expect(message.split(":")[2]).toBe("starRegistry");
    })
});

test('the star was submitted to the blockchain', () => {
  // create new block
  let blockchain = new Blockchain();

  return blockchain.submitStar(address, message, signature, star)
    .then(block => {
      expect(block.height).toBe(1);
    })
});

test('the star was not submitted to the blockchain because the message time was more than 5 minutes old', () => {
  // create new block
  let blockchain = new Blockchain();
  const oldMessage = "1QTjurwpLqq5fCaPVt6Tjc31xUgfscduV:1560574139:starRegistry";
  const oldSignature = "IFQPvP9yZ7/+AzsWTwFIuSvh2gZ3RxGV/yIpFgs+yl8wQ5fjtNZE+HDRDudpxHF5dLZNmu3aK59ifOheh+Dcn0E="

  // submit the star with an old message time
  return blockchain.submitStar(address, oldMessage, oldSignature, star)
    .catch(error => {
      expect(error).toBe("Message time is more than 5 minutes old");
    })
});

test('the star was not submitted to the blockchain because the signature was invalid', () => {
  // create new block
  let blockchain = new Blockchain();
  const invalidSig = signature + "invalid";

  // submit the star with an old message time
  return blockchain.submitStar(address, message, invalidSig, star)
    .catch(error => {
      expect(error).toBe("Unable to verify block");
    })
});

test('the block with the correct hash was retrieved', () => {
  // create new block
  let blockchain = new Blockchain();
  blockchain._addBlock(new Block({ data: 'Test Block 1' }));
  blockchain._addBlock(new Block({ data: 'Test Block 2' }));
  const blockHash2 = blockchain.chain[2].hash;
  blockchain._addBlock(new Block({ data: 'Test Block 3' }));

  return blockchain.getBlockByHash(blockHash2)
    .then(block => {
      expect(block.hash).toBe(blockHash2);

    })
});

test('the stars with the correct address were returned', () => {
  // create new block
  let blockchain = new Blockchain();
  blockchain.submitStar(address, message, signature, "star 1")
  blockchain.submitStar(address, message, signature, "star 2")
  blockchain.submitStar(address, message, signature, "star 3")

  return blockchain.getStarsByWalletAddress(address)
    .then(stars => {
      expect(stars.length).toBe(3);

    })
});

test('the blockchain is valid', () => {
  // create new block
  let blockchain = new Blockchain();
  blockchain.submitStar(address, message, signature, "star 1")
  blockchain.submitStar(address, message, signature, "star 2")
  blockchain.submitStar(address, message, signature, "star 3")

  return blockchain.validateChain()
    .then(result => {
      expect(result).toStrictEqual([]);

    })
});

test('the blockchain has been tampered with', () => {
  // create new block
  let blockchain = new Blockchain();
  blockchain.submitStar(address, message, signature, "star 1")
  blockchain.submitStar(address, message, signature, "star 2")
  blockchain.submitStar(address, message, signature, "star 3")

  blockchain.chain[2].previousHash = null;

  return blockchain.validateChain()
    .then(result => {
      expect(result[0]).toBe("Error: Block 2 is not valid");
    })
});