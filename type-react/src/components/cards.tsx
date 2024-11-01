import React, { FC } from 'react'


export enum CardsVariant {
    outlined = 'outlined',
    primary = 'primary'
}

interface CardsProps {
    width: string,
    height: string,
    variant: CardsVariant,
    children: React.ReactNode
}

const Cards: FC<CardsProps> = function({width, height, children, variant}){
  return (
    <div style={{width: width, height: height, background: variant === CardsVariant.primary ? 'blue' : 'yellow',
     border: variant === CardsVariant.outlined ? '1px solid black': '4px solid blue' }}>
        {children}
    </div>
  )
}
export default Cards;
