import React from 'react'
import styled from 'styled-components'
import {TailSpin} from "react-loader-spinner"

const Loader = () => {
  return (
    <>
        <LoaderContainer>
        <TailSpin
                            height="80"
                            width="80"
                            color="#fff"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            />
        </LoaderContainer>

    </>
  )
}


const LoaderContainer = styled.div`
width: 100%;
height: 100%;
position: fixed;
top: 0;
left: 0;
display: flex;
align-items: center;
justify-content: center;
background-color: rgba(0,0,0,0.2);
z-index: 999;
`

export default Loader
