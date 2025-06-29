import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { GET_WALLET_BALANCE, GET_WALLET_TRANSACTIONS, GET_BANKS } from '@/apollo/queries/wallet'
import { SET_WITHDRAW_BANK, WITHDRAW_TO_BANK } from '@/apollo/mutations/wallet'

interface Bank {
  name: string
  code: string
  slug: string
}

interface WalletTransaction {
  amount: number
  isInflow: boolean
  paymentMethod: string
  currency: string
  status: string
}

const WalletManagement = () => {
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [accountNumber, setAccountNumber] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)

  // Queries
  const { data: balanceData, loading: balanceLoading, refetch: refetchBalance } = useQuery(GET_WALLET_BALANCE, {
    onError: (error) => showErrorToast(error, 'Failed to load wallet balance')
  })

  const { data: transactionsData, loading: transactionsLoading } = useQuery(GET_WALLET_TRANSACTIONS, {
    variables: { page: 1, limit: 10 },
    onError: (error) => showErrorToast(error, 'Failed to load transactions')
  })

  const { data: banksData, loading: banksLoading } = useQuery(GET_BANKS, {
    onError: (error) => showErrorToast(error, 'Failed to load banks')
  })

  // Mutations
  const [setWithdrawBank, { loading: settingBank }] = useMutation(SET_WITHDRAW_BANK, {
    onCompleted: () => {
      showSuccessToast('Bank account set successfully')
      setShowBankModal(false)
      setSelectedBank(null)
      setAccountNumber('')
    },
    onError: (error) => showErrorToast(error, 'Failed to set bank account')
  })

  const [withdrawToBank, { loading: withdrawing }] = useMutation(WITHDRAW_TO_BANK, {
    onCompleted: () => {
      showSuccessToast('Withdrawal initiated successfully')
      setShowWithdrawModal(false)
      setWithdrawAmount('')
      refetchBalance()
    },
    onError: (error) => showErrorToast(error, 'Failed to process withdrawal')
  })

  const handleSetBank = () => {
    if (!selectedBank || !accountNumber) {
      showErrorToast(new Error('Please fill all fields'), 'Validation Error')
      return
    }

    setWithdrawBank({
      variables: {
        bankName: selectedBank.name,
        bankCode: selectedBank.code,
        acctNumber: accountNumber
      }
    })
  }

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      showErrorToast(new Error('Please enter a valid amount'), 'Validation Error')
      return
    }

    withdrawToBank({
      variables: {
        amount: parseInt(withdrawAmount)
      }
    })
  }

  const balance = balanceData?.walletBalance || 0
  const transactions = transactionsData?.walletTxs || []
  const banks = banksData?.getBanks || []

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Wallet Balance</h3>
            <p className="text-3xl font-bold text-green-600">
              ₦{balanceLoading ? '...' : balance.toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBankModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Set Bank
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ArrowUpIcon className="h-4 w-4 mr-2" />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {transactionsLoading ? (
            <div className="px-6 py-4 text-center text-gray-500">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">No transactions yet</div>
          ) : (
            transactions.map((transaction: WalletTransaction, index: number) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${transaction.isInflow ? 'bg-green-100' : 'bg-red-100'}`}>
                    {transaction.isInflow ? (
                      <ArrowDownIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowUpIcon className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.isInflow ? 'Credit' : 'Debit'}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.paymentMethod}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${transaction.isInflow ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.isInflow ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Set Bank Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Set Bank Account</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank</label>
                  <select
                    value={selectedBank?.code || ''}
                    onChange={(e) => {
                      const bank = banks.find((b: Bank) => b.code === e.target.value)
                      setSelectedBank(bank || null)
                    }}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a bank</option>
                    {banks.map((bank: Bank) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter account number"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowBankModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSetBank}
                    disabled={settingBank}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {settingBank ? 'Setting...' : 'Set Bank'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Withdraw Funds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (₦)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter amount"
                    min="0"
                    max={balance}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Available: ₦{balance.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {withdrawing ? 'Processing...' : 'Withdraw'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletManagement 