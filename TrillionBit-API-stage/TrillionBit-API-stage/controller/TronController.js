const axios = require('axios');
const request = require("request");
const keys = require('../config/key');
const TronWeb = require('tronweb');

var Address = require('./trx/models/wallets');

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { "TRON-PRO-API-KEY": keys.tronAPI },
  privateKey: 'e9cc43510f95d47c84671b58328318c7b52de7d3ff34a0b98b7a077ac204da05',
})


const tronWebBtx = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { "TRON-PRO-API-KEY": keys.tronAPI },
  privateKey: '5142ec72033c05854b6df4ea42aa8a295e4b8c4ed3320dddb712d400ae71fa63',
})
// Old PK   
const tronAirWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { "TRON-PRO-API-KEY": keys.tronAPI },
  privateKey: '5da89e6615ae75a61a537ac8c902100e505425d495ad1de37d2f0b36a8ddb671',
})

const createWallet = async () => {
	// console.log('Creating tron wallet....');
  const newWallet = TronWeb.utils.accounts.generateAccount();
  if (newWallet.privateKey) {
    var data = {};
    data.address = newWallet.address.base58;
    data.privateKey = newWallet.privateKey;
    data.publicKey = newWallet.publicKey;
    var newAddress = Address(data);
    newAddress.save(function(err, address) {
      if (err) {
        // deferred.reject(err);
      } else {
        // deferred.resolve(address);
      }
    });
    return data;
  } else {
    return false;
  }
}

const createBtxWallet = async () => {
  // console.log('Creating btx tron wallet....');
  const newWallet = await tronWeb.createAccount();
  if (newWallet.privateKey) {
    var data = {};
    data.address = newWallet.address.base58;
    data.privateKey = newWallet.privateKey;
    data.publicKey = newWallet.publicKey;
    var newAddress = Address(data);
    newAddress.save(function(err, address) {
      if (err) {
        // deferred.reject(err);
      } else {
        // deferred.resolve(address);
      }
    });
    return data;
  } else {
    return false;
  }
  // tronWeb.contract(["TEJ278Wc4spE7p4a4Lop1QT9TUBnaZYB82"])
}

const sendAirBtx = async (fromAddress, toAdress, amount) => {
  const trc20ContractAddress = "TEJ278Wc4spE7p4a4Lop1QT9TUBnaZYB82"; //mainnet USDT contract
  const addressFrom = 'TPRahwxAcwMPNbNDwBTvQGywpggSSmAWU4';

  try {
      let contract = await tronAirWeb.contract().at(trc20ContractAddress);
      //Use call to execute a pure or view smart contract method.
      // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
      let result = await contract.balanceOf(addressFrom).call();
      // console.log('result: ', tronAirWeb.toDecimal(result._hex)/1e18);

      await contract.transfer(
          // addressFrom, //address _from
          toAdress, //address _to
          tronAirWeb.toHex(`${parseInt(amount)*1e18}`) //amount
      ).send({
          feeLimit: 10000000
      }).then(output => {
        // console.log('- Output:', output, '\n');
        return true;
      });
      return true;
  } catch(error) {
      console.error("trigger smart contract error", error);
      return false;
  }
}

const getBalance = async (address) => {

  try{
    let result = await tronWeb.trx.getBalance(address);
    result = parseFloat(result)/1000000;
    console.log(result);
    return result;
  }
  catch (e) {
    return false;
  }
  
}

const getTRCBalance = async (address) => {

  const trc20ContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
  try{
    let contract = await tronWeb.contract().at(trc20ContractAddress);
    let result = await contract.balanceOf(addressFrom).call();
    result = parseFloat(result)/1000000;
    console.log(result);
    return result;
  }
  catch (e) {
    return false;
  }
  
}

const sendBtx = async (addressFrom, toAdress, amount) => {
  const trc20ContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; //mainnet USDT contract
  //const addressFrom = 'TJ4Y59vLnMH5TWM6uQwRLF3UAiLaQrfE4R';

  try {
      let contract = await tronWeb.contract().at(trc20ContractAddress);
      //Use call to execute a pure or view smart contract method.
      // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
      let result = await contract.balanceOf(addressFrom).call();
      // console.log('result: ', tronWeb.toDecimal(result._hex)/1e18);
      amount = amount * 1000000;

      await contract.transfer(
          // addressFrom, //address _from
          toAdress, //address _to
          tronWeb.toHex(`${parseInt(amount)}`) //amount
      ).send({
          feeLimit: 20000000
      }).then(output => {
        // console.log('- Output:', output, '\n');
        return true;
      });
      return true;
  } catch(error) {
      console.error("trigger smart contract error", error);
      return false;
  }
}

const sendFromAdmin = async (toAdress, amount) => {
  const trc20ContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; //mainnet USDT contract
  //const addressFrom = 'TJ4Y59vLnMH5TWM6uQwRLF3UAiLaQrfE4R';

  try {
      let contract = await tronWeb.contract().at(trc20ContractAddress);
      //Use call to execute a pure or view smart contract method.
      // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
      // let result = await contract.balanceOf(addressFrom).call();
      // console.log('result: ', tronWeb.toDecimal(result._hex)/1e18);
      amount = amount * 1000000;
      let txxx = "";

      await contract.transfer(
          // addressFrom, //address _from
          toAdress, //address _to
          tronWeb.toHex(`${parseInt(amount)}`) //amount
      ).send({
          feeLimit: 30000000
      }).then(output => {
        console.log('- Output:', output, '\n');
        txxx = output;
        return output;
      });
      return txxx;
  } catch(error) {
      console.error("trigger smart contract error", error);
      return false;
  }
}



