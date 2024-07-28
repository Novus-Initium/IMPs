import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useEthersProvider() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initProvider() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();

          setProvider(provider);
          setSigner(signer);
          setOwner(address);
        } catch (err) {
          setError(err.message || 'An error occurred while initializing the provider');
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('No Ethereum provider found');
        setIsLoading(false);
      }
    }

    initProvider();
  }, []);

  return { provider, signer, owner, isLoading, error };
}