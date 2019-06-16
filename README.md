


# Private Blockchain Application

This project was to build a simple private blockchain.


## App running using POSTMAN

1. Request the Genesis block:
    ![Request: http://localhost:8000/block/0 ](./docs/genesis block.png)

2. Make  first request of ownership sending your wallet address:
    ![Request: http://localhost:8000/requestValidation ](./docs/request-validation.png)

3. Submit your Star
     ![Request: http://localhost:8000/submitstar](./docs/submit-star.png)

4. Retrieve Stars owned by me
    ![Request: http://localhost:8000/blocks/<WALLET_ADDRESS>](./docs/get-stars-by-address.png)