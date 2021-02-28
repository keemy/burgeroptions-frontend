const fs = require('fs');
const SolWeb3 = require('@solana/web3.js')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const argv = require('minimist')(process.argv.slice(2));
const ScriptHelpers = require('./helpers');
const SerumJs = require('@project-serum/serum');

const { MARKETS } = SerumJs;

const {
  Account,
  Connection,
  LAMPORTS_PER_SOL,
} = SolWeb3;

// Read the default key file
const solanaConfig = ScriptHelpers.getSolanaConfig();

// Validate the user is on localnet
ScriptHelpers.validateLocalnet(solanaConfig);

;(async () => {
  // Get the default keypair and airdrop some tokens
  const keyBuffer = fs.readFileSync(solanaConfig.keypair_path);
  const payer = new Account(JSON.parse(keyBuffer));

  const connection = new Connection('http://127.0.0.1:8899')
  if (argv.airdrop) {
    const amount = parseInt(argv.airdrop)
    await requestAndWaitForAirdrop(connection, amount * LAMPORTS_PER_SOL, payer);
  }

  // check that a program key file exists
  const serumDexKeypairPath = ScriptHelpers.serumDexProgramKeypair;
  const localDexProgramKeyFileExists = fs.existsSync(serumDexKeypairPath);
  console.log('localDexProgramKeyFileExists', localDexProgramKeyFileExists);
  if (!localDexProgramKeyFileExists) {
    console.log('\nLocalnet keypair file for the Serum dex program does not exists...creating one\n');
    const { stdout, stderr } = await exec(`solana-keygen new --no-passphrase --outfile ${serumDexKeypairPath}`);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  }
  
  const serumDexBinaryExists = fs.existsSync(ScriptHelpers.serumDexBinaryPath);
  if (!serumDexBinaryExists || !!argv.pullDex) {
    const dexProgramId = MARKETS.find(({ deprecated }) => !deprecated).programId;
    console.log('*** dexProgramId', dexProgramId);
    // TODO need to specify this should run on mainnet
    const mainnetConnection = new Connection('https://api.mainnet-beta.solana.com');
    let account = await mainnetConnection.getAccountInfo(dexProgramId);
    fs.writeFileSync(ScriptHelpers.serumDexBinaryPath, account.data)
  }

  // Use the upgradable deployer to deploy the program.
  // TODO use output stream so there is more user feedback that the program is deploying.
  console.log('\nDeploying the Serum dex...\n');
  const { stdout, stderr } = await exec(`solana program deploy --program-id ${serumDexKeypairPath} ${ScriptHelpers.serumDexBinaryPath}`)
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);


})();
