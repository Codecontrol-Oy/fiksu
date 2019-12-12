import React from 'react'


const AccountHeader = props => {

    return (
        <header className="account-header">
            <nav>
                {props.children}
            </nav>
        </header>
    )

}

export default AccountHeader