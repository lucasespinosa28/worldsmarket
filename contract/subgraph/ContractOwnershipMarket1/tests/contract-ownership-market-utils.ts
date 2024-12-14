import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ContractListed,
  ContractPurchased,
  ListingActivated,
  ListingCanceled,
  OwnershipTransferred
} from "../generated/ContractOwnershipMarket/ContractOwnershipMarket"

export function createContractListedEvent(
  contractAddress: Address,
  owner: Address,
  token: Address,
  price: BigInt
): ContractListed {
  let contractListedEvent = changetype<ContractListed>(newMockEvent())

  contractListedEvent.parameters = new Array()

  contractListedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  contractListedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  contractListedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  contractListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return contractListedEvent
}

export function createContractPurchasedEvent(
  contractAddress: Address,
  buyer: Address,
  price: BigInt
): ContractPurchased {
  let contractPurchasedEvent = changetype<ContractPurchased>(newMockEvent())

  contractPurchasedEvent.parameters = new Array()

  contractPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  contractPurchasedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  contractPurchasedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return contractPurchasedEvent
}

export function createListingActivatedEvent(
  contractAddress: Address
): ListingActivated {
  let listingActivatedEvent = changetype<ListingActivated>(newMockEvent())

  listingActivatedEvent.parameters = new Array()

  listingActivatedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )

  return listingActivatedEvent
}

export function createListingCanceledEvent(
  contractAddress: Address
): ListingCanceled {
  let listingCanceledEvent = changetype<ListingCanceled>(newMockEvent())

  listingCanceledEvent.parameters = new Array()

  listingCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )

  return listingCanceledEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
