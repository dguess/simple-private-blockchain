const BlockchainClass = require('../src/blockchain');
const BlockClass = require('../src/block');

test('validate a block that has not been tampered with', () => {
  // create new block
  let blockchain = new BlockchainClass.Blockchain();
  blockchain._addBlock(new BlockClass.Block({ data: 'Test Block' }));

  return blockchain.getBlockByHeight(1)
    .then(data => {
      // validate the block
      return data.validate();

    }).then(data => {
      expect(data).toBe(true);

    })
});

test('validate a block has been tampered with', () => {
  // create new block and mess with the hash
  let blockchain = new BlockchainClass.Blockchain();
  blockchain._addBlock(new BlockClass.Block({ data: 'Test Block' }));
  blockchain.chain[1].hash = blockchain.chain[1].hash + 'changed';

  return blockchain.getBlockByHeight(1)
    .then(data => {
      // validate the block
      return data.validate();

    }).then(data => {  
      expect(data).toBe(false);

    })
});