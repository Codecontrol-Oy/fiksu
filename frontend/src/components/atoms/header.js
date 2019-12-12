import React from 'react'


const Header = props => {

    return (
        <header className="main-header">
            <nav>
                {props.children}
            </nav>
        </header>
    )

}

export default Header