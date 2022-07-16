import React, { memo } from 'react'
//import PropTypes from 'prop-types'
import { Loader } from '../../ui/Loader'
import { useEffect, useState } from "react";
import {useEth} from "../../contexts/EthContext";
import { Button } from "../../ui/Button";

export default function Proposals({ proposals, setError }) {
  
    if (proposals === [] || proposals === null || proposals === undefined ) {
        return <Loader />
    }

     return <div className="row">
        {proposals.map(proposalId => <div className="col-md-4 mb-4" key={proposalId}>
          <ProposalCard proposalId={proposalId} setError={setError}/>
        </div>)}
    </div>
}

const ProposalCard = memo(function ({ proposalId , setError}) {
    const { state: { contract, accounts } } = useEth();
    let [response, setResponse] = useState(false);

    const getProposal = async () => {

            await contract.methods.getOneProposal(proposalId).call({ from: accounts[0] }).then(response => {
              setResponse(response)
              console.log(response)
            }).catch(error => {
                console.log("erreur dans async winner card")
                console.error(error);
                setError(error.message)
              });
        
    }



    if(proposalId !== null) {
        getProposal();
    }
 
    return <div className="card bg-light text-dark border-grey">
        <div className="card-body">
            <h5 className="card-title">Vote proposition N° {proposalId}</h5>
            <p className="card-text">Proposition : {response.description}</p>
            <p className="card-text">Vote count : {response.voteCount}</p>
            <p className="card-text">To vote for this proposition, please enter {proposalId} when voting! ❤️ </p>
        </div>
    </div>
})