const extend = require('xtend')
const createRandomId = require('json-rpc-random-id')()

module.exports = EthQuery


function EthQuery(provider){
  const self = this
  self.currentProvider = provider
}

//
// base queries
//

// default block
EthQuery.prototype.getBalance =                          generateFnWithDefaultBlockFor(2, 'platon_getBalance')
EthQuery.prototype.getCode =                             generateFnWithDefaultBlockFor(2, 'platon_getCode')
EthQuery.prototype.getTransactionCount =                 generateFnWithDefaultBlockFor(2, 'platon_getTransactionCount')
EthQuery.prototype.getStorageAt =                        generateFnWithDefaultBlockFor(3, 'platon_getStorageAt')
EthQuery.prototype.call =                                generateFnWithDefaultBlockFor(2, 'platon_call')
// standard
EthQuery.prototype.protocolVersion =                     generateFnFor('platon_protocolVersion')
EthQuery.prototype.syncing =                             generateFnFor('platon_syncing')
EthQuery.prototype.coinbase =                            generateFnFor('platon_coinbase')
EthQuery.prototype.mining =                              generateFnFor('platon_mining')
EthQuery.prototype.hashrate =                            generateFnFor('platon_hashrate')
EthQuery.prototype.gasPrice =                            generateFnFor('platon_gasPrice')
EthQuery.prototype.accounts =                            generateFnFor('platon_accounts')
EthQuery.prototype.blockNumber =                         generateFnFor('platon_blockNumber')
EthQuery.prototype.getBlockTransactionCountByHash =      generateFnFor('platon_getBlockTransactionCountByHash')
EthQuery.prototype.getBlockTransactionCountByNumber =    generateFnFor('platon_getBlockTransactionCountByNumber')
EthQuery.prototype.getUncleCountByBlockHash =            generateFnFor('platon_getUncleCountByBlockHash')
EthQuery.prototype.getUncleCountByBlockNumber =          generateFnFor('platon_getUncleCountByBlockNumber')
EthQuery.prototype.sign =                                generateFnFor('platon_sign')
EthQuery.prototype.sendTransaction =                     generateFnFor('platon_sendTransaction')
EthQuery.prototype.sendRawTransaction =                  generateFnFor('platon_sendRawTransaction')
EthQuery.prototype.estimateGas =                         generateFnFor('platon_estimateGas')
EthQuery.prototype.getBlockByHash =                      generateFnFor('platon_getBlockByHash')
EthQuery.prototype.getBlockByNumber =                    generateFnFor('platon_getBlockByNumber')
EthQuery.prototype.getTransactionByHash =                generateFnFor('platon_getTransactionByHash')
EthQuery.prototype.getTransactionByBlockHashAndIndex =   generateFnFor('platon_getTransactionByBlockHashAndIndex')
EthQuery.prototype.getTransactionByBlockNumberAndIndex = generateFnFor('platon_getTransactionByBlockNumberAndIndex')
EthQuery.prototype.getTransactionReceipt =               generateFnFor('platon_getTransactionReceipt')
EthQuery.prototype.getUncleByBlockHashAndIndex =         generateFnFor('platon_getUncleByBlockHashAndIndex')
EthQuery.prototype.getUncleByBlockNumberAndIndex =       generateFnFor('platon_getUncleByBlockNumberAndIndex')
EthQuery.prototype.getCompilers =                        generateFnFor('platon_getCompilers')
EthQuery.prototype.compileLLL =                          generateFnFor('platon_compileLLL')
EthQuery.prototype.compileSolidity =                     generateFnFor('platon_compileSolidity')
EthQuery.prototype.compileSerpent =                      generateFnFor('platon_compileSerpent')
EthQuery.prototype.newFilter =                           generateFnFor('platon_newFilter')
EthQuery.prototype.newBlockFilter =                      generateFnFor('platon_newBlockFilter')
EthQuery.prototype.newPendingTransactionFilter =         generateFnFor('platon_newPendingTransactionFilter')
EthQuery.prototype.uninstallFilter =                     generateFnFor('platon_uninstallFilter')
EthQuery.prototype.getFilterChanges =                    generateFnFor('platon_getFilterChanges')
EthQuery.prototype.getFilterLogs =                       generateFnFor('platon_getFilterLogs')
EthQuery.prototype.getLogs =                             generateFnFor('platon_getLogs')
EthQuery.prototype.getWork =                             generateFnFor('platon_getWork')
EthQuery.prototype.submitWork =                          generateFnFor('platon_submitWork')
EthQuery.prototype.submitHashrate =                      generateFnFor('platon_submitHashrate')

// network level

EthQuery.prototype.sendAsync = function(opts, cb){
  const self = this
  self.currentProvider.sendAsync(createPayload(opts), function(err, response){
    if (!err && response.error) err = new Error('EthQuery - RPC Error - '+response.error.message)
    if (err) return cb(err)
    cb(null, response.result)
  })
}

// util

function generateFnFor(methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function generateFnWithDefaultBlockFor(argCount, methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    // set optional default block param
    if (args.length < argCount) args.push('latest')
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function createPayload(data){
  return extend({
    // defaults
    id: createRandomId(),
    jsonrpc: '2.0',
    params: [],
    // user-specified
  }, data)
}
