import { useContractCalls, useEthers } from '@usedapp/core'
import { useGovernanceContract, useGovernanceContractReadonly } from '../useContract'
import { Result } from '@ethersproject/abi'
import { utils } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { TEN_POW } from '@funcblock/dapp-sdk'
import { JsonRpcProvider } from '@ethersproject/providers'
import { READONLY_RPC_URL } from '../../constants/env'

export default function useGovDetailInfo(proposalId: string) {
  const { account } = useEthers()
  const govContract = useGovernanceContract()

  const [proposalResult, votesResult, myVoteInfoResult, stateResult, rewardInfoResult, quorumThresholdResult] = (useContractCalls([
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'proposals',
      args: [proposalId],
    },
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'proposalVotes',
      args: [proposalId],
    },
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'proposalVoteInfo',
      args: [proposalId, account],
    },
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'state',
      args: [proposalId],
    },
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'getClaimableRewardInfo',
      args: [account, proposalId],
    },
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'quorumThresholdBps',
      args: [],
    },
  ]) ?? []) as Result[]
  const [voteRecords, setVoteRecords] = useState<any[] | undefined>(undefined)
  const govContractReadonly = useGovernanceContractReadonly()

  const reloadVoteRecords = useCallback(async () => {
    setVoteRecords(undefined)
    const provider = new JsonRpcProvider(READONLY_RPC_URL)
    const blockNumber = await provider.getBlockNumber()
    const filter = govContractReadonly.filters.VoteCast(null, utils.hexlify(parseInt(proposalId)))
    const events = await govContractReadonly.queryFilter(filter, blockNumber - 7 * 24 * 3600)
    const rows = events.map(i => ({
      proposalId: i.args?.proposalId?.toString(),
      reason: i.args?.reason?.toString(),
      support: i.args?.support?.toString(),
      voter: i.args?.voter?.toString(),
      weight: i.args?.weight?.toString(),
      blockNumber: i.blockNumber,
    }))
    setVoteRecords(rows)
  }, [govContractReadonly, proposalId])

  useEffect(() => {
    reloadVoteRecords().catch(console.error)
  }, [reloadVoteRecords])
  const state: 'Active' | 'Defeated' | 'Succeeded' | 'Invalid' | 'Refunded' = ['Active', 'Defeated', 'Succeeded', 'Invalid', 'Refunded'][stateResult?.[0]] as any

  const myCanVote = useMemo(() => {
    return state === 'Active'
  }, [state])

  return {
    proposer: proposalResult?.proposer.toString(),
    proposerRewardClaimed: proposalResult?.proposerRewardClaimed.toString(),
    refunded: proposalResult?.refunded.toString(),
    totalReward: proposalResult?.totalReward.toString(),
    totalStakeAtStart: proposalResult?.totalStakeAtStart.toString(),
    voteEnd: proposalResult?.voteEnd.toString(),
    voteStart: proposalResult?.voteStart.toString(),
    againstVotes: new BigNumber(votesResult?.againstVotes.toString()).div(TEN_POW(18)).toNumber(),
    forVotes: new BigNumber(votesResult?.forVotes.toString()).div(TEN_POW(18)).toNumber(),
    state,
    voteRecords,
    quorum: quorumThresholdResult?.[0]?.toNumber(),
    myCanVote,
    myReward: new BigNumber(rewardInfoResult?.claimableAmount.toString()),
    myVotes: new BigNumber(myVoteInfoResult?.[0].weight.toString()),
    reloadVoteRecords,
  }
}
