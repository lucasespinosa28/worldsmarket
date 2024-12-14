import {
  ContractListed as ContractListedEvent,
  ContractPurchased as ContractPurchasedEvent,
  ListingActivated as ListingActivatedEvent,
  ListingCanceled as ListingCanceledEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/ContractOwnershipMarket/ContractOwnershipMarket"
import {
  ContractListed,
  ContractPurchased,
  ListingActivated,
  ListingCanceled,
  OwnershipTransferred
} from "../generated/schema"

export function handleContractListed(event: ContractListedEvent): void {
  let entity = new ContractListed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractAddress = event.params.contractAddress
  entity.owner = event.params.owner
  entity.token = event.params.token
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContractPurchased(event: ContractPurchasedEvent): void {
  let entity = new ContractPurchased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractAddress = event.params.contractAddress
  entity.buyer = event.params.buyer
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingActivated(event: ListingActivatedEvent): void {
  let entity = new ListingActivated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractAddress = event.params.contractAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingCanceled(event: ListingCanceledEvent): void {
  let entity = new ListingCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractAddress = event.params.contractAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
