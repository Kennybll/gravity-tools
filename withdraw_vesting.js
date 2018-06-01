var {Apis, ChainConfig} = require("gravity-protocoljs-ws");
var {ChainStore,TransactionBuilder, FetchChain, PrivateKey} = require("gravity-protocoljs");
var config = require('./config.json');

ChainConfig.setPrefix('ZGV');
ChainConfig.networks['gravity'] = {
  core_asset: 'ZGV',
  address_prefix: 'ZGV',
  chain_id: 'ab5071857c28ddbc872d0ca508725fa3006ea7bdfda10f707433021f570fc27e'
};

var privKey = config.active_private_key;
let pKey = PrivateKey.fromWif(privKey);

Apis.instance("wss://grvapi.graphenelab.org/ws", true).init_promise.then(async (res) => {
    Apis.instance()
      .db_api()
      .exec("get_vesting_balances", [config.account])
      .then(async balances => {
        balances = balances.map(b => {
          balance = b.balance.amount;
          cvbAsset = ChainStore.getAsset(b.balance.asset_id);
          earned = b.policy[1].coin_seconds_earned;
          vestingPeriod = b.policy[1].vesting_seconds;
          availablePercent =
            vestingPeriod === 0 ? 1 : earned / (vestingPeriod * balance);
          return {balance: availablePercent * balance / 100000, asset: b.balance.asset_id, id: b.id, owner: b.owner };
        });
        balances.forEach(balance => {
          if (Math.floor(balance.balance) > 6) {
            let tr = new TransactionBuilder();
            tr.add_type_operation("vesting_balance_withdraw", {
              fee: {amount: "0", asset_id: "1.3.0"},
              owner: balance.owner,
              vesting_balance: balance.id,
              amount: {
                  amount: Math.floor(balance.balance),
                  asset_id: balance.asset
              }
            });
            tr.set_required_fees().then(() => {
              tr.add_signer(pKey, pKey.toPublicKey().toPublicKeyString());
              tr.broadcast();
            });
          }
        });
        process.exit()
      }).catch(e => console.log(e))
});