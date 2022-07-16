import React, { memo } from 'react'
//import PropTypes from 'prop-types'
import { Loader } from '../../ui/Loader'
import { useEffect, useState } from "react";
import {useEth} from "../../contexts/EthContext";


export default function WinnerCard({ winner , setError}) {
  
     return <div className="row">
        {<div className="col-md-4 mb-4" key={winner}>
          <ProposalCard winner={winner} setError={setError}/>
        </div>}
    </div>
}

const ProposalCard = memo(function ({ winner , setError}) {
    const { state: { contract, accounts } } = useEth();
    let [response, setResponse] = useState(false);

    const getProposal = async () => {
   
            await contract.methods.getOneProposal(winner).call({ from: accounts[0] }).then(response => {
              setResponse(response)
              console.log(response)
            }).catch(error => {
                console.log("erreur dans async ProposalCard")
                console.error(error);
                setError(error.message)
              });
    }
    if(winner !== false) {
        getProposal();
    }
 
    return <div className="container-fluid">
        <div className="card bg-light text-dark border-grey">
        <div className="card-body">
            <h5 className="card-title"> 🎉 Here is the winner : 🎉 </h5>
            <p className="card-text">Winner Proposition : {response.description}</p>
            <p className="card-text">This proposal won with : {response.voteCount} votes</p>
        </div>
        </div>
    </div>
})