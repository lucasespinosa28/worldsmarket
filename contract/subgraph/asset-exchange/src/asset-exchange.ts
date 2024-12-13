import {
  BoxBought as BoxBoughtEvent,
  BoxCreated as BoxCreatedEvent,
  OfferAccepted as OfferAcceptedEvent,
  OfferCanceled as OfferCanceledEvent,
  OfferCreated as OfferCreatedEvent,
  OfferUpdated as OfferUpdatedEvent
} from "../generated/AssetExchange/AssetExchange"
import {
  BoxBought,
  BoxCreated,
  OfferAccepted,
  OfferCanceled,
  OfferCreated,
  OfferUpdated
} from "../generated/schema"

export function handleBoxBought(event: BoxBoughtEvent): void {
  let entity = new BoxBought(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.boxId = event.params.boxId
  entity.buyer = event.params.buyer
  entity.tokenInfoIndex = event.params.tokenInfoIndex

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBoxCreated(event: BoxCreatedEvent): void {
  let entity = new BoxCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.boxId = event.params.boxId
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferAccepted(event: OfferAcceptedEvent): void {
  let entity = new OfferAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.boxId = event.params.boxId
  entity.boxOwner = event.params.boxOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferCanceled(event: OfferCanceledEvent): void {
  let entity = new OfferCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.offerer = event.params.offerer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferCreated(event: OfferCreatedEvent): void {
  let entity = new OfferCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.boxId = event.params.boxId
  entity.offerer = event.params.offerer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferUpdated(event: OfferUpdatedEvent): void {
  let entity = new OfferUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.offerer = event.params.offerer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
