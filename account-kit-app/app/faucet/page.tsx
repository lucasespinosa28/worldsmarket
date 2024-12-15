import { parseAbi } from "viem";
import MintFakecoin from "./MintFakecoin";
import MintCounter from "./MintCounter";

const fakecoin = {
    abi: parseAbi(["function mint(address,uint256)","function balanceOf(address account)"]),
    address:process.env.NEXT_PUBLIC_FAKECOIN,
}

const Potion = {
    abi: parseAbi(["function safeMint(address,uint256,uint256,bytes memory)"]),
    address:process.env.NEXT_PUBLIC_POTION,
}

const Weapon = {
    abi: parseAbi(["function safeMint(address)"]),
    address:process.env.NEXT_PUBLIC_WEAPON,
}

export default function Facuet(){
    return (<div>
        <MintFakecoin />
        <MintCounter />
    </div>)
}