const sendFromAdminBtx = async (toAdress, amount) => {
  const trc20ContractAddress = "TEJ278Wc4spE7p4a4Lop1QT9TUBnaZYB82"; //mainnet USDT contract
  //const addressFrom = 'TJ4Y59vLnMH5TWM6uQwRLF3UAiLaQrfE4R';

  try {
      let contract = await tronWebBtx.contract().at(trc20ContractAddress);
      //Use call to execute a pure or view smart contract method.
      // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
      // let result = await contract.balanceOf(addressFrom).call();
      // console.log('result: ', tronWeb.toDecimal(result._hex)/1e18);
      amount = amount * 1E18;
      let txxx = "";

      await contract.transfer(
          // addressFrom, //address _from
          toAdress, //address _to
          tronWebBtx.toHex(`${parseInt(amount)}`) //amount
      ).send({
          feeLimit: 30000000
      }).then(output => {
        console.log('- Output:', output, '\n');
        txxx = output;
        return output;
      });
      return txxx;
  } catch(error) {
      console.error("trigger smart contract error", error);
      return false;
  }
}

const sendToAdmin = async (pk, addressFrom) => {

  const tronWeb2 = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": keys.tronAPI },
    privateKey: pk,
  })
  
  const trc20ContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; //mainnet USDT contract
  //const addressFrom = 'TJ4Y59vLnMH5TWM6uQwRLF3UAiLaQrfE4R';
  const toAdress = "TPyQc1exVF75yvY3jPkgNQ7AbKcMAJP7Uj";

  try {
      let contract = await tronWeb2.contract().at(trc20ContractAddress);
      //Use call to execute a pure or view smart contract method.
      // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
      let result = await contract.balanceOf(addressFrom).call();
      

      let TRXresult = await tronWeb.trx.getBalance(addressFrom);
      TRXresult = parseFloat(TRXresult)/1000000;
      
      if(TRXresult < 20) {
        console.error("TRX balance not sufficient");
        return false;
      }
      
      if((result/1000000) > 1) {
        await contract.transfer(
            // addressFrom, //address _from
            toAdress, //address _to
            tronWeb2.toHex(`${parseInt(result)}`) //amount
        ).send({
            feeLimit: 20000000
        }).then(output => {
          console.log('- Output:', output, '\n');
          return true;
        });
        return true;
      }
      else {
        console.log("USDT Balance not enough");
        return false;
      }
      
  } catch(error) {
      console.error("trigger smart contract error", error);
      return false;
  }
}

const sendTrx = async (toAdress, amount) => {
  
  const sunAmount = parseFloat(amount) * 1000000;
  
  try {
    const sendTrxRes = await tronWeb.trx.sendTransaction(toAdress, sunAmount);
    if (sendTrxRes.result) {
      return {
        txid: sendTrxRes.txid,
      }
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }

}

const transactions = async (address, contract=false) => {
  return await axios.get(`https://api.trongrid.io/v1/accounts/${address}/transactions`, { headers: {'Content-Type': 'application/json', "TRON-PRO-API-KEY": keys.tronAPI} },)
    .then(async res => {
      if (res.data.success) {
        let row_trx_list = [];
        for (row_data of res.data.data) {
          // console.log(await tronWeb.address.fromHex(row_data.raw_data.contract[0].parameter.value.to_address));
          // if (row_data.raw_data.data) {
            let row_tx = {}
            row_tx.txid = row_data.txID;
            row_tx.amount = parseFloat(row_data.raw_data.contract[0].parameter.value.amount)/1000000;
            // row_tx.fee = parseFloat(row_data.net_fee)/1000000;
            row_tx.fee = 0;
            row_tx.confirmations = '';
            row_tx.time = row_data.block_timestamp;
            row_tx.senderAddress = await tronWeb.address.fromHex(row_data.raw_data.contract[0].parameter.value.owner_address);
            row_tx.receiverAddress = await tronWeb.address.fromHex(row_data.raw_data.contract[0].parameter.value.to_address);
            row_trx_list.push(row_tx);
          // }
        }
        return row_trx_list;
      } else {
        return [];
      }
    })
    .catch(err => {
      // console.log(err);
      return [];
    });
}

const trc20Transactions = async (address, contract=false) => {
  return await axios.get(`https://api.trongrid.io/v1/accounts/${address}/transactions/trc20`, { headers: {'Content-Type': 'application/json', "TRON-PRO-API-KEY": keys.tronAPI} },)
    .then(async res => {
      if (res.data.success) {
        let row_trx_list = [];
        for (row_data of res.data.data) {
            let row_tx = {}
            row_tx.txid = row_data.transaction_id;
            row_tx.amount = parseFloat(row_data.value)/(1000000);
            row_tx.fee = 0;
            row_tx.confirmations = '';
            row_tx.time = row_data.block_timestamp;
            row_tx.senderAddress = row_data.from;
            row_tx.receiverAddress = row_data.to;
            row_trx_list.push(row_tx);
        }
        return row_trx_list;
      } else {
        return [];
      }
    })
    .catch(err => {
      // console.log(err);
      return [];
    });
}


module.exports = {
	createWallet,
  transactions,
  trc20Transactions,
  createBtxWallet,
  sendTrx,
  sendBtx,
  sendAirBtx,
  getBalance,
  sendToAdmin,
  sendFromAdmin,
  getTRCBalance,
  sendFromAdminBtx
};
