import { ethers } from 'ethers';
import logo from '../assets/logo.svg';

const Navigation = ({ account, setAccount }) => {

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  }

  return (
    <nav>
      <div className='nav__brand'>
        <img src={logo} alt="Logo" />
        <h1>NFT Generator for Stable Diffusion 2.1</h1>
      </div>
      {account ? (
        <button
          type="button"
          className="nav__connect"
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <div className='nav__connect'>
          <button
            type="button"
            onClick={connectHandler}
          >
            Connect
          </button>
          <p className='nav__connect-label'>
            Please connect with your MetaMask Wallet to show available domains.
          </p>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
