import React, { useState, useEffect } from 'react'


function useRipple() {


    const trigger = ref => {
        ref.current.classList.add("ripple-effect")

        setTimeout(() => {
            if (ref.current)
                ref.current.classList.remove("ripple-effect")
        }, 300)

    }

    return [trigger]

}
export default useRipple
