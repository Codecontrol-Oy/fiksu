import React from 'react'
import Block from '../atoms/block'
import Paragraph from '../atoms/paragraph'
import Money from '../../images/money.svg'
import Heading from '../atoms/heading'

const InformationBlockReverse = props => {

    return (
        <Block className="information-block-wrapper-reverse">
            <Block className="information-block-text-reverse">
                <Heading variant={1}>
                    Selvää Säästöä
                </Heading>
                <Paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem.  Aliquam erat volutpat. Donec placerat nisl magna, et faucibus arcu condimentum sed.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem.
                </Paragraph>
            </Block>
            <Block className="information-block-image-reverse">
                {/* <img src={Money} /> */}
                <i class="icofont-coins"></i>
            </Block>
        </Block>
    )

}
export default InformationBlockReverse