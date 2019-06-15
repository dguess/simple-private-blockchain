const Blockchain = require('../src/blockchain').Blockchain;
const Block = require('../src/block').Block;

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
    // validate the block
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
    // validate the block
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
      // validate the block
      expect(block.previousBlockHash === blockchain.chain[0].hash).toBe(true);

    })
});