import React from 'react'
import Block from '../atoms/block'
import Paragraph from '../atoms/paragraph'
import Heading from '../atoms/heading'

const InformationBlock = props => {

    return (
        <Block className="information-block-wrapper">
            <Block className="information-block-image">
                {/* <img src={Money} /> */}
                <i class="icofont-eco-energy"></i>
            </Block>
            <Block className="information-block-text">
                <Heading variant={1}>
                    Selvää Säästöä
                </Heading>
                <Paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem.  Aliquam erat volutpat. Donec placerat nisl magna, et faucibus arcu condimentum sed.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem.
                </Paragraph>
            </Block>

        </Block>
    )

}
export default InformationBlock