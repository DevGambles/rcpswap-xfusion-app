import { Currency, Token, ETHER, BINANCE_COIN, DEFAULT_CURRENCIES, Blockchain, MATIC_TOKEN } from '@rcpswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import HarmonyLogo from '../../assets/images/ethereum-logo.png'
import BinanceLogo from '../../assets/images/binance-logo.png'
import PolygonLogo from '../../assets/images/polygon-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import baseCurrencies from '../../utils/baseCurrencies'
import useBlockchain from '../../hooks/useBlockchain'

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
export const getTokenFallbackLogoURL = (currency: Currency) =>
  `https://raw.githubusercontent.com/MoonsDusts/rcpswap-tokenlists/main/tokens/${currency.symbol}.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const blockchain = useBlockchain()
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency && DEFAULT_CURRENCIES.includes(currency)) return []

    if (currency instanceof Token) {
      const logoUrlLocation = [56, 97, 137, 42170, 1666700000].includes(currency.chainId)
        ? getTokenFallbackLogoURL(currency)
        : getTokenLogoURL(currency.address)

      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, logoUrlLocation]
      }
      return [logoUrlLocation]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  } else {
    const wrappedCurrency = currency instanceof Token ? baseCurrencies(currency.chainId)[1] : undefined
    if (currency === ETHER || currency === (wrappedCurrency && blockchain === Blockchain.NOVA)) {
      return <StyledEthereumLogo src={HarmonyLogo} size={size} style={style} />
    } else if (
      currency === BINANCE_COIN ||
      (currency === wrappedCurrency && blockchain === Blockchain.BINANCE_SMART_CHAIN)
    ) {
      return <StyledEthereumLogo src={BinanceLogo} size={size} style={style} />
    } else if (currency === MATIC_TOKEN || (currency === wrappedCurrency && blockchain === Blockchain.POLYGON)) {
      return <StyledEthereumLogo src={PolygonLogo} size={size} style={style} />
    }
  }
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
