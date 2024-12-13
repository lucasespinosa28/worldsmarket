import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { BoxBought } from "../generated/schema"
import { BoxBought as BoxBoughtEvent } from "../generated/AssetExchange/AssetExchange"
import { handleBoxBought } from "../src/asset-exchange"
import { createBoxBoughtEvent } from "./asset-exchange-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let boxId = BigInt.fromI32(234)
    let buyer = Address.fromString("0x0000000000000000000000000000000000000001")
    let tokenInfoIndex = BigInt.fromI32(234)
    let newBoxBoughtEvent = createBoxBoughtEvent(boxId, buyer, tokenInfoIndex)
    handleBoxBought(newBoxBoughtEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BoxBought created and stored", () => {
    assert.entityCount("BoxBought", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BoxBought",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "boxId",
      "234"
    )
    assert.fieldEquals(
      "BoxBought",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "buyer",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BoxBought",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenInfoIndex",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
