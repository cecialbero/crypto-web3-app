import { useEffect, useState, createContext, ChangeEvent } from 'react'
import { ethers } from 'ethers'
import { ExternalProvider } from '@ethersproject/providers'

import { contractABI, contractAddress } from '../utils/constants'

declare global {
  interface Window {
    ethereum: ExternalProvider
  }
}

type FormData = {
  addressTo: string;
  amount: string;
  keyword: string;
  message: string
}

export const TransactionContext = createContext({
  connectWallet: () => {},
  currentAccount: '',
  formData: {
    addressTo: '',
    amount: '',
    keyword: '',
    message: ''
  },
  setFormData: {},
  handleChange: (e: ChangeEvent<HTMLInputElement>, name: string) => {},
  sendTransaction: () => {},
  transactions: [],
  isLoading: false,
  transactionCount: 0
})

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    // transactionContract: contains the contract methods
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

    return transactionContract
}

export const TransactionProvider = ({ children}: any) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [formData, setFormData] = useState<FormData>({ 
    addressTo: '',
    amount: '',
    keyword: '',
    message: '' 
  })
  const [isLoading, setIsLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(0)
  const [transactions, setTransactions] = useState([])

  const handleChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    setFormData((prevState)=> ({...prevState, [name]: e.target.value}))
  }

  const getAllTransactions = async () => {
    try {
      if (window.ethereum) {
        const transactionsContract = getEthereumContract();

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction: any) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log('Ethereum is not present');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if(!window.ethereum) return alert('Please install metamask')

      const accounts = await window?.ethereum?.request?.({ method: 'eth_accounts' })
      if(accounts.length) {
        setCurrentAccount(accounts[0])
        getAllTransactions()
      } else {
        
      }
    } catch(error) {
      console.log(error)
      throw new Error('No ethereum object')
    }
  }

  const checkIfTransactionsExists = async () => {
    try {
      if (window.ethereum) {
        const transactionsContract = getEthereumContract()
        const currentTransactionCount = await transactionsContract.getTransactionCount()

        window.localStorage.setItem('transactionCount', currentTransactionCount)
      }
    } catch (error) {
      console.log(error)

      // throw new Error('No ethereum object')
    }
  }

  const connectWallet = async () => {
    try {
      if(!window.ethereum) return alert('Please install metamask')

      const accounts = await window?.ethereum?.request?.({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
      window.location.reload()
    } catch(error) {
      console.log(error)
      throw new Error('No ethereum object')
    }
  }

  const sendTransaction = async () => {
    try {
      if(!window.ethereum) return alert('Please install metamask')

      const { addressTo, amount, keyword, message } = formData
      const transactionContract = getEthereumContract()
      const parsedAmount = ethers.utils.parseEther(amount)

      await window?.ethereum?.request?.({ 
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: '0x5208', // in hexadecimal = 2100 GWEI
          value: parsedAmount._hex // decimals to hexadecimal
        }]
      })

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)

      setIsLoading(true)
      await transactionHash.wait() // waits for the transaction is finished
      setIsLoading(false)

      const transactionCount = await transactionContract.getTransactionCount()
      setTransactionCount(transactionCount.toNumber())
    } catch(error) {
      console.log(error)
      throw new Error('No ethereum object')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    checkIfTransactionsExists()
  }, [transactionCount])

  return (
    <TransactionContext.Provider value={{ 
      connectWallet,
      currentAccount,
      formData,
      setFormData,
      handleChange,
      sendTransaction,
      isLoading,
      transactions,
      transactionCount
    }}>
      {children}
    </TransactionContext.Provider>
  )
}