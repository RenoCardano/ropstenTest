import { useEffect, useState } from "react";
import {useEth} from "../../contexts/EthContext";
import { Button } from "../../ui/Button";

export default function ProposalForm({ setValue, setProposalID, setError}) {
  const { state: { contract, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");
  let [proposal, setProposal] = useState([])
  let {description, voteCount} = proposal;
  const [loading, setLoading] = useState(false)

    const showProposal = async (e) => {
      e.preventDefault(); 
      setLoading(true)
      const data = parseInt(e.target[0].value, 10);

      await contract.methods.getOneProposal(data).call({ from: accounts[0] }).then(response => {
        setProposal(response)
        console.log(response)
      }).catch(error => {
        console.log("erreur dans async proposal form")
        console.error(error.message);
        setError(error.message)
      }); 
      setLoading(false);
    }

    
  const handleSubmit = async (e)  => {
      e.preventDefault(); 
      setLoading(true)
      const data = e.target[0].value;
      
        await contract.methods.addProposal(data.toString()).send({ from: accounts[0] }).then(response => {
          setValue(response.events.ProposalRegistered)
          setProposalID(prevArray => [...prevArray, parseInt(response.events.ProposalRegistered.returnValues.proposalId, 10)] )
        }).catch(error => {
          setError(getRPCErrorMessage(error))
        }); 
        setLoading(false);
      }

  function getRPCErrorMessage(err){
    var open = err.stack.indexOf('{')
    var close = err.stack.lastIndexOf('}')
    var j_s = err.stack.substring(open, close + 1);
    var j = JSON.parse(j_s);
    var reason = j.data[Object.keys(j.data)[0]].reason;
    return reason;
}
    
  return (
    <div className="container-fluid" >
      <div className="card bg-light text-dark border-grey">

    <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label for="exampleInputEmail1">Enter a proposal</label>
            <input type="text" name="proposal" id="proposal" className="form-control" required />
            <small id="emailHelp" className="form-text text-muted">Please enter a vote proposition.</small>
            </div>
        <Button type="submit" loading={loading}> Enter a proposal </Button>  
    
    </form> 

      <form  onSubmit={showProposal}>
        <div className="form-group">
        <label for="exampleInputPassword1">Enter a proposal ID</label>
            <input type="text" name="proposal" id="proposal" className="form-control" required />
            <small id="emailHelp" className="form-text text-muted">Please write a proposition number to see its description.</small>
          </div>
        <Button type="submit" loading={loading}>Get the proposal</Button>
    </form>
    {description ? <Alert> The proposal : {description} has yet {voteCount} vote(s)</Alert> : null}
    </div>
  </div>

  );
}


export function Alert({ children }) {
  return <div className="alert alert-info">
      {children}
  </div>
}