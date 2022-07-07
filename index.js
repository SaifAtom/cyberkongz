const { POSClient, use } = require('@maticnetwork/maticjs')
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const dotenv = require('dotenv');
const env = dotenv.config()


// install web3 plugin
use(Web3ClientPlugin);


const execute = async () => {

const privateKey = process.env.PRIVATEKEY
const mainRPC = process.env.MAINRPC
const childRPC = process.env.CHILDRPC
const fromAddress = process.env.ADDRESS

const posClient = new POSClient();

//init POS bridge
await posClient.init({
    network: 'mainnet',
    version: 'v1',
    parent: {
      provider: new HDWalletProvider(privateKey, mainRPC),
      defaultConfig: {
        from : fromAddress
      }
    },
    child: {
      provider: new HDWalletProvider(privateKey, childRPC),
      defaultConfig: {
        from : fromAddress
      }
    }
});

//run withdraw_exit_on_index
const erc721Token = posClient.erc721('0x8884fbca23d2c64a7d526731ac93d2d1c9a428fb', true)
console.log(erc721Token)
const result = await erc721Token.withdrawExitOnIndex(
  '0x745de6139122008ae474d17724b4741cf6b887bd2707e459053ede7ee821e1e5',
  0
)

const txHash = await result.getTransactionHash()
console.log('txHash', txHash)
const receipt = await result.getReceipt()
console.log('receipt', receipt)

}
execute()
.then(() => {})
.catch(err => {
  console.error('err', err)
})
.finally(_ => {
  process.exit(0)
})
