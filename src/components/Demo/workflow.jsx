import React from "react";
import { Button } from "../../ui/Button";
import { useEth } from "../../contexts/EthContext";
import { useState } from "react";

export default function Workflow({ workflow, setEvent, setWorkFlow, setError }) {

    const [loading, setLoading] = useState(false);
    const { state: { contract, accounts } } = useEth();

    const handleStartProposal = async () => {
        setLoading(true);
 
            await contract.methods.startProposalsRegistering().send({ from: accounts[0] }).then(response => {
                setWorkFlow(response.events.WorkflowStatusChange.returnValues.newStatus);
                setEvent(response.events.WorkflowStatusChange);
            }).catch(error => {

                if(error.code ===4001){
                    setError(error.message)
                } else {
                    setError("Transaction reverted by EVM, please ensure you choose the right next")

                }
              });
        setLoading(false);
    }

    const handleEndProposal = async () => {
        setLoading(true);
  
            await contract.methods.endProposalsRegistering().send({ from: accounts[0] }).then(response => {
                setWorkFlow(response.events.WorkflowStatusChange.returnValues.newStatus);
                setEvent(response.events.WorkflowStatusChange);
                console.log(response.events.WorkflowStatusChange.returnValues.newStatus);
            }).catch(error => {
                if(error.code ===4001){
                    setError(error.message)
                } else {
                    setError("Transaction reverted by EVM, please ensure you choose the right next")

                }

              });

        setLoading(false);
    }

    const handleStartVoting = async () => {
        setLoading(true);
 
            await contract.methods.startVotingSession().send({ from: accounts[0] }).then(response => {
                console.log(response.events.WorkflowStatusChange.returnValues.newStatus);
                setWorkFlow(response.events.WorkflowStatusChange.returnValues.newStatus);
                setEvent(response.events.WorkflowStatusChange);

            }).catch(error => {
                if(error.code ===4001){
                    setError(error.message)
                } else {
                    setError("Transaction reverted by EVM, please ensure you choose the right next")
                }

              });
        setLoading(false);
    }

    const handleEndVoting = async () => {
        setLoading(true);
            await contract.methods.endVotingSession().send({ from: accounts[0] }).then(response => {
                setWorkFlow(response.events.WorkflowStatusChange.returnValues.newStatus);
                setEvent(response.events.WorkflowStatusChange);
         
            }).catch(error => {
                if(error.code ===4001){
                    setError(error.message)
                } else {
                    setError("Transaction reverted by EVM, please ensure you choose the right next")
                }
              });
        setLoading(false);
    }

    const disable = function ({workflow, currentWorkflow}) {
        console.log(workflow)
        console.log(currentWorkflow)
        if( workflow == currentWorkflow ) {
            return false;
        } else  {
            return true
        }
    }   

 


    return (<>
        <div className="container-fluid" >
            <div className="card bg-light text-dark border-grey">
   
                <div className="btn-group">
                  <Button loading={loading} disabled={disable({workflow, currentWorkflow: 0})} onClick={() => handleStartProposal()} >Start Proposal </Button> 
                </div> 
                ⏬
                <div className="btn-group">
                    <Button loading={loading} disabled={disable({workflow, currentWorkflow: 1})} onClick={() => handleEndProposal()} >End Proposal </Button>  
                </div> 
                ⏬
                <div className="btn-group">
                    <Button loading={loading} disabled={disable({workflow, currentWorkflow: 2})} onClick={() => handleStartVoting()} >Start Voting </Button>  
                </div> 
                ⏬
                <div className="btn-group">
                    <Button loading={loading} disabled={disable({workflow, currentWorkflow: 3 })} onClick={() => handleEndVoting()} >End Voting </Button>
                </div>
            </div>
        </div>
    </>)
}