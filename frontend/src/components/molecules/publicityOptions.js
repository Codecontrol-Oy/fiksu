import React from 'react'
import { PUBLICITY_SETTINGS } from '../../constants'
import Option from "../atoms/option"

const PublicityOptions = props => {

    let settings = PUBLICITY_SETTINGS

    return settings.map((setting => {
        return <Option value={setting.value} text={setting.text} />
    }))

}
export default PublicityOptions