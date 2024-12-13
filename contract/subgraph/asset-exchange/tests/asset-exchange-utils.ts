import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  BoxBought,
  BoxCreated,
  OfferAccepted,
  OfferCanceled,
  OfferCreated,
  OfferUpdated
} from "../generated/AssetExchange/AssetExchange"

export function createBoxBoughtEvent(
  boxId: BigInt,
  buyer: Address,
  tokenInfoIndex: BigInt
): BoxBought {
  let boxBoughtEvent = changetype<BoxBought>(newMockEvent())

  boxBoughtEvent.parameters = new Array()

  boxBoughtEvent.parameters.push(
    new ethereum.EventParam("boxId", ethereum.Value.fromUnsignedBigInt(boxId))
  )
  boxBoughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  boxBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "tokenInfoIndex",
      ethereum.Value.fromUnsignedBigInt(tokenInfoIndex)
    )
  )

  return boxBoughtEvent
}

export function createBoxCreatedEvent(
  boxId: BigInt,
  owner: Address
): BoxCreated {
  let boxCreatedEvent = changetype<BoxCreated>(newMockEvent())

  boxCreatedEvent.parameters = new Array()

  boxCreatedEvent.parameters.push(
    new ethereum.EventParam("boxId", ethereum.Value.fromUnsignedBigInt(boxId))
  )
  boxCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return boxCreatedEvent
}

export function createOfferAcceptedEvent(
  offerId: BigInt,
  boxId: BigInt,
  boxOwner: Address
): OfferAccepted {
  let offerAcceptedEvent = changetype<OfferAccepted>(newMockEvent())

  offerAcceptedEvent.parameters = new Array()

  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam("boxId", ethereum.Value.fromUnsignedBigInt(boxId))
  )
  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam("boxOwner", ethereum.Value.fromAddress(boxOwner))
  )

  return offerAcceptedEvent
}

export function createOfferCanceledEvent(
  offerId: BigInt,
  offerer: Address
): OfferCanceled {
  let offerCanceledEvent = changetype<OfferCanceled>(newMockEvent())

  offerCanceledEvent.parameters = new Array()

  offerCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  offerCanceledEvent.parameters.push(
    new ethereum.EventParam("offerer", ethereum.Value.fromAddress(offerer))
  )

  return offerCanceledEvent
}

export function createOfferCreatedEvent(
  offerId: BigInt,
  boxId: BigInt,
  offerer: Address
): OfferCreated {
  let offerCreatedEvent = changetype<OfferCreated>(newMockEvent())

  offerCreatedEvent.parameters = new Array()

  offerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam("boxId", ethereum.Value.fromUnsignedBigInt(boxId))
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam("offerer", ethereum.Value.fromAddress(offerer))
  )

  return offerCreatedEvent
}

export function createOfferUpdatedEvent(
  offerId: BigInt,
  offerer: Address
): OfferUpdated {
  let offerUpdatedEvent = changetype<OfferUpdated>(newMockEvent())

  offerUpdatedEvent.parameters = new Array()

  offerUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  offerUpdatedEvent.parameters.push(
    new ethereum.EventParam("offerer", ethereum.Value.fromAddress(offerer))
  )

  return offerUpdatedEvent
}
