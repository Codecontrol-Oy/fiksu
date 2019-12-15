import React, { useEffect } from 'react'
import GridContainer from '../grid/container'
import { useMutation } from "@apollo/react-hooks"
import { withRouter } from "react-router-dom"
import queryString from "query-string"
import * as constants from '../../constants'
import Heading from '../atoms/heading'
import Paragraph from '../atoms/paragraph'
import { MUTATION_VERIFY_PROFILE } from '../../graphqlMutations'

const VerifyProfile = props => {

    const [confirmUser, { loading, error, data }] = useMutation(MUTATION_VERIFY_PROFILE, {

        onCompleted(data) {
            setTimeout(() => {
                props.history.push(constants.ROUTE_REGISTER)
            }, 2500)
        },
        onError(data) {
            setTimeout(() => {
                props.history.push(constants.ROUTE_REGISTER)
            }, 2500)
        }
    })

    useEffect(() => {

        if (queryString.parse(props.location.search)) {
            const values = queryString.parse(props.location.search)
            console.log(values)
            confirmUser({
                variables: {
                    verificationToken: values.token,
                    nickname: values.nickname
                }
            })
        }


    }, [])
    return (
        <GridContainer justify={"center"} direction={"column"} size={12}>
            {data &&
                <>
                    <Heading variant={2}>Tili vahvistettu onnistuneesti!</Heading>
                    <Paragraph>Sinut siirretään kirjautumissivulle.</Paragraph>
                </>
            }
            {error &&
                <>
                    <Heading variant={2} >Virhe vahvistaessa tiliä!</Heading>
                    <Paragraph >Sinut siirretään kirjautumissivulle.</Paragraph>
                </>
            }
        </GridContainer>
    )
}
export default withRouter(VerifyProfile)