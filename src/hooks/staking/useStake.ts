import { useCallback } from 'react'
import { useContractFunction, useEthers } from '@usedapp/core'
import BigNumber from 'bignumber.js'
import { useStakingContract } from '../useContract'


export default function useStake() {
  const { account } = useEthers()
  const stakingContract = useStakingContract()
  const { send: stake, state: stakeState } = useContractFunction(stakingContract, 'stake', { transactionName: 'Stake' })
  const { send: unstake, state: unstakeState } = useContractFunction(stakingContract, 'unstake', { transactionName: 'Unstake' })

  const onStake = useCallback(async (amount: BigNumber) => {
    console.info('Staking | stake', amount.toString())
    await stake(amount)
  }, [account, stake])

  const onUnstake = useCallback(async (amount: BigNumber) => {
    console.info('Staking | unstake', amount.toString())
    await unstake(amount)
  }, [account, unstake])

  return {
    onStake,
    stakeLoading: stakeState.status === 'Mining',
    onUnstake,
    unstakeLoading: unstakeState.status === 'Mining',
  }
}
